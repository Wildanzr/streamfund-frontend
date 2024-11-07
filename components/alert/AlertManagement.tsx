"use client";

import { generateClientSignature } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import Loader from "../shared/Loader";
import AlertForm from "./AlertForm";

interface AlertManagementProps {
  streamkey: string;
  address: string;
}

const AlertManagement = ({ address, streamkey }: AlertManagementProps) => {
  const [liveAdsPrice, setLiveAdsPrice] = useState(0);
  const { data: config, isLoading } = useQuery<AlertConfigResponse>({
    queryKey: ["alert-config", streamkey],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/alert?streamkey=${streamkey}`;
      const detailsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/contracts/streamers?limit=10&q=${address}&page=1`;
      const timestamp = Math.floor(Date.now() / 1000);
      const headers = await generateClientSignature({
        method: "GET",
        timestamp,
        url,
      });
      const headerDetails = await generateClientSignature({
        method: "GET",
        timestamp,
        url: detailsUrl,
      });

      const [configResponse, details] = await Promise.all([
        axios.get(url, { headers }),
        axios.get(detailsUrl, { headers: headerDetails }),
      ]);

      const { data } = configResponse;
      const { data: detail } = details;
      setLiveAdsPrice(detail.data.streamer[0].liveAdsPrice);
      const res = data?.data?.config as AlertConfigResponse;
      return res;
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isLoading || !config ? (
        <Loader />
      ) : (
        <AlertForm
          address={address}
          streamkey={streamkey}
          config={config}
          price={liveAdsPrice}
        />
      )}
    </div>
  );
};

export default AlertManagement;
