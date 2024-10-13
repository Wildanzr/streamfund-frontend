"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { NATIVE_ADDRESS } from "@/constant/common";
import { Address, formatUnits } from "viem";
import {
  readAllowance,
  readAllowedTokenPrice,
  readTokenBalance,
} from "@/web3/streamfund";
import { displayFormatter } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@radix-ui/react-tooltip";
import { useToast } from "@/hooks/use-toast";

const quickSupportOptions = [1, 1.5, 3, 5, 10];

interface SupportFormProps {
  streamer: string;
  tokens: Token[];
}

const formSchema = z.object({
  streamer: z.string(),
  token: z.string(),
  amount: z.string(),
  message: z.string(),
});

export default function SupportForm({ tokens, streamer }: SupportFormProps) {
  const { toast } = useToast();
  const { address } = useAccount();
  const { data, refetch } = useBalance({
    address,
  });
  const [quickAmount, setQuickAmount] = useState(0);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const getTokenInfo = useCallback(
    (token: string) => {
      const result = tokens.find((t) => t.address === token);
      if (!result) return tokens[0];
      return result;
    },
    [tokens]
  );

  const hanldeFetchingBalance = useCallback(
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

    try {
      setIsSubmitting(true);
      console.log("TO", values.streamer);
      console.log("TOKEN", tokenInfo.address);
      console.log("AMOUNT", amoutParsed);
      console.log("MESSAGE", values.message);
      // Implement your submission logic here
    } catch (error) {
      console.error(error);
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
              <FormLabel>Token</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  hanldeFetchingBalance(value);
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

        <div className="space-y-2">
          <Label>Quick support</Label>
          <div className="grid grid-cols-5 gap-5">
            {quickSupportOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="sm"
                type="button"
                disabled={
                  isFetchingBalance || isSubmitting || !tokenInfo.address
                }
                className={`bg-transparent hover:bg-white/10 text-white hover:text-white ${
                  quickAmount === option ? "border border-aqua" : ""
                }`}
                value={option}
                onClick={() => handleQuickSupport(option)}
              >
                ${option}
              </Button>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={0.000001}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setQuickAmount(0);
                  }}
                  disabled={
                    isFetchingBalance || isSubmitting || !tokenInfo.address
                  }
                />
              </FormControl>
              {field.value && (
                <div className="flex flex-row space-x-2">
                  <p className="text-sm text-white/80">Equivalent:</p>
                  {isFetchingBalance ? (
                    <Loader size="20" />
                  ) : (
                    <div className="flex flex-row space-x-2 items-start justify-start">
                      <p className="text-sm text-white/80">
                        {displayFormatter(
                          2,
                          tokenInfo.currentPrice * +field.value
                        )}{" "}
                      </p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <InfoIcon
                              className="text-aqua cursor-pointer"
                              size="20"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex w-full h-full bg-aqua p-3 rounded-md">
                              <p className="text-black text-xs">
                                This price is based on the current market price
                                and may vary.
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

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
          type="submit"
          variant="secondary"
          disabled={isFetchingBalance || isSubmitting || !tokenInfo.address}
        >
          Support now
        </Button>
      </form>
    </Form>
  );
}
