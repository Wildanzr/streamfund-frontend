import { generateClientSignature } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Loader from "../shared/Loader";
import RunningForm from "./RunningForm";

interface RunninngManagementProps {
  streamkey: string;
  address: string;
}

const RunninngManagement = ({
  streamkey,
  address,
}: RunninngManagementProps) => {
  const { data: config, isLoading } = useQuery<QRConfigResponse>({
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
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isLoading || !config ? (
        <Loader />
      ) : (
        <RunningForm
          address={address}
          streamkey={streamkey}
          config={{
            backgroundColor: "#000000",
            borderColor: "#ffffff",
            font: "monospace",
            text: "This is simple marquee",
            textColor: "#ffffff",
            textSize: "20",
            streamer: {
              _id: "0x",
              address: "0x",
            },
          }}
        />
      )}
    </div>
  );
};

export default RunninngManagement;
