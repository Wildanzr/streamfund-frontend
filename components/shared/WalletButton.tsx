"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";

interface WalletButtonProps {
  label?: string;
}

const WalletButton = ({ label }: WalletButtonProps) => {
  const { status } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "connected" && pathname === "/") {
      setTimeout(() => {
        router.push("/app");
      }, 2000);
    }
  }, [pathname, router, status]);
  return <ConnectButton label={label} />;
};

export default WalletButton;
