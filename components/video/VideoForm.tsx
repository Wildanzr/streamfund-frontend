"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import {
  AVAILABLE_ANIMATIONS,
  AVAILABLE_FONTS,
  AVAILABLE_VIDEO,
} from "@/constant/common";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useCopyToClipboard } from "usehooks-ts";
import Loader from "../shared/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClientSignature } from "@/lib/client";
import axios from "axios";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import Video from "./Video";
import { HexColorPicker } from "react-colorful";

interface VideoFormProps {
  address: string;
  streamkey: string;
  config: VideoConfigResponse;
}

interface VideoProps {
  textSize: number;
  font: string;
  effect: string;
  backgroundColor: string;
  mainColor: string;
  secondColor: string;
}

const formSchema = z.object({
  textSize: z.number(),
  font: z.string(),
  effect: z.string(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  mainColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

const VideoForm = ({ config, streamkey, address }: VideoFormProps) => {
  const [, copy] = useCopyToClipboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  const HOST = `${process.env.NEXT_PUBLIC_BACKEND_URL}?streamKey=${streamkey}`;
  const { socket } = useSocket(HOST);
  const { sendMessage: sendTesting } = useSocketEvent<string>(socket, "test");
  const { sendMessage: sendReload } = useSocketEvent<string>(socket, "reload");

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationKey: ["update-video-config"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/video?streamkey=${streamkey}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = {
        textSize: values.textSize.toString(),
        font: values.font,
        effect: values.effect,
        backgroundColor: values.backgroundColor,
        mainColor: values.mainColor,
        secondColor: values.secondColor,
      };
      const headers = await generateClientSignature({
        method: "PUT",
        timestamp,
        url,
        body: payload,
      });
      const { data } = await axios.put(url, payload, {
        headers,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-config", streamkey] });
    },
  });

  const [videoConfig, setVideoConfig] = useState<VideoProps>({
    textSize: config.textSize,
    font: config.font,
    effect: config.effect,
    backgroundColor: config.backgroundColor,
    mainColor: config.mainColor,
    secondColor: config.secondColor,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: videoConfig,
  });
  const watchedValues = form.watch();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      setVideoConfig(data);
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      const payload = {
        to: address,
      };
      sendReload(JSON.stringify(payload));
    }
  };

  const handleCopy = () => {
    copy(
      `${process.env.NEXT_PUBLIC_HOST_URL}/widgets/video?streamkey=${streamkey}`
    );
    alert("Copied to clipboard");
  };

  const handleTestVideo = async () => {
    setIsTesting(true);
    try {
      const payload = {
        to: address,
      };
      sendTesting(JSON.stringify(payload));
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsTesting(false);
      }, 10000);
    }
  };

  useEffect(() => {
    // Increment the key whenever the effect changes
    setVideoKey((prevKey) => prevKey + 1);
  }, [watchedValues.effect]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full h-full overflow-hidden"
      >
        {/* TEXT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="font"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font family:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_FONTS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-white/80">
                  Font family to be used for the text
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="effect"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text effect: </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select text effect" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AVAILABLE_ANIMATIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription className="text-white/80">
                  Sound effect to be played when the alert is triggered
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* TEXT SIZE */}
        <FormField
          control={form.control}
          name="textSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text size: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={20}
                  max={50}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription className="text-white/80">
                Size of the text in pixels
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row items-center gap-5 justify-between px-6">
          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <HexColorPicker
                      color={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mainColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Text Color</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <HexColorPicker
                      color={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="secondColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Text Color</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-4">
                    <HexColorPicker
                      color={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* VIDEO COMPONENT */}
        {watchedValues && (
          <div className="flex w-full h-full items-center justify-center">
            <Video
              key={videoKey}
              effect={watchedValues.effect as never}
              textSize={watchedValues.textSize.toString()}
              font={watchedValues.font}
              sender="0xxx"
              videoName={AVAILABLE_VIDEO[0].name}
              src={AVAILABLE_VIDEO[0].src}
              mainColor={watchedValues.mainColor}
              secondColor={watchedValues.secondColor}
              backgroundColor={watchedValues.backgroundColor}
            />
          </div>
        )}

        {/* STREAM LINK */}
        <div className="flex flex-col items-start justify-start w-full h-full">
          <p className="font-play text-xs sm:text-sm md:text-md lg:text-lg xl:text-xl text-white pb-1">
            {process.env.NEXT_PUBLIC_HOST_URL}
            /widgets/vd?streamkey={streamkey}
          </p>
          <div className="bg-white rounded-md w-full h-[1px]" />
        </div>

        {/* BUTTON LIST */}
        <div className="flex flex-col w-full h-full space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <Button
            type="button"
            disabled={isTesting}
            variant="secondary"
            onClick={handleTestVideo}
            className="w-full bg-green-500 text-white text-lg font-bold"
          >
            {isTesting ? <Loader size="20" /> : "Test Video"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopy}
            className="w-full bg-vivid text-midnight text-lg font-bold"
          >
            Copy Video URL
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full bg-sunset text-midnight text-lg font-bold"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_HOST_URL}/widgets/alert?streamkey=${streamkey}`,
                "_blank"
              )
            }
          >
            Open in new tab
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="secondary"
            className="w-full bg-aqua text-midnight text-lg font-bold"
          >
            {isSubmitting ? <Loader size="20" /> : "Update Video"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VideoForm;
