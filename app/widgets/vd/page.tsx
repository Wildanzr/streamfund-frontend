// import Video from "@/components/video/Video";
import SupportVideo from "@/components/video/SupportVideo";
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

const VideoPage = async ({ searchParams }: URLProps) => {
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

  url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/video?streamkey=${streamkey}`;
  timestamp = Math.floor(Date.now() / 1000);
  headers = generateServerSignature({
    method: "GET",
    timestamp,
    url,
  });
  const reqVideoConfig = await fetch(url, {
    method: "GET",
    headers,
    next: {
      tags: ["video-config"],
    },
  });
  const videoConfig = await reqVideoConfig.json();
  const config = videoConfig.data.config as VideoConfigResponse;

  // VIDEOS
  const videoUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/videos`;
  const reqVideos = await fetch(videoUrl, {
    method: "GET",
    headers,
    next: {
      tags: ["videos"],
    },
  });
  const resVideos = await reqVideos.json();
  const videos = (await resVideos.data) as Video[];

  return (
    <div className="flex flex-col w-full h-full min-h-screen bg-transparent items-start justify-start">
      {/* VIDEO SUPPORT COMPONENT */}
      <SupportVideo
        videos={videos}
        effect={config.effect}
        font={config.font}
        mainColor={config.mainColor}
        owner={config.streamer.address}
        secondColor={config.secondColor}
        backgroundColor={config.backgroundColor}
        textSize={config.textSize.toString()}
        streamkey={streamkey!}
      />
    </div>
  );
};

export default VideoPage;
