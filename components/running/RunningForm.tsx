"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { HexColorPicker } from "react-colorful";
import MQ from "./Marquee";
import { AVAILABLE_FONTS } from "@/constant/common";
import { Button } from "../ui/button";
import Loader from "../shared/Loader";
import { useCopyToClipboard } from "usehooks-ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateClientSignature } from "@/lib/client";
import axios from "axios";

interface MarqueeProps {
  backgroundColor: string;
  textColor: string;
  font: string;
  text: string;
  textSize: number;
}

interface RunningFormProps {
  address: string;
  streamkey: string;
  config: MarqueeConfigResponse;
}

const formSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  font: z.string(),
  text: z.string(),
  textSize: z.number(),
});

const RunningForm = ({ config, streamkey }: RunningFormProps) => {
  const [, copy] = useCopyToClipboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationKey: ["update-mq-config"],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/mq?streamkey=${streamkey}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const payload = {
        backgroundColor: values.backgroundColor,
        textColor: values.textColor,
        font: values.font,
        textSize: values.textSize.toString(),
        text: values.text,
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
      queryClient.invalidateQueries({ queryKey: ["mq-config", streamkey] });
    },
  });

  const [mqConfig, setMqConfig] = useState<MarqueeProps>({
    backgroundColor: config?.backgroundColor || "#000000",
    textColor: config?.textColor || "#ffffff",
    font: config?.font || "monospace",
    text: config?.text || "This is simple marquee",
    textSize: Number(config?.textSize) || 20,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mqConfig,
  });
  const watchedValues = form.watch();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Data", data);
    setIsSubmitting(true);
    try {
      setMqConfig(data);
      await updateMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    copy(
      `${process.env.NEXT_PUBLIC_HOST_URL}/widgets/mq?streamkey=${streamkey}`
    );

    alert("Copied to clipboard");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full h-full overflow-auto"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className="text-white/80">
                The text to be displayed in the marquee
              </FormDescription>
              <FormMessage />
            </FormItem>
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
                  min={0}
                  max={128}
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
        <FormField
          control={form.control}
          name="font"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font family: {field.value}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
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
          <MQ
            backgroundColor={watchedValues.backgroundColor}
            textColor={watchedValues.textColor}
            font={watchedValues.font}
            text={watchedValues.text}
            textSize={watchedValues.textSize.toString()}
          />
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
            variant="secondary"
            onClick={handleCopy}
            className="w-full bg-vivid text-midnight text-lg font-bold"
          >
            Copy Marquee URL
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full bg-sunset text-midnight text-lg font-bold"
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_HOST_URL}/widgets/mq?streamkey=${streamkey}`,
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
            {isSubmitting ? <Loader size="20" /> : "Update Running Text"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RunningForm;
