"use client";

import React, { useEffect, useState } from "react";
import {
  useModal,
  useAccount,
  usePublicClient,
} from "@particle-network/connectkit";
import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import { Address, formatUnits } from "viem";

interface ConnectWalletProps {
  label: string;
  customClasses?: string;
}

const ConnectWallet = ({ label }: ConnectWalletProps) => {
  const [balance, setBalance] = useState<number>(0);
  const { setOpen } = useModal();
  const { status, address, chain } = useAccount();
  const publicClient = usePublicClient();
  const truncatedAddress = address ? trimAddress(address as string) : "";

  const fetchBalance = async () => {
    if (!address) return;

    const formatedAddress = address as Address;
    const balanceResponse = await publicClient?.getBalance({
      address: formatedAddress,
    });

    setBalance(Number(formatUnits(balanceResponse as bigint, 18)));
  };

  const truncateToThreeDecimals = (num: number) => {
    return parseFloat(num.toString().slice(0, num.toString().indexOf(".") + 4));
  };

  useEffect(() => {
    fetchBalance();
  }, [address]); // Run effect when address changes

  return (
    <Button
      type="button"
      className="flex w-full flex-row gap-3 py-5 items-center transition justify-center duration-300 ease-in-out bg-white text-primary hover:bg-white hover:scale-105"
      onClick={() => setOpen(true)}
    >
      {status === "connected" ? (
        <>
          <div className="border-r-[1px] font-semibold border-black/60 pr-3">
            {truncateToThreeDecimals(balance)} {chain?.nativeCurrency.symbol}
          </div>
          <div className="text-sm">{truncatedAddress}</div>
          <EllipsisVerticalIcon size={13} color="black" />
        </>
      ) : (
        <p className="font-spaceMono w-full">{label}</p>
      )}
    </Button>
  );
};

export default ConnectWallet;
