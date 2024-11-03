"use client";

import { sepolia } from "viem/chains";
// import { buildTransaction, Transaction, TransactionBuilder } from "klaster-sdk";
import { useKlaster } from "./use-klaster";
import { STREAMFUND_ADDRESS } from "@/constant/common";
import { encodeFunctionData } from "viem";
import { STREAMFUND_ABI } from "@/constant/streamfund-abi";
import { useWallets, useAccount } from "@particle-network/connectkit";
import { type Address } from "viem";
// import { STREAMFUND_ADDRESS } from "@/constant/common";

export const useInterchain = () => {
  // const { signMessage } = useSignMessage();
  const [primaryWallet] = useWallets();
  const { status, address, chain, isConnected } = useAccount();
  const { klaster } = useKlaster({
    address,
    status,
    isConnected,
    chain,
  });

  const signItxMessage = async (acc: `0x${string}`, hash: `0x${string}`) => {
    if (!address) return;
    // Get the wallet client and send the transaction
    const walletClient = primaryWallet.getWalletClient();
    const transactionResponse = await walletClient.signMessage({
      account: address as Address,
      message: {
        raw: hash,
      },
    });

    return transactionResponse;
  };
  const registerAsStremer = async () => {
    if (!klaster) return;

    try {
      const acc = klaster.account.getAddress(sepolia.id) as Address;
      const tx = await klaster.getQuote({
        nodeFeeOperation: {
          chainId: sepolia.id,
          token: "0x0000000000000000000000000000000000000000",
        },
        operations: [
          {
            chainId: sepolia.id,
            txs: [
              {
                gasLimit: BigInt(1000000),
                to: STREAMFUND_ADDRESS,
                data: encodeFunctionData({
                  abi: STREAMFUND_ABI,
                  functionName: "registerAsStreamer",
                }),
              },
            ],
          },
        ],
      });
      console.log("Tx", tx);

      const signature = (await signItxMessage(acc, tx.itxHash)) as string;
      console.log("Signature: ", signature);
      const result = await klaster.execute(tx, signature);
      console.log("Result: ", result);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    registerAsStremer,
  };
};
