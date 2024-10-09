import QR from "@/components/qr/QR";
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

const QRPage = async ({ searchParams }: URLProps) => {
  const streamkey = searchParams.streamkey;
  console.log("streamkey", streamkey);

  if (!searchParams.streamkey) {
    return <div>Invalid Stream Key</div>;
  }

  let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/streamkey?key=${streamkey}`;
  let timestamp = Math.floor(Date.now() / 1000);
  let reqSignature = await fetch(
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
  let signature = await reqSignature.json();
  let headers = {
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
  url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/qr?streamkey=${streamkey}`;
  timestamp = Math.floor(Date.now() / 1000);
  reqSignature = await fetch(
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
  signature = await reqSignature.json();
  headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    "x-timestamp": timestamp.toString(),
    "x-signature": signature,
  };
  const reqQRConfig = await fetch(url, {
    method: "GET",
    headers,
    next: {
      tags: ["qr-config"],
    },
  });
  const qrConfig = await reqQRConfig.json();
  const qrData = qrConfig.data.config as QRConfigResponse;
  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-white items-start justify-start">
      <QR
        address={qrData.streamer.address}
        bgColor={qrData.bgColor}
        ecLevel={qrData.level}
        fgColor={qrData.fgColor}
        qrStyle={qrData.style}
        quietZone={qrData.quietZone}
        size={500}
        value={`${process.env.NEXT_PUBLIC_HOST_URL}/support/${qrData.streamer.address}`}
      />
    </div>
  );
};

export default QRPage;
