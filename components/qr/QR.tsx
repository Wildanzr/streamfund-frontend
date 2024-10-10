"use client";

import React from "react";
import { QRCode } from "react-qrcode-logo";

export interface QRProps {
  value: string;
  size: number;
  bgColor: string;
  fgColor: string;
  ecLevel: "H" | "L" | "M" | "Q" | undefined;
  qrStyle: "squares" | "dots" | "fluid" | undefined;
  quietZone: number;
  address: string;
}

const QR = ({
  address,
  bgColor,
  ecLevel,
  fgColor,
  qrStyle,
  quietZone,
  size,
  value,
}: QRProps) => {
  const parsedAddress = address as `0x${string}`;
  return (
    <div className="flex flex-col space-y-3 items-center justify-center w-full h-full">
      <QRCode
        value={value}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        ecLevel={ecLevel}
        qrStyle={qrStyle}
        quietZone={quietZone}
      />

      <div className="flex flex-col items-center justify-center">
        {/* <Basenames address={parsedAddress} color={fgColor} /> */}
        <p
          className="font-play text-2xl font-bold "
          style={{
            color: fgColor,
          }}
        >
          {parsedAddress}
        </p>
        <p
          className="font-play text-base"
          style={{
            color: fgColor,
          }}
        >
          StreamFund
        </p>
      </div>
    </div>
  );
};

export default QR;
