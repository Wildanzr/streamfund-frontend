import React, { useRef } from "react";
import { Button } from "../ui/button";

interface VideoButtonProps {
  video: Video;
  isFetchingBalance: boolean;
  isSubmitting: boolean;
  quickAmount: number;
  handleQuickSupport: (value: number) => void;
}

const VideoOption = ({
  video,
  isFetchingBalance,
  isSubmitting,
  quickAmount,
  handleQuickSupport,
}: VideoButtonProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleClick = () => {
    handleQuickSupport(video.value);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <Button
      key={video.value}
      variant="outline"
      type="button"
      disabled={isFetchingBalance || isSubmitting}
      className={`flex-none flex-col h-fit border-2 items-center rounded-sm justify-center p-0 bg-transparent hover:bg-white/10 ${
        quickAmount === video.value ? "border-aqua" : ""
      }`}
      value={video.value}
      onClick={handleClick}
    >
      <video ref={videoRef} className="h-[100px] w-fit">
        <source src={video.src} type="video/mp4" />
      </video>
      <div className="text-white text-xs py-2">
        {video.name} (${video.value})
      </div>
    </Button>
  );
};

export default VideoOption;
