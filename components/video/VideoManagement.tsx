"use client";

import { generateClientSignature } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import Loader from "../shared/Loader";
import VideoForm from "./VideoForm";

interface VideoManagementProps {
  streamkey: string;
  address: string;
}

const VideoManagement = ({ address, streamkey }: VideoManagementProps) => {
  const { data: config, isLoading } = useQuery<VideoConfigResponse>({
    queryKey: ["alert-config", streamkey],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/stream/video?streamkey=${streamkey}`;
      const timestamp = Math.floor(Date.now() / 1000);
      const headers = await generateClientSignature({
        method: "GET",
        timestamp,
        url,
      });

      const { data } = await axios.get(url, {
        headers,
      });
      const res = data?.data?.config as VideoConfigResponse;
      return res;
    },
  });

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isLoading || !config ? (
        <Loader />
      ) : (
        <VideoForm address={address} streamkey={streamkey} config={config} />
      )}
    </div>
  );
};

export default VideoManagement;
