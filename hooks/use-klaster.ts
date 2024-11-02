"use client";

import {
  KlasterSDK,
  BiconomyV2AccountInitData,
  initKlaster,
  klasterNodeHost,
  loadBiconomyV2Account,
  buildMultichainReadonlyClient,
  buildTokenMapping,
  deployment,
  UnifiedBalanceResult,
} from "klaster-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { Address, type Chain } from "viem";
import { baseSepolia, arbitrumSepolia, sepolia } from "viem/chains";
import { useParticle } from "./use-particle";

interface UseKlasterProps {
  address: string | undefined;
  status: "connected" | "reconnecting" | "connecting" | "disconnected";
  isConnected: boolean;
  chain: Chain | undefined;
}

interface TokenUBalance {
  symbol: string;
  logo: string;
  unified: UnifiedBalanceResult;
}

export const useKlaster = ({
  address,
  status,
  isConnected,
  chain,
}: UseKlasterProps) => {
  const { nativeBalance, disconnect } = useParticle({ address });
  const [isFullyConnected, setIsFullyConnected] = useState(false);
  const [soc, setSoc] = useState<Address>();
  const [unifiedBalances, setUnifiedBalances] = useState<TokenUBalance[]>([]);
  const [klaster, setKlaster] =
    useState<KlasterSDK<BiconomyV2AccountInitData>>();

  const mcClient = buildMultichainReadonlyClient(
    [baseSepolia, sepolia, arbitrumSepolia].map((item) => {
      return {
        chainId: item.id,
        rpcUrl: item.rpcUrls.default.http[0],
      };
    })
  );

  const mcUSDC = buildTokenMapping([
    deployment(sepolia.id, "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"),
    deployment(baseSepolia.id, "0x036CbD53842c5426634e7929541eC2318f3dCF7e"),
    deployment(
      arbitrumSepolia.id,
      "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
    ),
  ]);

  const fetchUnifiedBalanceRef = useRef<() => Promise<void>>();

  fetchUnifiedBalanceRef.current = async () => {
    if (!klaster || !mcClient || !mcUSDC) return;
    const uBalance = await mcClient.getUnifiedErc20Balance({
      tokenMapping: mcUSDC,
      account: klaster.account,
    });

    console.log("Unified Balance: ", uBalance);
    const usdc: TokenUBalance = {
      logo: "/images/usdc.png",
      symbol: "USDC",
      unified: uBalance,
    };
    setUnifiedBalances([usdc]);
  };

  const startKlaster = useCallback(async () => {
    if (isConnected && status === "connected" && address && chain) {
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
      setKlaster(klaster);
      setIsFullyConnected(true);
      setSoc(klaster.account.getAddress(chain.id));
    }
  }, [address, chain, isConnected, status]);

  useEffect(() => {
    if (isConnected && status === "connected" && address) {
      startKlaster();
    } else {
      setIsFullyConnected(false);
      setKlaster(undefined);
      setSoc(undefined);
    }
  }, [address, isConnected, startKlaster, status]);

  useEffect(() => {
    if (isFullyConnected) {
      const interval = setInterval(() => {
        fetchUnifiedBalanceRef.current?.();
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [isFullyConnected]);

  useEffect(() => {
    if (address && klaster) {
      fetchUnifiedBalanceRef.current?.();
    }
  }, [address, klaster]);

  return {
    klaster,
    isFullyConnected,
    soc,
    nativeBalance,
    disconnect,
    unifiedBalances,
  };
};
