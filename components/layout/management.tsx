"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Type, QrCode, History } from "lucide-react";
import QRManagement from "../qr/QRManagement";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import RunninngManagement from "../running/RunningManagement";
import AlertManagement from "../alert/AlertManagement";

interface ManagementAppProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  streamer: QueryStreamerResponse;
}

const ManagementApp = ({
  activeTab,
  setActiveTab,
  streamer,
}: ManagementAppProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "menu",
      value: value,
    });
    router.push(newUrl);
  };
  return (
    <Card className="w-full max-w-6xl mx-auto bg-transparent text-white">
      <CardContent className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full"
        >
          <TabsList className="grid w-full h-full grid-cols-4 mb-6 p-2 bg-transparent text-white">
            <TabsTrigger
              value="alert"
              className="flex flex-col items-center gap-2 py-2"
              onClick={() => handleTabChange("alert")}
            >
              <AlertCircle className="h-5 w-5" />
              Alert
            </TabsTrigger>
            {/* <TabsTrigger
              value="shiling"
              className="flex flex-col items-center gap-2 py-2"
              onClick={() => handleTabChange("shiling")}
            >
              <Shield className="h-5 w-5" />
              Shiling Crypto
            </TabsTrigger> */}
            <TabsTrigger
              value="running-text"
              className="flex flex-col items-center gap-2 py-2"
              onClick={() => handleTabChange("running-text")}
            >
              <Type className="h-5 w-5" />
              Running Text
            </TabsTrigger>
            <TabsTrigger
              value="qr-code"
              className="flex flex-col items-center gap-2 py-2"
              onClick={() => handleTabChange("qr-code")}
            >
              <QrCode className="h-5 w-5" />
              QR Code
            </TabsTrigger>
            <TabsTrigger
              value="support-history"
              className="flex flex-col items-center gap-2 py-2"
              onClick={() => handleTabChange("support-history")}
            >
              <History className="h-5 w-5" />
              Support History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alert">
            <AlertManagement
              address={streamer.address}
              streamkey={streamer.streamkey}
            />
          </TabsContent>

          {/* <TabsContent value="shiling">
            <p>Shilling </p>
          </TabsContent> */}

          <TabsContent value="running-text">
            <RunninngManagement
              address={streamer.address}
              streamkey={streamer.streamkey}
            />
          </TabsContent>

          <TabsContent
            value="qr-code"
            className="flex flex-col w-full h-full space-y-3"
          >
            <QRManagement
              address={streamer.address}
              streamkey={streamer.streamkey}
            />
          </TabsContent>

          <TabsContent value="support-history">
            <p>Support </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManagementApp;
