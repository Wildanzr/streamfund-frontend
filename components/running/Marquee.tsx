import { cn } from "@/lib/utils";
import React from "react";
import Marquee from "react-fast-marquee";

interface MQProps {
  text: string;
  font?: string;
  textColor?: string;
  textSize?: string;
  backgroundColor?: string;
}

const MQ = ({ backgroundColor, font, text, textColor, textSize }: MQProps) => {
  return (
    <Marquee
      speed={100}
      className={`${cn(font, "py-5")}`}
      style={{
        backgroundColor,
        color: textColor,
        fontSize: `${textSize}px`,
      }}
    >
      {text}
    </Marquee>
  );
};

export default MQ;
