"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

export default function HomeAlert() {
  const searchParams = useSearchParams();
  const streamkey = searchParams.get("streamkey") as string;
  const [sended, setSended] = useState(false);

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
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-3 text-white bg-black">
      <p className="text-2xl">Hello world</p>
      <p>Stream key: {streamkey}</p>
      <p>Host: {HOST}</p>
      <p>Connected: {connected ? "yes" : "no"}</p>
      <p>
        Last message:
        {lastMessage && lastMessage.data ? lastMessage.data.address : ""}
      </p>
    </div>
  );
}
