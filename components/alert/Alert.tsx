import React from "react";
import TextAnimation from "../texts/animation";
import { formatUnits } from "viem";
import { AVAILABLE_ANIMATIONS } from "@/constant/common";

interface AlertProps {
  sender: string;
  amount: number;
  decimals: number;
  symbol: string;
  owner: string;
  textSize: string;
  effect: (typeof AVAILABLE_ANIMATIONS)[number];
}

const Alert = ({
  amount,
  decimals,
  effect,
  owner,
  sender,
  symbol,
  textSize,
}: AlertProps) => {
  return (
    <div
      className={`flex flex-col w-full h-full max-w-5xl rounded-[20px] shadow border`}
    >
      <div
        className={`flex flex-col items-center justify-center w-full max-w-5xl min-h-40 h-full space-y-3 bg-green-500 rounded-t-[20px] shadow border`}
      >
        <TextAnimation
          segments={[
            { text: sender, isMain: true },
            { text: " support " },
            { text: `${formatUnits(BigInt(amount), decimals)}`, isMain: true },
            { text: ` ${symbol}`, isMain: true },
            { text: " to you" },
          ]}
          type={effect}
          fontSize={Number(textSize)}
          color="#333333"
          mainColor="#FF0000"
          fontWeight={700}
          mainFontWeight={800}
          delay={0.5}
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-10 bg-white rounded-b-[20px] shadow border">
        <p className="text-black">{owner}</p>
      </div>
    </div>
  );
};

export default Alert;
