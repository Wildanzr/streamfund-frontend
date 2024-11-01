/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useDisconnect,
  useModal,
  useWallets,
} from "@particle-network/connectkit";
import { CopyIcon, EllipsisVerticalIcon, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { trimAddress } from "@/lib/utils";
import { Address, formatUnits } from "viem";
import {
  initKlaster,
  klasterNodeHost,
  loadBiconomyV2Account,
  buildMultichainReadonlyClient,
  buildTokenMapping,
  deployment,
  BiconomyV2AccountInitData,
  KlasterSDK,
} from "klaster-sdk";
import { arbitrumSepolia, baseSepolia, sepolia } from "viem/chains";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useCopyToClipboard } from "usehooks-ts";
import Link from "next/link";
import Image from "next/image";

const ConnectWallet = () => {
  const [, copy] = useCopyToClipboard();
  const [balance, setBalance] = useState<number>(0);
  const [klasterAcc, setKlasterAcc] =
    useState<KlasterSDK<BiconomyV2AccountInitData>>();
  const [klasterAddress, setKlasterAddress] = useState<Address>();
  const { status, address, chain, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { setOpen } = useModal();
  const publicClient = usePublicClient();
  const wallet = useWallets();
  const truncatedAddress = address ? trimAddress(address as string) : "";

  // MULTICHAIN CLIENT
  const mcClient = buildMultichainReadonlyClient(
    [baseSepolia, sepolia, arbitrumSepolia].map((x) => {
      return {
        chainId: x.id,
        rpcUrl: x.rpcUrls.default.http[0],
      };
    })
  );
  const mcUSDT = buildTokenMapping([
    deployment(baseSepolia.id, "0x4D658F958EB5572a9598B538f36D74B32982b10c"),
  ]);

  const getUnifiedToken = async () => {
    if (!klasterAcc) return;

    const test = await mcClient.getUnifiedErc20Balance({
      tokenMapping: mcUSDT,
      account: klasterAcc.account,
    });

    console.log(Number(test.balance) / 10 ** test.decimals);
  };
  getUnifiedToken();

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
            chainId: sepolia.id,
            rpcUrl: sepolia.rpcUrls.default.http[0],
          },
        ],
      });
      setKlasterAcc(klaster);
      const aaAddress = klaster?.account?.getAddress(chain?.id as number);
      setKlasterAddress(aaAddress);
    };
    if (isConnected && address) {
      initializeKlaster();
    }
  }, [address, isConnected, chain]); // Run effect when address changes

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
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex flex-row items-center gap-2 justify-between">
              <div>Primary Address: </div>
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

            <div className="flex flex-row items-center gap-2 justify-between">
              <div>Klaster Address: </div>
              <div className="flex flex-row gap-1 items-center">
                <div>
                  {klasterAddress && trimAddress(klasterAddress as string)}
                </div>
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
          <hr className="border-white/70 mt-2" />
          <div className="flex flex-row flex-wrap justify-between gap-5">
            <div className="flex flex-row items-center gap-1">
              <Image
                alt="crypto-currency"
                height={22}
                width={22}
                src={"/images/eth.png"}
              />
              <div>: 0.2</div>
            </div>

            <div className="flex flex-row items-center gap-1">
              <Image
                alt="crypto-currency"
                height={22}
                width={22}
                src={"/images/usdt.png"}
              />
              <div>: 10</div>
            </div>

            <div className="flex flex-row items-center gap-1">
              <Image
                alt="crypto-currency"
                height={22}
                width={22}
                src={"/images/usdc.png"}
              />
              <div>: 25</div>
            </div>

            <div className="flex flex-row items-center gap-1">
              <Image
                alt="crypto-currency"
                height={22}
                width={22}
                src={"/images/dai.png"}
              />
              <div>: 30</div>
            </div>
          </div>

          {/* DISCONNECT */}
          <DialogClose
            onClick={disconnectWallet}
            className="mt-4 w-fit self-end flex flex-row gap-1 items-center text-white/70 hover:text-white ease-in-out duration-300 text-xs"
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
