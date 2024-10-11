"use client";

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
  const [isVisible, setIsVisible] = useState(false);
  const [sended, setSended] = useState(false);
  const { sendMessage } = useSocketEvent<string>(socket, "listen-support");
  useSocketEvent<ListenSupportResponse>(socket, "support", {
    onMessage: (message) => {
      console.log("message support", message);
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
        {...props}
        sender="sender"
        amount={1}
        decimals={1}
        symbol={"symbol"}
      />
    </div>
  );
};

export default SupportAlert;
