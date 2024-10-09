import { generateClientSignature } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import QRForm from "./QRForm";

interface QRManagementProps {
  streamkey: string;
  address: string;
}

const QRManagement = ({ streamkey, address }: QRManagementProps) => {
  const { data: config } = useQuery<QRConfigResponse>({
    queryKey: ["qr-config", streamkey],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/qr?streamkey=${streamkey}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const headers = await generateClientSignature({
        method: "GET",
        timestamp,
        url,
      });

      const { data } = await axios.get(url, {
        headers,
      });
      const res = data?.data?.config as QRConfigResponse;
      return res;
    },
  });
  return (
    <div className="flex flex-col items-start justify-start w-full h-full">
      {config && <QRForm address={address} streamkey={streamkey} />}
    </div>
  );
};

export default QRManagement;
