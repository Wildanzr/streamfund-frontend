import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HmacSHA256, enc } from "crypto-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GenerateSignatureprops {
  method: string;
  url: string;
  timestamp: number;
  body?: object;
}

export const generateSignature = ({
  method,
  url,
  timestamp,
  body,
}: GenerateSignatureprops) => {
  // Define variables
  const secretKey = process.env.SECRET_KEY as string;

  // Construct the string to sign
  const toBeSigned = `${timestamp}|${method}|${url}${
    body ? `|${JSON.stringify(body)}` : ""
  }`;

  // Generate the HMAC signature
  const signature = HmacSHA256(toBeSigned, secretKey).toString(enc.Hex);

  // Set headers
  return signature;
};
