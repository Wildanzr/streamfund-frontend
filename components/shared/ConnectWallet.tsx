"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useDisconnect,
  useModal,
} from "@particle-network/connectkit";
import { CopyIcon, EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import { Address, formatUnits } from "viem";
import {
  initKlaster,
  klasterNodeHost,
  loadBiconomyV2Account,
} from "klaster-sdk";
import { arbitrumSepolia, baseSepolia, optimismSepolia } from "viem/chains";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useCopyToClipboard } from "usehooks-ts";

const ConnectWallet = () => {
  const [, copy] = useCopyToClipboard();
  const [balance, setBalance] = useState<number>(0);
  const [klasterAddress, setKlasterAddress] = useState<Address>();
  const { status, address, chain, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setOpen } = useModal();
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
  const disconnectWallet = async () => {
    await disconnect();
  };
  const handleCopyAddress = (address: string) => {
    copy(address);
    alert("Copied to clipboard");
  };

  useEffect(() => {
    fetchBalance();
  }, [address]); // Run effect when address changes

  useEffect(() => {
    const initializeKlaster = async () => {
      const klaster = await initKlaster({
        accountInitData: loadBiconomyV2Account({
          owner: address as Address,
        }),
        nodeUrl: klasterNodeHost.default,
        rpcs: [
          {
            chainId: baseSepolia.id,
            rpcUrl: baseSepolia.rpcUrls.default.http[0],
          },
          {
            chainId: arbitrumSepolia.id,
            rpcUrl: arbitrumSepolia.rpcUrls.default.http[0],
          },
          {
            chainId: optimismSepolia.id,
            rpcUrl: optimismSepolia.rpcUrls.default.http[0],
          },
        ],
      });
      const aaAddress = klaster?.account?.getAddress(chain?.id as number);
      setKlasterAddress(aaAddress);
    };

    if (isConnected && address) {
      initializeKlaster();
    }
  }, [address, isConnected]); // Run effect when address changes

  return status === "connected" ? (
    <Dialog>
      <DialogTrigger>
        <Button
          type="button"
          className="flex w-full flex-row gap-3 py-5 items-center transition justify-center duration-300 ease-in-out bg-white text-primary hover:bg-white hover:scale-105"
        >
          <div className="border-r-[1px] font-semibold border-black/60 pr-3">
            {truncateToThreeDecimals(balance)} {chain?.nativeCurrency.symbol}
          </div>
          <div className="text-sm">{truncatedAddress}</div>
          <EllipsisVerticalIcon size={13} color="black" />
        </Button>
      </DialogTrigger>

      <DialogContent className="text-white bg-primary border-primary shadow-md">
        <DialogHeader>
          <DialogTitle className="text-center">Wallet Info</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col text-sm">
          {/* ADDRESSES */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-row items-center gap-2 justify-between">
              <div>Primary Address: </div>
              <div className="flex flex-row gap-1 items-center">
                <div>{trimAddress(address as string)}</div>
                <CopyIcon
                  onClick={() => handleCopyAddress(address as string)}
                  color="gray"
                  size={14}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-row items-center gap-2 justify-between">
              <div>Klaster Address: </div>
              <div className="flex flex-row gap-1 items-center">
                <div>{trimAddress(klasterAddress as string)}</div>
                <CopyIcon
                  onClick={() => handleCopyAddress(klasterAddress as string)}
                  color="gray"
                  size={14}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* ASSETS */}
          <div></div>

          {/* DISCONNECT */}
          <DialogClose
            onClick={disconnectWallet}
            className="mt-8 w-fit self-end flex flex-row gap-1 items-center text-white/70 hover:text-white ease-in-out duration-300 text-xs"
          >
            <LogOutIcon size={20} />
            <div>Disconnect</div>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Button
      type="button"
      className="flex w-full flex-row gap-3 py-5 items-center transition justify-center duration-300 ease-in-out bg-white text-primary hover:bg-white hover:scale-105"
      onClick={() => setOpen(true)}
    >
      <p className="font-spaceMono w-full">Connect Wallet</p>
    </Button>
  );
};

export default ConnectWallet;
