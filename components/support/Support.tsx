"use client";

import React from "react";
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

const Support = ({ tokens, streamer }: SupportProps) => {
  const { isConnected } = useAccount();

  return (
    <Card className="w-full max-w-md mx-auto bg-transparent text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Support your favorite Streamer!
        </CardTitle>
        <CardDescription className="text-center text-white/80">
          <span>{streamer}</span>
          <span>is waiting for your support</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <SupportForm tokens={tokens} streamer={streamer} />
        ) : (
          <Unauthenticated />
        )}
      </CardContent>
    </Card>
  );
};

export default Support;
