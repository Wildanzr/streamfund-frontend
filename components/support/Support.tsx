"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "@particle-network/connectkit";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { CoinsIcon, VideoIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import SupportFormToken from "./SupportFormToken";
import Unauthenticated from "../layout/unauthenticated";
import SupportFormSticker from "./SupportFormSticker";
interface SupportProps {
  tokens: Token[];
  streamer: string;
}

export default function Support({ tokens, streamer }: SupportProps) {
  const { status } = useAccount();
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("tokens");

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center pt-24 xl:pt-0">
      {isClient &&
        (status === "connected" ? (
          <Card className="w-full max-w-2xl backdrop-blur-md mx-auto bg-black/10 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Support your favorite Streamer!
              </CardTitle>
              <CardDescription className="text-center text-white/80">
                <span>{streamer}</span>
                <span> is waiting for your support</span>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full h-full"
              >
                <TabsList className="grid w-full h-full grid-cols-2 mb-6 bg-transparent text-white gap-x-2">
                  <TabsTrigger
                    value="tokens"
                    className="flex flex-col items-center py-2"
                    onClick={() => setActiveTab("tokens")}
                  >
                    <CoinsIcon className="h-5 w-5" />
                    <div className="hidden sm:block">Tokens</div>
                  </TabsTrigger>

                  <TabsTrigger
                    value="stickers"
                    className="flex flex-col items-center py-2"
                    onClick={() => setActiveTab("stickers")}
                  >
                    <VideoIcon className="h-5 w-5" />
                    <div className="hidden sm:block">Stickers</div>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {activeTab === "tokens" ? (
                <SupportFormToken tokens={tokens} streamer={streamer} />
              ) : (
                <SupportFormSticker tokens={tokens} streamer={streamer} />
              )}
            </CardContent>
          </Card>
        ) : (
          <Unauthenticated />
        ))}
    </div>
  );
}
