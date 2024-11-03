"use client";

// import { buildTransaction, Transaction, TransactionBuilder } from "klaster-sdk";
import { useKlaster } from "./use-klaster";
import { useAccount } from "@particle-network/connectkit";
// import { STREAMFUND_ADDRESS } from "@/constant/common";

export const useInterchain = () => {
  const { status, address, chain, isConnected } = useAccount();
  const { klaster } = useKlaster({
    address,
    status,
    isConnected,
    chain,
  });

  const testKlaster = () => {
    console.log(klaster);
  };

  const registerAsStremer = async () => {
    try {
      //   const raw: Transaction = {};
    } catch (error) {
      console.log(error);
    }
  };

  return {
    testKlaster,
    registerAsStremer,
  };
};
