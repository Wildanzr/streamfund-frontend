import React from "react";
import TextAnimation from "../texts/animation";

interface VideoProps {
  sender: string;
  textSize: string;
  font: string;
  effect: string;
  videoName: string;
  src: string;
}

const Video = ({
  effect,
  sender,
  textSize,
  font,
  videoName,
  src,
}: VideoProps) => {
  return (
    <div
      className={`flex flex-col w-fit overflow-hidden h-full max-w-5xl rounded-[24px] border-2 shadow`}
    >
      <div
        className={`flex flex-col items-center justify-center w-full max-w-5xl min-h-40 h-full space-y-3 rounded-t-[20px] shadow border`}
      >
        <video className="w-[400px] h-fit" autoPlay loop>
          <source src={src} type="video/mp4" />
        </video>
      </div>

      <div className="flex flex-col items-center justify-center min-h-10 py-2 bg-white rounded-b-[20px] shadow border px-4">
        <TextAnimation
          segments={[
            { text: sender, isMain: true },
            { text: " sent " },
            { text: `${videoName}`, isMain: true },
            { text: " to you" },
          ]}
          type={effect as never}
          font={font}
          fontSize={Number(textSize)}
          fontWeight={700}
          mainFontWeight={800}
          delay={0.5}
        />
      </div>
    </div>
  );
};

export default Video;
