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

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/streamkey?key=${streamkey}`;
  const timestamp = Math.floor(Date.now() / 1000);
  const reqSignature = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/signature`,
    {
      method: "POST",
      body: JSON.stringify({
        method: "GET",
        url,
        timestamp,
        body: null,
      }),
    }
  );
  const signature = await reqSignature.json();

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    "x-timestamp": timestamp.toString(),
    "x-signature": signature,
  };
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

  return <div>AlertPage</div>;
};

export default AlertPage;
