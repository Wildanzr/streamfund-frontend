"use client";

import Link from "next/link";
import React from "react";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";

const ToApp = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return null;
  } else {
    return (
      <Link href="/app" className="flex flex-col">
        <Button className="flex bg-aqua font-play font-bold text-2xl text-midnight hover:bg-aqua/80">
          Go to App
        </Button>
      </Link>
    );
  }
};

export default ToApp;
