"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { generateClientSignature } from "@/lib/client";
import ManagementApp from "./layout/management";
import Unauthenticated from "./layout/unauthenticated";
import Register from "./layout/register";
import Loader from "./shared/Loader";
import { useSearchParams } from "next/navigation";

const validPath = [
  "alert",
  // "shilling",
  "running-text",
  "qr-code",
  "support-history",
];

export function ManagementPlatformComponent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("menu") ?? "alert";
  const currentPath = validPath.includes(tab) ? tab : "alert";
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState(currentPath);

  const { data: streamer, isLoading } = useQuery({
    queryKey: ["streamer", address],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/streamers?q=${address}&limit=10&page=1`;
      const timestamp = Math.floor(Date.now() / 1000);
      const headers = await generateClientSignature({
        method: "GET",
        timestamp,
        url,
      });

      const { data } = await axios.get(url, {
        headers,
      });
      const streamkey = data?.data?.streamer[0] as QueryStreamerResponse;
      return streamkey;
    },
    enabled: !!address,
    retry: false,
  });

  return (
    <div className="flex flex-col w-full h-full items-center justify-center mx-auto bg-transparent text-white">
      {!isConnected ? (
        <Unauthenticated />
      ) : isLoading ? (
        <Loader />
      ) : streamer ? (
        <ManagementApp
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          streamer={streamer}
        />
      ) : (
        <Register />
      )}
    </div>
  );
}
