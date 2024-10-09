import React from "react";
import { QRCode } from "react-qrcode-logo";

// value="https://example.com"
//       size={300}
//       bgColor="#ff00ff"
//       fgColor="#000000"
//       ecLevel="H"
//       qrStyle="squares"
//       quietZone={20}

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
        <p className="font-play text-4xl text-white">{address}</p>
        <p className="font-play text-base text-white">StreamFund</p>
      </div>
    </div>
  );
};

export default QR;
