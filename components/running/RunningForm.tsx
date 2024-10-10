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

interface MarqueeProps {
  backgroundColor: string;
  textColor: string;
  font: string;
  text: string;
  textSize: string;
}

interface RunningFormProps {
  address: string;
  streamkey: string;
  config: MarqueeConfigResponse;
}

const formSchema = z.object({
  address: z.string().min(2).max(50),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  font: z.string(),
  text: z.string(),
  textSize: z.string(),
});

const RunningForm = ({ config }: RunningFormProps) => {
  const [mqConfig] = useState<MarqueeProps>({
    backgroundColor: config?.backgroundColor || "#000000",
    textColor: config?.textColor || "#ffffff",
    font: config?.font || "monospace",
    text: config?.text || "This is simple marquee",
    textSize: config?.textSize || "20",
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mqConfig,
  });
  const watchedValues = form.watch();

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
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
                  value={[Number(field.value)]}
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
            textSize={watchedValues.textSize}
          />
        )}
      </form>
    </Form>
  );
};

export default RunningForm;
