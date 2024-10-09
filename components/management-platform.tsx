"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, Shield, Type, QrCode, History } from "lucide-react";

export function ManagementPlatformComponent() {
  const [activeTab, setActiveTab] = useState("alert");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Form submitted for ${activeTab} tab`);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-transparent text-white">
      <CardContent className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full"
        >
          <TabsList className="grid w-full h-full grid-cols-5 mb-6 p-2 bg-transparent text-white">
            <TabsTrigger
              value="alert"
              className="flex flex-col items-center gap-2 py-2"
            >
              <AlertCircle className="h-5 w-5" />
              Alert
            </TabsTrigger>
            <TabsTrigger
              value="shiling"
              className="flex flex-col items-center gap-2 py-2"
            >
              <Shield className="h-5 w-5" />
              Shiling Crypto
            </TabsTrigger>
            <TabsTrigger
              value="running-text"
              className="flex flex-col items-center gap-2 py-2"
            >
              <Type className="h-5 w-5" />
              Running Text
            </TabsTrigger>
            <TabsTrigger
              value="qr-code"
              className="flex flex-col items-center gap-2 py-2"
            >
              <QrCode className="h-5 w-5" />
              QR Code
            </TabsTrigger>
            <TabsTrigger
              value="support-history"
              className="flex flex-col items-center gap-2 py-2"
            >
              <History className="h-5 w-5" />
              Support History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alert">
            <TabContentForm title="Alert Management" onSubmit={handleSubmit}>
              <Label htmlFor="alert-message">Alert Message</Label>
              <Input id="alert-message" placeholder="Enter alert message" />
              <Label htmlFor="alert-type">Alert Type</Label>
              <Input id="alert-type" placeholder="Enter alert type" />
            </TabContentForm>
          </TabsContent>

          <TabsContent value="shiling">
            <TabContentForm
              title="Shiling Crypto Management"
              onSubmit={handleSubmit}
            >
              <Label htmlFor="crypto-name">Cryptocurrency Name</Label>
              <Input id="crypto-name" placeholder="Enter cryptocurrency name" />
              <Label htmlFor="campaign-duration">
                Campaign Duration (days)
              </Label>
              <Input
                id="campaign-duration"
                type="number"
                placeholder="Enter campaign duration"
              />
            </TabContentForm>
          </TabsContent>

          <TabsContent value="running-text">
            <TabContentForm
              title="Running Text Configuration"
              onSubmit={handleSubmit}
            >
              <Label htmlFor="running-text">Running Text Content</Label>
              <Textarea
                id="running-text"
                placeholder="Enter running text content"
              />
              <Label htmlFor="scroll-speed">Scroll Speed</Label>
              <Input
                id="scroll-speed"
                type="number"
                placeholder="Enter scroll speed"
              />
            </TabContentForm>
          </TabsContent>

          <TabsContent value="qr-code">
            <TabContentForm title="QR Code Generation" onSubmit={handleSubmit}>
              <Label htmlFor="qr-content">QR Code Content</Label>
              <Input id="qr-content" placeholder="Enter content for QR code" />
              <Label htmlFor="qr-size">QR Code Size</Label>
              <Input
                id="qr-size"
                type="number"
                placeholder="Enter size in pixels"
              />
            </TabContentForm>
          </TabsContent>

          <TabsContent value="support-history">
            <TabContentForm title="Support History" onSubmit={handleSubmit}>
              <Label htmlFor="ticket-id">Ticket ID</Label>
              <Input id="ticket-id" placeholder="Enter ticket ID" />
              <Label htmlFor="status">Status</Label>
              <Input id="status" placeholder="Enter ticket status" />
            </TabContentForm>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TabContentForm({
  title,
  children,
  onSubmit,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
      <Button type="submit" className="w-full bg-aqua text-black font-boldf">
        Submit
      </Button>
    </form>
  );
}
