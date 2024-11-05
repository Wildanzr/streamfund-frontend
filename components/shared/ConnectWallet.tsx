/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useAccount, useModal, useWallets } from "@particle-network/connectkit";
import { CopyIcon, EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import Loader from "@/components/shared/Loader";
import { useCopyToClipboard } from "usehooks-ts";
import Link from "next/link";
import Image from "next/image";
import { useKlaster } from "@/hooks/use-klaster";
import { formatEther, formatUnits } from "viem";
import { UNIFIED_USDC } from "@/constant/common";

const ConnectWallet = () => {
  const [, copy] = useCopyToClipboard();
  const { status, address, chain, isConnected } = useAccount();
  const {
    klaster,
    soc,
    isFullyConnected,
    disconnect,
    unifiedBalances,
    unifiedNative,
  } = useKlaster({
    address,
    status,
    isConnected,
    chain,
  });
  const { setOpen } = useModal();
  const wallet = useWallets();
  const truncatedAddress = klaster ? trimAddress(soc as string) : "";

  const handleCopyAddress = (address: string) => {
    copy(address);
    alert("Copied to clipboard");
  };

  return status === "connected" ? (
    <Dialog>
      <DialogTrigger>
        <div className="flex w-full flex-row gap-3 p-2 px-3 rounded-xl items-center transition justify-center duration-300 ease-in-out bg-white text-primary hover:bg-white hover:scale-105">
          <div className="border-r-[1px] font-semibold border-black/60 pr-3">
            {unifiedNative.length > 0 ? (
              <div>
                {unifiedNative[0] &&
                  parseFloat(formatEther(unifiedNative[0].unified)).toFixed(
                    3
                  )}{" "}
                {unifiedNative[0] && unifiedNative[0].symbol}{" "}
              </div>
            ) : (
              <Loader color="black" size="20" />
            )}
          </div>
          <div className="text-sm">{truncatedAddress}</div>
          <EllipsisVerticalIcon size={13} color="black" />
        </div>
      </DialogTrigger>

      <DialogContent className="text-white bg-primary border-primary shadow-md">
        <DialogHeader>
          <DialogTitle className="">Wallet Info</DialogTitle>
          <DialogDescription>
            Information about your connected wallet
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-row items-center gap-2 mb-2">
            <img
              alt="connector-icon"
              src={wallet[0]?.connector?.icon as string}
              width={25}
              height={25}
            />

            <Link
              target="_blank"
              className="hover:underline font-bold text-aqua"
              href={(chain?.blockExplorers?.default.url as string) || ""}
            >
              {chain?.name}
            </Link>
          </div>

          {/* ADDRESSES */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-2 justify-between">
              <div>Owner Address: </div>
              <div className="flex flex-row gap-1 items-center">
                <div>{address && trimAddress(address as string)}</div>
                <CopyIcon
                  onClick={() => handleCopyAddress(address as string)}
                  color="gray"
                  size={14}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {isFullyConnected && klaster && soc && (
              <div className="flex flex-row items-center gap-2 justify-between">
                <div>Klaster Address: </div>
                <div className="flex flex-row gap-1 items-center">
                  <p>{trimAddress(soc)}</p>
                  <CopyIcon
                    onClick={() => handleCopyAddress(soc)}
                    color="gray"
                    size={14}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ASSETS */}
          <hr className="border-white/70 mt-2" />
          <div className="flex flex-row flex-wrap justify-between gap-5">
            {unifiedBalances.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-row justify-between gap-5 w-full"
              >
                {UNIFIED_USDC.map((chain, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <Image
                      src={chain.logo}
                      alt={item.symbol}
                      height={25}
                      width={25}
                      className="rounded-full w-6 h-6"
                    />
                    <p className="text-xs">
                      {Number(
                        formatUnits(
                          item.unified.breakdown[idx].amount,
                          item.unified.decimals
                        )
                      )}{" "}
                      {item.symbol}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* TOTAL & DISCONNECT */}
          <div className="flex flex-row justify-between items-center mt-3">
            {unifiedBalances.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-row items-center pt-3 justify-center space-x-2"
              >
                <Image
                  alt={item.symbol}
                  height={25}
                  width={25}
                  src={item.logo}
                />
                <p className="font-bold text-lg">
                  {Number(
                    formatUnits(item.unified.balance, item.unified.decimals)
                  )}{" "}
                  {item.symbol}{" "}
                </p>
              </div>
            ))}

            <DialogClose
              onClick={() => disconnect()}
              className="mt-4 w-fit flex flex-row gap-1 items-center text-white/70 hover:text-white ease-in-out duration-300 text-xs"
            >
              <LogOutIcon size={20} />
              <div>Disconnect</div>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Button
      type="button"
      className="flex w-full flex-row gap-3 py-5 px-3 rounded-xl items-center transition justify-center duration-300 ease-in-out bg-white text-primary hover:bg-white hover:scale-105"
      onClick={() => setOpen(true)}
    >
      <p className="font-spaceMono w-full">Connect Wallet</p>
    </Button>
  );
};

export default ConnectWallet;
