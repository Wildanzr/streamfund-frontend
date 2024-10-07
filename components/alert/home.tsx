"use client";

import { useEffect, useState } from "react";
import { socket } from "../shared/socket";
import useSocketIO from "@/hooks/socket";

export default function HomeAlert() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  useSocketIO();

  function handlePing() {
    const paylod = {
      address: "0x20047D546F34DC8A58F8DA13fa22143B4fC5404a",
    };
    console.log("Ping sent");
    socket.emit("ping", JSON.stringify(paylod));
  }

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onPong() {
      console.log("Pong received");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("pong", onPong);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("pong", onPong);
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>

      <button className="p-5 bg-red-500" onClick={handlePing}>
        PING
      </button>
    </div>
  );
}
