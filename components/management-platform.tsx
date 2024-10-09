"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Shield, Type, QrCode, History } from "lucide-react";
import QRForm from "./qr/QRForm";

export function ManagementPlatformComponent() {
  const [activeTab, setActiveTab] = useState("alert");

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
            <p>Alert </p>
          </TabsContent>

          <TabsContent value="shiling">
            <p>Shilling </p>
          </TabsContent>

          <TabsContent value="running-text">
            <p>Running </p>
          </TabsContent>

          <TabsContent
            value="qr-code"
            className="flex flex-col w-full h-full space-y-3"
          >
            <QRForm />
          </TabsContent>

          <TabsContent value="support-history">
            <p>Support </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}