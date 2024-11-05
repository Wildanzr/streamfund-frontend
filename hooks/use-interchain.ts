"use client";

import { sepolia } from "viem/chains";
// import { buildTransaction, Transaction, TransactionBuilder } from "klaster-sdk";
import { useKlaster } from "./use-klaster";
import { STREAMFUND_ADDRESS } from "@/constant/common";
import { encodeFunctionData } from "viem";
import { STREAMFUND_ABI } from "@/constant/streamfund-abi";
import { useWallets, useAccount } from "@particle-network/connectkit";
import { type Address } from "viem";
import { Transaction } from "klaster-sdk";
import { TOKEN_ABI } from "@/constant/token-abi";

export const useInterchain = () => {
  const [primaryWallet] = useWallets();
  const { status, address, chain, isConnected } = useAccount();
  const { klaster } = useKlaster({
    address,
    status,
    isConnected,
    chain,
  });

  const signItxMessage = async (acc: Address, hash: Address) => {
    if (!address) return;

    const walletClient = primaryWallet.getWalletClient();
    const transactionResponse = await walletClient.signMessage({
      account: address as Address,
      message: {
        raw: hash,
      },
    });

    return transactionResponse;
  };

  const registerAsStreamer = async () => {
    if (!klaster) return;

    // ENCODE ABI DATA -> REGISTER STREAMER
    const data: Transaction = {
      gasLimit: BigInt(1000000),
      to: STREAMFUND_ADDRESS,
      data: encodeFunctionData({
        abi: STREAMFUND_ABI,
        functionName: "registerAsStreamer",
      }),
    };

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
            txs: [data],
          },
        ],
      });

      const signature = (await signItxMessage(acc, tx.itxHash)) as string;
      const result = await klaster.execute(tx, signature);

      return result.itxHash;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const supportWithEth = async (
    destination: Address,
    message: string,
    value: bigint
  ) => {
    if (!klaster) return;

    const data: Transaction = {
      gasLimit: BigInt(1000000),
      to: STREAMFUND_ADDRESS,
      value: value,
      data: encodeFunctionData({
        abi: STREAMFUND_ABI,
        functionName: "supportWithETH",
        args: [destination, message],
      }),
    };

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
            txs: [data],
          },
        ],
      });

      const signature = (await signItxMessage(acc, tx.itxHash)) as string;
      const result = await klaster.execute(tx, signature);

      return result.itxHash;
    } catch (error) {
      console.log(error);
    }
  };

  const supportWithToken = async (
    destination: Address,
    tokenAddress: Address,
    message: string,
    amount: bigint
  ) => {
    if (!klaster) return;

    const tokenApproval: Transaction = {
      gasLimit: BigInt(1000000),
      to: tokenAddress,
      data: encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [STREAMFUND_ADDRESS, amount],
      }),
    };
    const supportToken: Transaction = {
      gasLimit: BigInt(1000000),
      to: STREAMFUND_ADDRESS,
      data: encodeFunctionData({
        abi: STREAMFUND_ABI,
        functionName: "supportWithToken",
        args: [destination, tokenAddress, amount, message],
      }),
    };

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
            txs: [tokenApproval, supportToken],
          },
        ],
      });

      const signature = (await signItxMessage(acc, tx.itxHash)) as string;
      const result = await klaster.execute(tx, signature);

      return result.itxHash;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    registerAsStreamer,
    supportWithEth,
    supportWithToken,
  };
};
