"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import SupportForm from "./SupportForm";
import Unauthenticated from "../layout/unauthenticated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
interface SupportProps {
  tokens: Token[];
  streamer: string;
}

export default function Support({ tokens, streamer }: SupportProps) {
  const { isConnected } = useAccount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      {isClient ? (
        isConnected ? (
          <Card className="w-full max-w-md mx-auto bg-transparent text-white">
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
              <SupportForm tokens={tokens} streamer={streamer} />
            </CardContent>
          </Card>
        ) : (
          <Unauthenticated />
        )
      ) : null}
    </div>
  );
}
