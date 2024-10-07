"use client";

import { DefaultEventsMap } from "socket.io";
import { io, Socket } from "socket.io-client";

const HOST = `${process.env.NEXT_PUBLIC_BACKEND_URL}?streamkey=this-is-vey-secret`;

export const connectSocket = (
  streamkey: string
): Socket<DefaultEventsMap, DefaultEventsMap> => {
  const HOST = `${process.env.NEXT_PUBLIC_BACKEND_URL}?streamkey=${streamkey}`;
  return io(HOST, {
    withCredentials: true,
    transports: ["websocket"],
    extraHeaders: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const socket = io(HOST, {
  withCredentials: true,
  transports: ["websocket"],
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
});
