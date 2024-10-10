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
  const { data: config, isLoading } = useQuery<MarqueeConfigResponse>({
    queryKey: ["mq-config", streamkey],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/mq?streamkey=${streamkey}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const headers = await generateClientSignature({
        method: "GET",
        timestamp,
        url,
      });

      const { data } = await axios.get(url, {
        headers,
      });
      console.log("Data", data);
      const res = data?.data?.config as MarqueeConfigResponse;
      return res;
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isLoading || !config ? (
        <Loader />
      ) : (
        <RunningForm address={address} streamkey={streamkey} config={config} />
      )}
    </div>
  );
};

export default RunninngManagement;
