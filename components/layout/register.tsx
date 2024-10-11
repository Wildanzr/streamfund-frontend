"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import { registerAsStreamer } from "@/web3/streamfund";
import useWaitForTxAction from "@/hooks/useWaitForTxAction";
import { Address } from "viem";
import { useRouter } from "next/navigation";
import Loader from "../shared/Loader";

const Register = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState<Address | undefined>();

  useWaitForTxAction({
    txHash,
    action: () => {
      alert("Registration successful! Waiting to getting redirected...");
      setTimeout(() => {
        router.refresh();
      }, 5000);
    },
  });

  const handleRegister = async () => {
    if (!address) return;
    setIsRegistering(true);
    try {
      const result = await registerAsStreamer(address);
      if (result === false) return;

      setTxHash(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };
  return (
    <div className="flex flex-col w-full h-full min-h-screen items-center justify-center space-y-4">
      <h3 className="font-play text-3xl font-bold">
        Are you ready to start your journey with StreamFund? Register now!
      </h3>
      <Button
        onClick={handleRegister}
        disabled={isRegistering}
        className="bg-aqua font-play font-bold text-2xl text-midnight hover:bg-aqua/80"
      >
        {isRegistering ? <Loader /> : "Register Now"}
      </Button>
    </div>
  );
};

export default Register;
