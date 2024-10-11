"use client";

import { trimAddress } from "@/lib/utils";
import Alert from "./Alert";
import { useEffect, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

interface SupportAlert {
  owner: string;
  textSize: string;
  mainColor: string;
  secondColor: string;
  backgroundColor: string;
  font: string;
  effect: string;
  streamkey: string;
}

const SupportAlert = (props: SupportAlert) => {
  const HOST = `${process.env.NEXT_PUBLIC_BACKEND_URL}?streamkey=${props.streamkey}`;
  const { socket, connected } = useSocket(HOST);
  const [renderKey, setRenderKey] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [sended, setSended] = useState(false);
  const [newSupport, setNewSupport] = useState<ListenSupportResponse>({
    message: "",
    data: {
      amount: 0,
      decimals: 0,
      from: "",
      message: "",
      symbol: "",
    },
  });
  const { sendMessage } = useSocketEvent<string>(socket, "listen-support");
  useSocketEvent<ListenSupportResponse>(socket, "support", {
    onMessage: async (message) => {
      console.log("AMount", message.data.amount);
      setNewSupport({
        message: "New Support",
        data: {
          amount: message.data.amount,
          decimals: message.data.decimals,
          from: trimAddress(message.data.from),
          message: message.data.message,
          symbol: message.data.symbol,
        },
      });
      setRenderKey((prev) => prev + 1);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    },
  });

  // {message: 'Pong', data: 'meong'}
  useSocketEvent<ListenSupportResponse>(socket, "support-init", {
    onMessage: (message) => {
      console.log("message on init", message);
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
      <Alert
        key={renderKey}
        {...props}
        sender={newSupport.data.from}
        amount={newSupport.data.amount}
        decimals={newSupport.data.decimals}
        symbol={newSupport.data.symbol}
      />
    </div>
  );
};

export default SupportAlert;
