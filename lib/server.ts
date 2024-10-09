import { generateSignature } from "./utils";

interface GenerateSignatureprops {
  method: string;
  url: string;
  timestamp: number;
  body?: object;
}

export const generateServerSignature = ({
  method,
  timestamp,
  url,
  body,
}: GenerateSignatureprops) => {
  const signature = generateSignature({
    method,
    timestamp,
    url,
  });
  let headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    "x-timestamp": timestamp.toString(),
    "x-signature": signature,
  };

  return headers;
};
