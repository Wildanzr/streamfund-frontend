import Background from "@/components/layout/background";
import Header from "@/components/layout/header";
import Support from "@/components/support/Support";
import { generateServerSignature } from "@/lib/server";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "StreamFund | Support Streamers",
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
    title: "StreamFund | Support Streamers",
    description:
      "StreamFund Alert Widget is websocket based crypto donation for streamers",
  },
};

const SupportPage = async ({ params }: URLProps) => {
  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/address/${params.id}`;
  let timestamp = Math.floor(Date.now() / 1000);
  let headers = generateServerSignature({
    method: "GET",
    timestamp,
    url,
  });
  const reqCheckAddress = await fetch(url, {
    method: "GET",
    headers,
    next: {
      tags: ["check-stream-key"],
    },
  });
  const checkStreamKey = await reqCheckAddress.json();
  const data = checkStreamKey.data as CheckAddressResponse;

  if (!data.valid) {
    return <div>Invalid Streamer</div>;
  }

  url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/tokens`;
  timestamp = Math.floor(Date.now() / 1000);
  headers = generateServerSignature({
    method: "GET",
    timestamp,
    url,
  });
  const reqTokens = await fetch(url, {
    method: "GET",
    headers,
    next: {
      tags: ["tokens"],
    },
  });
  const resTokens = await reqTokens.json();
  const tokens = (await resTokens.data.tokens) as Token[];
  return (
    <div className="flex relative flex-col items-center justify-center w-full h-full min-h-screen">
      <Background />
      <Header />
      <Support tokens={tokens} streamer={params.id} />
    </div>
  );
};

export default SupportPage;
