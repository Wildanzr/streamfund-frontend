"use client";

import React from "react";
import { IoProvider } from "socket.io-react-hook";

const SocketProvider = ({ children }: ChildrenProps) => {
  return <IoProvider>{children}</IoProvider>;
};

export default SocketProvider;
