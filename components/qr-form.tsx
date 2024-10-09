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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { HexColorPicker } from "react-colorful";
import QR from "./QR";

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
    size: 300,
    value: "https://example.com",
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: qrConfig,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setQrConfig(values);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="wildanzrrr.base.eth" {...field} />
                  </FormControl>
                  <FormDescription>Your Ethereum address or ENS name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code Value</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>The URL or text to encode in the QR code.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size: {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      min={100}
                      max={1000}
                      step={10}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>QR code size in pixels.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bgColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <HexColorPicker color={field.value} onChange={field.onChange} />
                      <Input {...field} />
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
                      <HexColorPicker color={field.value} onChange={field.onChange} />
                      <Input {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormDescription>Higher levels provide better error correction but increase QR code size.</FormDescription>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormDescription>Size of the quiet zone around the QR code.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Generate QR Code</Button>
          </form>
        </Form>
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8">
          <QR {...qrConfig} />
        </div>
      </div>
    </div>
  );
};

export default QRForm;