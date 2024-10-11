import React from "react";
import TextAnimation from "../texts/animation";
import { formatUnits } from "viem";

interface AlertProps {
  sender: string;
  amount: number;
  decimals: number;
  symbol: string;
  owner: string;
  textSize: string;
  mainColor: string;
  secondColor: string;
  backgroundColor: string;
  font: string;
  effect: string;
}

const Alert = ({
  amount,
  decimals,
  effect,
  owner,
  sender,
  symbol,
  textSize,
  secondColor,
  mainColor,
  backgroundColor,
  font,
}: AlertProps) => {
  return (
    <div
      className={`flex flex-col w-full h-full max-w-5xl rounded-[20px] shadow border`}
    >
      <div
        className={`flex flex-col items-center justify-center w-full max-w-5xl min-h-40 h-full space-y-3  rounded-t-[20px] shadow border`}
        style={{ backgroundColor: backgroundColor }}
      >
        <TextAnimation
          segments={[
            { text: sender, isMain: true },
            { text: " support " },
            { text: `${formatUnits(BigInt(amount), decimals)}`, isMain: true },
            { text: ` ${symbol}`, isMain: true },
            { text: " to you" },
          ]}
          type={effect as never}
          font={font}
          fontSize={Number(textSize)}
          color={secondColor}
          mainColor={mainColor}
          fontWeight={700}
          mainFontWeight={800}
          delay={0.5}
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-10 bg-white rounded-b-[20px] shadow border">
        <p className={`text-black text-base p-5 text-center tracking-wider`}>
          {owner}
        </p>
      </div>
    </div>
  );
};

export default Alert;
