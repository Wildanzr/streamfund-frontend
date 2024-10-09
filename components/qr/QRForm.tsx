"use client";

import React, { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import QR from "./QR";
import { Slider } from "../ui/slider";
import { HexColorPicker } from "react-colorful";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface QRProps {
  value: string;
  size: number;
  bgColor: string;
  fgColor: string;
  ecLevel: "H" | "L" | "M" | "Q" | undefined;
  qrStyle: "squares" | "dots" | "fluid" | undefined;
  quietZone: number;
  address: string;
}

const formSchema = z.object({
  address: z.string().min(2).max(50),
  value: z.string().url(),
  size: z.number().min(100).max(1000),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  ecLevel: z.enum(["H", "L", "M", "Q"]),
  qrStyle: z.enum(["squares", "dots", "fluid"]),
  quietZone: z.number().min(0).max(100),
});

const QRForm = () => {
  const [qrConfig, setQrConfig] = useState<QRProps>({
    address: "wildanzrrr.base.eth",
    bgColor: "#ffffff",
    fgColor: "#000000",
    ecLevel: "H",
    qrStyle: "squares",
    quietZone: 20,
    size: 500,
    value: "https://example.com",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: qrConfig,
  });
  const watchedValues = form.watch();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setQrConfig(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="quietZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quiet Zone: {field.value}</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormDescription>
                Size of the quiet zone around the QR code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="bgColor"
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
            name="fgColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Foreground Color</FormLabel>
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
            name="ecLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Error Correction Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select error correction level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="L">Low</SelectItem>
                    <SelectItem value="M">Medium</SelectItem>
                    <SelectItem value="Q">Quartile</SelectItem>
                    <SelectItem value="H">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Higher levels provide better error correction but increase QR
                  code size.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="qrStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>QR Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select QR style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="squares">Squares</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="fluid">Fluid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <QR
          address={watchedValues.address}
          bgColor={watchedValues.bgColor}
          ecLevel={watchedValues.ecLevel}
          fgColor={watchedValues.fgColor}
          qrStyle={watchedValues.qrStyle}
          quietZone={watchedValues.quietZone}
          size={watchedValues.size}
          value={watchedValues.value}
        />

        {/* display stream link */}
        <div className="flex flex-col items-start justify-start w-full h-full">
          <p className="font-play text-4xl text-white pb-1">
            {watchedValues.address}
          </p>
          <div className="bg-white rounded-md w-full h-[1px]" />
        </div>

        <div className="flex flex-col w-full h-full space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <Button
            type="submit"
            variant="secondary"
            className="w-full bg-vivid text-midnight text-lg font-bold"
          >
            Copy QR URL
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="w-full bg-sunset text-midnight text-lg font-bold"
          >
            Open in new tab
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="w-full bg-aqua text-midnight text-lg font-bold"
          >
            Save configuration
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QRForm;
