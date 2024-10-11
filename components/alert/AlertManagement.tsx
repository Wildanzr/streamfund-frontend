"use client";

import { generateClientSignature } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Loader from "../shared/Loader";
import AlertForm from "./AlertForm";

interface AlertManagementProps {
  streamkey: string;
  address: string;
}

const AlertManagement = ({ address, streamkey }: AlertManagementProps) => {
  const { data: config, isLoading } = useQuery<AlertConfigResponse>({
    queryKey: ["alert-config", streamkey],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/alert?streamkey=${streamkey}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const headers = await generateClientSignature({
        method: "GET",
        timestamp,
        url,
      });

      const { data } = await axios.get(url, {
        headers,
      });
      const res = data?.data?.config as AlertConfigResponse;
      return res;
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isLoading || !config ? (
        <Loader />
      ) : (
        <AlertForm address={address} streamkey={streamkey} config={config} />
      )}
    </div>
  );
};

export default AlertManagement;
