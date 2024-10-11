"use client";

import { useWaitForTransactionReceipt } from "wagmi";
import { useEffect } from "react";
import { simpleConfig } from "@/web3/client";

interface UseWaitForTxActionProps {
  txHash: `0x${string}` | undefined;
  action: (() => void) | (() => Promise<void>);
}

const useWaitForTxAction = ({ action, txHash }: UseWaitForTxActionProps) => {
  const waitTx = useWaitForTransactionReceipt({
    hash: txHash,
    config: simpleConfig,
  });

  useEffect(() => {
    if (waitTx?.status === "success") {
      action();
    }
  }, [action, waitTx]);
};

export default useWaitForTxAction;
