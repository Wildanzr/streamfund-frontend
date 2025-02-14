"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";

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
  return (
    <div className="flex flex-col space-y-1">
      <ConnectButton label={label} />

      <Link href="https://staging.streamfund.live" target="_blank">
        <Button variant="link" className="text-white">
          Manta Version -&gt;
        </Button>
      </Link>
    </div>
  );
};

export default WalletButton;
