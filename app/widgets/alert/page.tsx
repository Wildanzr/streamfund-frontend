import SupportAlert from "@/components/alert/SupportAlert";
import { generateServerSignature } from "@/lib/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "StreamFund | My Alert Widget",
  description:
    "StreamFund Alert Widget is websocket based crypto donation for streamers",
  keywords: [
    "StreamFund",
    "StreamFund Alert",
    "StreamFund Alert Widget",
    "StreamFund Alert Widget for Streamers",
    "StreamFund Alert Widget for Twitch",
    "StreamFund Alert Widget for Youtube",
    "StreamFund Alert Widget for Facebook",
    "StreamFund Alert Widget for Tiktok",
    "StreamFund Alert Widget for Instagram",
  ],
  authors: {
    name: "Wildanzrrr",
    url: "https://wildanzr.my.id",
  },
  creator: "Wildanzrrr",
  publisher: "Wildanzrrr",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://streamfund.vercel.app",
    siteName: "StreamFund",
    title: "StreamFund | My Alert Widget",
    description:
      "StreamFund Alert Widget is websocket based crypto donation for streamers",
  },
};

const AlertPage = async ({ searchParams }: URLProps) => {
  const streamkey = searchParams.streamkey;

  if (!searchParams.streamkey) {
    return <div>Invalid Stream Key</div>;
  }

  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/streamkey?key=${streamkey}`;
  let timestamp = Math.floor(Date.now() / 1000);
  let headers = generateServerSignature({
    method: "GET",
    timestamp,
    url,
  });
  const reqCheckStreamKey = await fetch(url, {
    method: "GET",
    headers,
    next: {
      tags: ["check-stream-key"],
    },
  });
  const checkStreamKey = await reqCheckStreamKey.json();
  const data = checkStreamKey.data as CheckStreamKeyResponse;

  if (!data.valid) {
    return <div>Invalid Stream Key</div>;
  }

  url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/alert?streamkey=${streamkey}`;
  timestamp = Math.floor(Date.now() / 1000);
  headers = generateServerSignature({
    method: "GET",
    timestamp,
    url,
  });

  const reqAlertConfig = await fetch(url, {
    method: "GET",
    headers,
    next: {
      tags: ["alert-config"],
    },
  });
  const alertConfig = await reqAlertConfig.json();
  const config = alertConfig.data.config as AlertConfigResponse;
  console.log("Config", config);

  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-transparent items-start justify-start">
      <SupportAlert
        effect={config.effect}
        font={config.font}
        mainColor={config.mainColor}
        owner={config.streamer.address}
        secondColor={config.secondColor}
        backgroundColor={config.backgroundColor}
        textSize={config.textSize.toString()}
        streamkey={streamkey!}
        sound={config.sound}
      />
    </div>
  );
};

export default AlertPage;
