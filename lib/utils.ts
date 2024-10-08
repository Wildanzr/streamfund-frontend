import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { HmacSHA256, enc } from "crypto-js";
import qs from "query-string";

interface UrlQueryProps {
  params: string;
  key: string;
  value: string | null;
}

interface RemoveKeysProps {
  params: string;
  keysToRemove: string[];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formUrlQuery = ({ key, params, value }: UrlQueryProps) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove,
}: RemoveKeysProps) => {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

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
