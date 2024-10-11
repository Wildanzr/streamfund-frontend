"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

export default function HomeAlert() {
  const searchParams = useSearchParams();
  const streamkey = searchParams.get("streamkey") as string;
  const [sended, setSended] = useState(false);

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
  ] as const;

  const bgs = [
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-gray-500",
    "bg-black",
    "bg-white",
  ];

  const HOST = `${process.env.NEXT_PUBLIC_BACKEND_URL}?streamkey=${streamkey}`;
  const { socket, connected } = useSocket(HOST);
  const [isVisible, setIsVisible] = useState(true);
  const { sendMessage } = useSocketEvent<string>(socket, "listen-support");
  useSocketEvent<ListenSupportResponse>(socket, "support", {
    onMessage: (message) => {
      console.log("message", message);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    },
  });

  // {message: 'Pong', data: 'meong'}
  useSocketEvent<ListenSupportResponse>(socket, "support-init", {
    onMessage: (message) => {
      console.log("message", message);
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
    <div className="flex flex-col items-start justify-start w-full h-full min-h-screen space-y-3 text-white bg-transparent">
      <div className="flex-col space-y-5 items-center justify-center hidden">
        <p className="text-2xl">Hello world</p>
        <p>Stream key: {streamkey}</p>
        <p>Host: {HOST}</p>
        <p>Connected: {connected ? "yes" : "no"}</p>
      </div>

      {all.map((animationType) => (
        <div
          key={animationType}
          className={`${
            isVisible ? "flex" : "hidden"
          } flex-col w-full h-full max-w-5xl rounded-[20px] shadow border`}
        >
          <div
            className={`flex flex-col items-center justify-center w-full max-w-5xl min-h-40 h-full space-y-3 ${
              bgs[Math.floor(Math.random() * bgs.length)]
            } rounded-t-[20px] shadow border`}
          >
            {/* <TextAnimation
              text="wildanzrrr.base.eth just donated 0.1 ETH"
              type={animationType}
              duration={1.5}
              delay={0.1}
              staggerChildren={0.2}
              fontSize={32}
              color="#3366ff"
              revealSpeed={0.8}
              revealDuration={3}
            /> */}
          </div>
          <div className="flex flex-col items-center justify-center min-h-10 bg-white rounded-b-[20px] shadow border">
            <p className="text-black">wildanzrrr.base.eth</p>
          </div>
        </div>
      ))}
    </div>
  );
}
