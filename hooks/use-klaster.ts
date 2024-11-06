"use client";

import {
  KlasterSDK,
  BiconomyV2AccountInitData,
  initKlaster,
  klasterNodeHost,
  loadBicoV2Account,
  buildMultichainReadonlyClient,
  buildTokenMapping,
  deployment,
  UnifiedBalanceResult,
} from "klaster-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import { Address, type Chain } from "viem";
import { baseSepolia, arbitrumSepolia, sepolia } from "viem/chains";
import { useParticle } from "./use-particle";
import { UNIFIED_USDC } from "@/constant/common";

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

interface TokenNativeBalance {
  symbol: string;
  logo: string;
  unified: bigint;
}

export const useKlaster = ({
  address,
  status,
  isConnected,
  chain,
}: UseKlasterProps) => {
  const { disconnect } = useParticle({ address });
  const [isFullyConnected, setIsFullyConnected] = useState(false);
  const [soc, setSoc] = useState<Address>();
  const [unifiedBalances, setUnifiedBalances] = useState<TokenUBalance[]>([]);
  const [unifiedNative, setUnifiedNative] = useState<TokenNativeBalance[]>([]);
  const [klaster, setKlaster] =
    useState<KlasterSDK<BiconomyV2AccountInitData>>();
  const [refetch, setRefetch] = useState<boolean>(false);

  const refetchUnified = () => {
    setRefetch(!refetch);
  };

  const mcClient = buildMultichainReadonlyClient(
    [sepolia, baseSepolia, arbitrumSepolia].map((item, idx) => {
      return {
        chainId: item.id,
        rpcUrl: UNIFIED_USDC[idx].rpc,
      };
    })
  );
  const mcUSDC = buildTokenMapping([
    deployment(sepolia.id, UNIFIED_USDC[0].address as Address),
    deployment(baseSepolia.id, UNIFIED_USDC[1].address as Address),
    deployment(arbitrumSepolia.id, UNIFIED_USDC[2].address as Address),
  ]);

  const fetchUnifiedBalanceRef = useRef<() => Promise<void>>();
  fetchUnifiedBalanceRef.current = async () => {
    if (!klaster || !mcClient || !mcUSDC) return;

    const uNative = await mcClient.getUnifiedNativeBalance({
      account: klaster.account,
    });
    const uBalance = await mcClient.getUnifiedErc20Balance({
      tokenMapping: mcUSDC,
      account: klaster.account,
    });

    const eth: TokenNativeBalance = {
      logo: "/icons/ethereum.svg",
      symbol: "ETH",
      unified: uNative,
    };
    const usdc: TokenUBalance = {
      logo: "/images/usdc.png",
      symbol: "USDC",
      unified: uBalance,
    };

    setUnifiedNative([eth]);
    setUnifiedBalances([usdc]);
  };

  const startKlaster = useCallback(async () => {
    if (isConnected && status === "connected" && address && chain) {
      const klaster = await initKlaster({
        accountInitData: loadBicoV2Account({
          owner: address as Address,
        }),
        nodeUrl: klasterNodeHost.default,
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
  }, [address, klaster, refetch]);

  return {
    klaster,
    isFullyConnected,
    soc,
    unifiedNative,
    unifiedBalances,
    refetchUnified,
    disconnect,
    mcClient,
    mcUSDC,
  };
};
