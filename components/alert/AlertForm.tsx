"use client";

// import { generateClientSignature } from "@/lib/client";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
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
// import { useCopyToClipboard } from "usehooks-ts";
import { z } from "zod";
import {
  AVAILABLE_ANIMATIONS,
  AVAILABLE_FONTS,
  AVAILABLE_SOUNDS,
} from "@/constant/common";
import { useForm } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import Alert from "./Alert";
import Sound from "./Sound";
import { Button } from "../ui/button";
import { useCopyToClipboard } from "usehooks-ts";
import Loader from "../shared/Loader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClientSignature } from "@/lib/client";
import axios from "axios";

interface AlertFormProps {
  address: string;
  streamkey: string;
  config: AlertConfigResponse;
}

interface AlertProps {
  backgroundColor: string;
  mainColor: string;
  secondColor: string;
  textSize: number;
  font: string;
  sound: string;
  effect: string;
}

const formSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  mainColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textSize: z.number(),
  font: z.string(),
  sound: z.string(),
  effect: z.string(),
});

const AlertForm = ({ config, streamkey, address }: AlertFormProps) => {
  const [, copy] = useCopyToClipboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [alertKey, setAlertKey] = useState(0);

  const queryClient = useQueryClient();
  const updateMutation = useMutation({
    mutationKey: ["update-alert-config"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/alert?streamkey=${streamkey}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = {
        backgroundColor: values.backgroundColor,
        mainColor: values.mainColor,
        secondColor: values.secondColor,
        textSize: values.textSize.toString(),
        font: values.font,
        sound: values.sound,
        effect: values.effect,
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
      queryClient.invalidateQueries({ queryKey: ["alert-config", streamkey] });
    },
  });

  const [alertConfig, setAlertConfig] = useState<AlertProps>({
    backgroundColor: config.backgroundColor,
    mainColor: config.mainColor,
    secondColor: config.secondColor,
    textSize: config.textSize,
    font: config.font,
    sound: config.sound,
    effect: config.effect,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: alertConfig,
  });
  const watchedValues = form.watch();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      setAlertConfig(data);
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    copy(
      `${process.env.NEXT_PUBLIC_HOST_URL}/widgets/alert?streamkey=${streamkey}`
    );

    alert("Copied to clipboard");
  };

  const handleTestAlert = async () => {
    setIsTesting(true);
    try {
      console.log("Testing");
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
    setAlertKey((prevKey) => prevKey + 1);
  }, [watchedValues.effect]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full h-full overflow-auto"
      >
        <div className="grid grid-cols-2 gap-4">
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

        <FormField
          control={form.control}
          name="sound"
          render={({ field }) => (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {AVAILABLE_SOUNDS.map((item) => (
                <div key={item.value}>
                  <Sound
                    name={item.name}
                    src={item.src}
                    value={item.value}
                    selected={field.value}
                    handleChange={field.onChange}
                  />
                </div>
              ))}
            </div>
          )}
        />

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center">
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

        {watchedValues && (
          <div className="flex w-full h-full items-center justify-center">
            <Alert
              key={alertKey}
              amount={100000000000000}
              decimals={18}
              effect={watchedValues.effect as never}
              textSize={watchedValues.textSize.toString()}
              backgroundColor={watchedValues.backgroundColor}
              mainColor={watchedValues.mainColor}
              secondColor={watchedValues.secondColor}
              font={watchedValues.font}
              owner={address}
              sender="0xxx"
              symbol="ETH"
            />
          </div>
        )}

        {/* display stream link */}
        <div className="flex flex-col items-start justify-start w-full h-full">
          <p className="font-play text-xl text-white pb-1">
            {process.env.NEXT_PUBLIC_HOST_URL}
            /widgets/mq?streamkey={streamkey}
          </p>
          <div className="bg-white rounded-md w-full h-[1px]" />
        </div>

        <div className="flex flex-col w-full h-full space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <Button
            type="button"
            disabled={isTesting}
            variant="secondary"
            onClick={handleTestAlert}
            className="w-full bg-green-500 text-white text-lg font-bold"
          >
            {isTesting ? <Loader size="20" /> : "Test Alert"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopy}
            className="w-full bg-vivid text-midnight text-lg font-bold"
          >
            Copy QR URL
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
            {isSubmitting ? <Loader size="20" /> : "Update Alert"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AlertForm;
