import React, { useRef } from "react";
import { Button } from "../ui/button";
import { VIDEO_NAMES } from "@/constant/common";

interface VideoButtonProps {
  number: number;
  video: Video;
  isFetchingBalance: boolean;
  isSubmitting: boolean;
  quickAmount: number;
  tokenInfo: {
    address: string;
    balance: number;
    decimals: number;
    symbol: string;
    allowance: number;
    currentPrice: number;
  };
  handleQuickSupport: (value: number, videoId: string) => void;
}

const VideoOption = ({
  number,
  video,
  isFetchingBalance,
  isSubmitting,
  quickAmount,
  tokenInfo,
  handleQuickSupport,
}: VideoButtonProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleClick = () => {
    handleQuickSupport(video.price, video.video_id);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <Button
      key={video.video_id}
      variant="outline"
      type="button"
      disabled={isFetchingBalance || isSubmitting || !tokenInfo.address}
      className={`flex-none flex-col h-fit border-2 items-center rounded-sm justify-center p-0 bg-transparent hover:bg-white/10 ${
        quickAmount === video.price ? "border-aqua" : ""
      }`}
      value={video.price}
      onClick={handleClick}
    >
      <video ref={videoRef} className="h-[100px] w-fit">
        <source src={video.link} type="video/mp4" />
      </video>
      <div className="text-white text-xs py-2">
        {VIDEO_NAMES[number]} (${video.price})
      </div>
    </Button>
  );
};

export default VideoOption;
