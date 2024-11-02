"use client";

import { useDisconnect, usePublicClient } from "@particle-network/connectkit";
import { useCallback, useEffect, useState } from "react";
import { Address } from "viem";

interface UseParticleProps {
  address: string | undefined;
}

export const useParticle = ({ address }: UseParticleProps) => {
  const publicClient = usePublicClient();
  const { disconnect } = useDisconnect();
  const [nativeBalance, setNativeBalance] = useState<bigint>();

  const fetchBalance = useCallback(async () => {
    if (!address || !publicClient) return;
    const balance = await publicClient.getBalance({
      address: address as Address,
    });
    setNativeBalance(balance);
  }, [address, publicClient]);

  useEffect(() => {
    if (address && publicClient) {
      fetchBalance();
    }
  });

  return { nativeBalance, disconnect };
};
