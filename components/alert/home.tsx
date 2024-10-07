"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import TextAnimation from "../texts/animation";

export default function HomeAlert() {
  const searchParams = useSearchParams();
  const streamkey = searchParams.get("streamkey") as string;
  const [sended, setSended] = useState(false);

  // type AnimationType =
  // | "wave"
  // | "bounce"
  // | "pulse"
  // | "rubberBand"
  // | "tada"
  // | "spin"
  // | "wiggle"
  // | "float"
  // | "jiggle"
  // | "heartbeat"
  // | "swing"
  // | "blink"
  // | "twist"
  // | "pendulum"
  // | "rotate";
  const all = [
    "wave",
    "bounce",
    "pulse",
    "rubberBand",
    "tada",
    "spin",
    "wiggle",
    "float",
    "jiggle",
    "heartbeat",
    "swing",
    "blink",
    "twist",
    "pendulum",
    "rotate",
  ];

  const HOST = `${process.env.NEXT_PUBLIC_BACKEND_URL}?streamkey=${streamkey}`;
  const { socket, connected } = useSocket(HOST);
  const { sendMessage } = useSocketEvent<string>(socket, "listen-support");
  const { lastMessage: notif } = useSocketEvent<ListenSupportResponse>(
    socket,
    "support",
    {
      onMessage: (message) => console.log("message", message),
    }
  );

  // {message: 'Pong', data: 'meong'}
  const { lastMessage } = useSocketEvent<ListenSupportResponse>(
    socket,
    "support-init",
    {
      onMessage: (message) => {
        console.log("message", message);
      },
    }
  );

  useEffect(() => {
    if (connected && !sended) {
      console.log("send message");
      sendMessage();
      setSended(true);
    }
  }, [connected, sendMessage, sended]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-20 space-y-3 text-white bg-black">
      <p className="text-2xl">Hello world</p>
      <p>Stream key: {streamkey}</p>
      <p>Host: {HOST}</p>
      <p>Connected: {connected ? "yes" : "no"}</p>
      <p>
        Last message:
        {lastMessage && lastMessage.data ? lastMessage.data.address : ""}
      </p>

      {/* <WaveText
        text="wildanzrrr.base.eth just donated 0.1 ETH"
        fontSize={48}
        color="#a0a0a0"
        amplitude={6}
        frequency={0.8}
        speed={1}
      /> */}

      {all.map((animationType) => (
        <TextAnimation
          key={animationType}
          text="wildanzrrr.base.eth just donated 0.1 ETH"
          type={animationType}
          duration={1.5}
          delay={0.1}
          staggerChildren={0.2}
          fontSize={32}
          color="#3366ff"
          revealSpeed={0.8}
          revealDuration={3}
        />
      ))}
    </div>
  );
}
