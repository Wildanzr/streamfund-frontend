"use client";

import { sepolia } from "viem/chains";
// import { buildTransaction, Transaction, TransactionBuilder } from "klaster-sdk";
import { useKlaster } from "./use-klaster";
import { MAX_GAS_LIMIT, STREAMFUND_ADDRESS } from "@/constant/common";
import { encodeFunctionData } from "viem";
import { STREAMFUND_ABI } from "@/constant/streamfund-abi";
import { useWallets, useAccount } from "@particle-network/connectkit";
import { type Address } from "viem";
import { buildItx, encodeBridgingOps, QuoteResponse, rawTx } from "klaster-sdk";
import { TOKEN_ABI } from "@/constant/token-abi";
import { acrossBridgePlugin } from "@/lib/across-bridge";

export const useInterchain = () => {
  const [primaryWallet] = useWallets();
  const { status, address, chain, isConnected } = useAccount();
  const { klaster, mcClient, mcUSDC, unifiedNative } = useKlaster({
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
    const data = rawTx({
      gasLimit: MAX_GAS_LIMIT,
      to: STREAMFUND_ADDRESS,
      data: encodeFunctionData({
        abi: STREAMFUND_ABI,
        functionName: "registerAsStreamer",
      }),
    });

    try {
      const acc = klaster.account.getAddress(sepolia.id) as Address;
      const tx = await klaster.getQuote({
        feeTx: {
          chainId: sepolia.id,
          token: "0x0000000000000000000000000000000000000000",
        },
        steps: [
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

    const data = rawTx({
      gasLimit: MAX_GAS_LIMIT,
      to: STREAMFUND_ADDRESS,
      value: value,
      data: encodeFunctionData({
        abi: STREAMFUND_ABI,
        functionName: "supportWithETH",
        args: [destination, message],
      }),
    });

    try {
      const acc = klaster.account.getAddress(sepolia.id) as Address;
      const tx = await klaster.getQuote({
        feeTx: klaster.encodePaymentFee(sepolia.id, "ETH"),
        steps: [
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
    tokenUnified: TokenUBalance,
    destination: Address,
    tokenAddress: Address,
    message: string,
    amount: bigint
  ) => {
    if (!klaster) return;

    /**
     * Flow:
     * 1. Check if balance in current chain ID is sufficient
     * 2. If not, bridge the token to the destination chain ID
     * 3. Support with token
     */

    // create a variable adjustedAmount, this value is amount + 1.5% of amount
    const adjustedAmount =
      amount + BigInt(Math.ceil((Number(amount) * 1.5) / 100));

    console.log("Klaster", klaster);
    const bridging = await encodeBridgingOps({
      account: klaster.account,
      amount: adjustedAmount,
      bridgePlugin: acrossBridgePlugin,
      client: mcClient,
      tokenMapping: mcUSDC,
      destinationChainId: sepolia.id,
      unifiedBalance: tokenUnified.unified,
    });
    console.log("Bridging", bridging);

    const tokenApproval = rawTx({
      gasLimit: MAX_GAS_LIMIT,
      to: tokenAddress,
      data: encodeFunctionData({
        abi: TOKEN_ABI,
        functionName: "approve",
        args: [STREAMFUND_ADDRESS, adjustedAmount],
      }),
    });

    const supportToken = rawTx({
      gasLimit: MAX_GAS_LIMIT,
      to: STREAMFUND_ADDRESS,
      data: encodeFunctionData({
        abi: STREAMFUND_ABI,
        functionName: "supportWithToken",
        args: [destination, tokenAddress, adjustedAmount, message],
      }),
    });

    try {
      const sepoliaBalance = tokenUnified.unified.breakdown.find(
        (item) => item.chainId === sepolia.id
      )!;
      const isAmountSufficient = sepoliaBalance.amount > amount;
      console.log("Sepolia Balance", sepoliaBalance.amount);
      console.log("Requested Amount", amount);
      console.log("isAmountSufficient", isAmountSufficient);
      const acc = klaster.account.getAddress(sepolia.id) as Address;
      let tx: QuoteResponse | undefined;
      if (isAmountSufficient) {
        console.log("Direct support with token");
        tx = await klaster.getQuote({
          feeTx: klaster.encodePaymentFee(sepolia.id, "ETH"),
          steps: [
            {
              chainId: sepolia.id,
              txs: [tokenApproval, supportToken],
            },
          ],
        });
      } else {
        console.log("Support with bridging");

        const teee = bridging.steps.concat([
          {
            chainId: sepolia.id,
            txs: [tokenApproval, supportToken],
          },
        ]);
        console.log("bridging", teee);
        const iTX = buildItx({
          feeTx: klaster.encodePaymentFee(sepolia.id, "ETH"),
          steps: bridging.steps.concat([
            {
              chainId: sepolia.id,
              txs: [tokenApproval, supportToken],
            },
          ]),
        });
        console.log("Quote iTX", iTX);
        tx = await klaster.getQuote(iTX);
      }

      const signature = (await signItxMessage(acc, tx.itxHash)) as string;
      console.log("Signature", signature);
      const result = await klaster.execute(tx, signature);
      console.log("Result: ", result);

      return result.itxHash;
    } catch (error) {
      console.log(error);
    }
  };

  const withdrawEthToAddress = async (to: Address) => {
    if (!klaster) return;

    const data = rawTx({
      gasLimit: MAX_GAS_LIMIT,
      to,
      value: unifiedNative[0].unified,
    });

    try {
      const acc = klaster.account.getAddress(sepolia.id) as Address;
      const tx = await klaster.getQuote({
        feeTx: klaster.encodePaymentFee(sepolia.id, "ETH"),
        steps: [
          {
            chainId: sepolia.id,
            txs: [data],
          },
        ],
      });

      const signature = (await signItxMessage(acc, tx.itxHash)) as string;
      const result = await klaster.execute(tx, signature);

      console.log("Result: ", result);

      return result.itxHash;
    } catch (error) {
      console.log(error);
    }
  };

  const videoSupportEth = async (
    destination: Address,
    videoId: Address,
    message: string,
    value: bigint
  ) => {
    if (!klaster) return;

    const data = rawTx({
      gasLimit: MAX_GAS_LIMIT,
      to: STREAMFUND_ADDRESS,
      value: value,
      data: encodeFunctionData({
        abi: STREAMFUND_ABI,
        functionName: "supportWithVideoETH",
        args: [destination, videoId, message],
      }),
    });

    try {
      const acc = klaster.account.getAddress(sepolia.id) as Address;
      const tx = await klaster.getQuote({
        feeTx: klaster.encodePaymentFee(sepolia.id, "ETH"),
        steps: [
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

  return {
    registerAsStreamer,
    supportWithEth,
    supportWithToken,
    withdrawEthToAddress,
    videoSupportEth,
  };
};
