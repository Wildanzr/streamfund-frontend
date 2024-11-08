"use client";

import { trimAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import Video from "./Video";
import { SupportType } from "@/types/SupportType";

interface SupportVideo {
  owner: string;
  textSize: string;
  mainColor: string;
  secondColor: string;
  backgroundColor: string;
  font: string;
  effect: string;
  streamkey: string;
}

const SupportVideo = (props: SupportVideo) => {
  const HOST = `${process.env.NEXT_PUBLIC_BACKEND_URL}?streamKey=${props.streamkey}`;
  const { socket, connected } = useSocket(HOST);
  const [renderKey, setRenderKey] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [sended, setSended] = useState(false);
  const [newSupport, setNewSupport] = useState<ListenSupportResponse>({
    message: "",
    data: {
      amount: 0,
      decimals: 0,
      from: "",
      message: "",
      symbol: "",
      type: SupportType.Unknown,
    },
  });
  const { sendMessage } = useSocketEvent<string>(socket, "listen-support");

  const handleVideoEnd = () => {
    setIsVisible(false);
    setNewSupport({
      message: "",
      data: {
        amount: 0,
        decimals: 0,
        from: "",
        message: "",
        symbol: "",
        type: SupportType.Unknown,
      },
    });
  };

  useSocketEvent<ListenSupportResponse>(socket, "support", {
    onMessage: async (message) => {
      // SKIP IF NOT VIDEO SUPPORT
      if (message.data.type !== SupportType.Video) return;

      console.log("Message", message);
      setNewSupport({
        message: "New Support",
        data: {
          amount: message.data.amount,
          decimals: message.data.decimals,
          from: trimAddress(message.data.from),
          message: message.data.message,
          symbol: message.data.symbol,
          type: message.data.type,
        },
      });
      setRenderKey((prev) => prev + 1);
      setIsVisible(true);
    },
  });
  useSocketEvent<ListenSupportResponse>(socket, "support-init", {
    onMessage: (message) => {
      console.log("message on init", message);
    },
  });
  useSocketEvent(socket, "reload", {
    onMessage: () => {
      console.log("Reload");
      window.location.reload();
    },
  });

  useEffect(() => {
    if (connected && !sended) {
      console.log("send message");
      sendMessage();
      setSended(true);
    }
  }, [connected, sendMessage, sended]);

  return (
    <div className={`w-full h-full ${isVisible ? "flex" : "hidden"}`}>
      <Video
        key={renderKey}
        {...props}
        videoName="Video"
        src="/videos/video-1.mp4"
        sender={newSupport.data.from}
        onVideoEnd={handleVideoEnd}
        isVisible={isVisible}
      />
    </div>
  );
};

export default SupportVideo;
