"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAccount, useBalance } from "wagmi";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Loader from "../shared/Loader";
import { AVAILABLE_STICKERS, NATIVE_ADDRESS } from "@/constant/common";
import { Address, formatUnits } from "viem";
import {
  giveAllowance,
  readAllowance,
  readAllowedTokenPrice,
  readTokenBalance,
  supportWithETH,
  supportWithToken,
} from "@/web3/streamfund";
import { getExplorer, trimAddress } from "@/lib/utils";
// import { InfoIcon } from "lucide-react";
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@radix-ui/react-tooltip";
import { useToast } from "@/hooks/use-toast";
import useWaitForTxAction from "@/hooks/useWaitForTxAction";
import ToastTx from "../shared/ToastTx";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Image from "next/image";

interface SupportFormStickerProps {
  streamer: string;
  tokens: Token[];
}

const formSchema = z.object({
  streamer: z.string(),
  token: z.string(),
  amount: z.string(),
  message: z.string(),
});

export default function SupportFormSticker({
  tokens,
  streamer,
}: SupportFormStickerProps) {
  const etherscan = getExplorer();
  const { toast } = useToast();
  const { address } = useAccount();
  const { data, refetch } = useBalance({
    address,
  });
  const [quickAmount, setQuickAmount] = useState(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportState, setSupportState] = useState<"approve" | "support">(
    "approve"
  );
  const [isApproving, setIsApproving] = useState(false);
  const [txHash, setTxHash] = useState<Address | undefined>();
  const [tokenInfo, setTokenInfo] = useState({
    address: "",
    balance: 0,
    decimals: 0,
    symbol: "",
    allowance: 0,
    currentPrice: 0,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streamer,
      token: "",
      amount: "",
      message: "",
    },
  });

  const handlePostAction = async () => {
    if (isApproving) {
      toast({
        title: "Allowance has been approved",
        variant: "success",
      });
      setIsApproving(false);
      setSupportState("support");
    } else {
      toast({
        title: "Your support has been received to the streamer.",
        variant: "success",
      });
    }

    setTxHash(undefined);
  };

  useWaitForTxAction({
    txHash,
    action: handlePostAction,
  });

  const getTokenInfo = useCallback(
    (token: string) => {
      const result = tokens.find((t) => t.address === token);
      if (!result) return tokens[0];
      return result;
    },
    [tokens]
  );

  const handleFetchingBalance = useCallback(
    async (token: string) => {
      if (!address) return;
      const parsedToken = token as Address;

      try {
        setIsFetchingBalance(true);
        const tokenDetail = getTokenInfo(token);
        const price = await readAllowedTokenPrice(parsedToken);

        if (token === NATIVE_ADDRESS) {
          await refetch();
          setTokenInfo({
            address: NATIVE_ADDRESS,
            balance: Number(data?.value) ?? 0,
            decimals: tokenDetail.decimal ?? 18,
            symbol: tokenDetail.symbol ?? "ETH",
            allowance: 999999999,
            currentPrice: price,
          });
          setSupportState("support");
        } else {
          const tokenDetail = getTokenInfo(token);
          const [balance, allowance] = await Promise.all([
            readTokenBalance(address, parsedToken),
            readAllowance(address, parsedToken),
          ]);
          setTokenInfo({
            address: parsedToken,
            balance: Number(balance) ?? 0,
            decimals: tokenDetail.decimal,
            symbol: tokenDetail.symbol,
            allowance: Number(allowance) ?? 0,
            currentPrice: price,
          });
          if (Number(allowance) === 0) {
            setSupportState("approve");
          } else {
            setSupportState("support");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingBalance(false);
        form.setValue("amount", "");
        setQuickAmount(0);
      }
    },
    [address, data?.value, form, getTokenInfo, refetch]
  );

  const handleQuickSupport = useCallback(
    (value: number) => {
      setQuickAmount(value);
      const amountToBe = (value / tokenInfo.currentPrice).toFixed(
        tokenInfo.decimals
      );
      form.setValue("amount", amountToBe, { shouldValidate: true });
    },
    [form, tokenInfo.currentPrice, tokenInfo.decimals]
  );

  const handleApprove = async (): Promise<void> => {
    if (!address) return;
    setIsApproving(true);
    try {
      const token = tokenInfo.address as Address;
      const result = await giveAllowance(address, token);
      if (result === false) return;
      setTxHash(result);
      toast({
        title: "Transaction submitted",
        action: (
          <ToastTx
            explorerLink={etherscan.url}
            explorerName={etherscan.name}
            txHash={result}
          />
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Transaction failed",
        description: "Failed to give allowance",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!address) return;
    const amoutParsed = Number(values.amount) * 10 ** tokenInfo.decimals;

    if (amoutParsed > tokenInfo.balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance to support",
        variant: "destructive",
      });
      return;
    }
    const tokenDetail = getTokenInfo(values.token);

    try {
      setIsSubmitting(true);
      // Implement your submission logic here
      const streamer = values.streamer as Address;
      const token = values.token as Address;
      let result: boolean | Address = false;

      const isNeedApprove =
        tokenInfo.allowance === 0
          ? true
          : tokenInfo.allowance <
            Number(form.watch("amount")) * 10 ** tokenInfo.decimals
          ? true
          : false;

      if (
        isNeedApprove &&
        tokenDetail.address !== NATIVE_ADDRESS &&
        supportState !== "support"
      ) {
        await handleApprove();
        return;
      }
      if (tokenDetail.address === NATIVE_ADDRESS) {
        result = await supportWithETH(amoutParsed, streamer, values.message);
      } else {
        result = await supportWithToken(
          amoutParsed,
          streamer,
          token,
          values.message
        );
      }
      if (result === false) return;
      setTxHash(result);
      toast({
        title: "Transaction submitted",
        action: (
          <ToastTx
            explorerLink={etherscan.url}
            explorerName={etherscan.name}
            txHash={txHash}
          />
        ),
      });

      form.reset();
      setQuickAmount(0);
    } catch (error) {
      console.error(error);
      toast({
        title: "Transaction failed",
        description: "Failed to support the streamer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pay with</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleFetchingBalance(value);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token._id} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && (
                <div className="flex flex-row space-x-2">
                  <p className="text-sm text-white/80">Available:</p>
                  {isFetchingBalance ? (
                    <Loader size="20" />
                  ) : (
                    <div className="flex flex-row space-x-2 text-sm text-white/80">
                      <p>
                        {tokenInfo.balance === 0
                          ? 0
                          : formatUnits(
                              BigInt(tokenInfo.balance),
                              tokenInfo.decimals
                            )}{" "}
                        ${tokenInfo.symbol}
                      </p>
                    </div>
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2 h-full">
          <Label>Select sticker</Label>
          <div className="flex flex-row flex-wrap gap-5 items-center justify-center">
            {AVAILABLE_STICKERS.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                type="button"
                disabled={
                  isFetchingBalance || isSubmitting || !tokenInfo.address
                }
                className={`flex flex-col h-50 border-2 items-center rounded-sm justify-center p-0 bg-transparent hover:bg-white/10 ${
                  quickAmount === option.value && "border-aqua"
                }`}
                value={option.value}
                onClick={() => handleQuickSupport(option.value)}
              >
                <Image
                  src={option.thumbnail}
                  width={500}
                  height={500}
                  alt="sticker"
                  className="w-[125px] h-[125px] bg-white object-cover object-top"
                />
                <div className="text-white text-sm py-2">
                  {option.name} (${option.value})
                </div>
              </Button>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Leave a message or question to your favorite streamer"
                  {...field}
                  disabled={
                    isFetchingBalance || isSubmitting || !tokenInfo.address
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="w-full bg-aqua text-black"
          type={"submit"}
          variant="secondary"
          disabled={
            isFetchingBalance ||
            isSubmitting ||
            !tokenInfo.address ||
            form.watch("amount") === ""
          }
        >
          {isApproving || isSubmitting ? (
            <Loader size="20" />
          ) : (
            <p className="mx-2">
              {supportState === "approve" ? "Approve" : "Support Now"}
            </p>
          )}
        </Button>

        <div className="flex flex-col space-y-2 w-full h-full items-center justify-center">
          <Separator />
          <h3 className="text-white/80 text-base text-center">
            Need token? Mint here!
          </h3>
          {tokens.slice(1).map((token) => (
            <Link
              href={`${etherscan.url}/address/${token.address}`}
              key={token._id}
            >
              {token.symbol} - {trimAddress(token.address)}
            </Link>
          ))}
        </div>
      </form>
    </Form>
  );
}
