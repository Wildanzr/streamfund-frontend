import QR from "@/components/qr/QR";
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

const QRPage = async ({ searchParams }: URLProps) => {
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

  url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/qr?streamkey=${streamkey}`;
  timestamp = Math.floor(Date.now() / 1000);
  headers = generateServerSignature({
    method: "GET",
    timestamp,
    url,
  });
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
    <div className="flex flex-col w-full h-full min-h-screen bg-transparent items-start justify-start">
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
