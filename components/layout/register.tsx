"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Address } from "viem";
import Loader from "../shared/Loader";
import { useToast } from "@/hooks/use-toast";
import ToastTx from "../shared/ToastTx";
import { useInterchain } from "@/hooks/use-interchain";
import { useAccount } from "@particle-network/connectkit";

const Register = () => {
  const { address } = useAccount();
  const { toast } = useToast();
  const { registerAsStreamer } = useInterchain();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    if (!address) return;
    setIsRegistering(true);
    try {
      console.log("Registering as streamer");
      const result = await registerAsStreamer();
      console.log("Result", result);
      if (result === false) return;
      if (!result) {
        toast({
          title: "Transaction failed",
          description: "Failed to register as a streamer",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Interchain transaction submitted!",
        action: (
          <ToastTx
            explorerLink={`https://explorer.klaster.io/details`}
            explorerName="Klaster Explorer"
            txHash={result as Address}
          />
        ),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Transaction failed",
        description: "Failed to register as a streamer",
        variant: "destructive",
      });
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
        className="flex bg-aqua font-play font-bold text-xl p-6 text-midnight hover:bg-aqua/80"
      >
        {isRegistering ? <Loader /> : "Register Now"}
      </Button>
    </div>
  );
};

export default Register;
