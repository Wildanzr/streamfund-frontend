"use client";

interface GenerateSignatureprops {
  method: string;
  url: string;
  timestamp: number;
  body?: object;
}

export const generateClientSignature = async ({
  method,
  timestamp,
  url,
  body,
}: GenerateSignatureprops) => {
  const reqSignature = await fetch(
    `${process.env.NEXT_PUBLIC_HOST_URL}/api/signature`,
    {
      method: "POST",
      body: JSON.stringify({
        method,
        url,
        timestamp,
        body: body ? JSON.stringify(body) : null,
      }),
    }
  );
  const signature = await reqSignature.json();
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_PUBLIC_KEY!,
    "x-timestamp": timestamp.toString(),
    "x-signature": signature,
  };

  return headers;
};
