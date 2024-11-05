import React from "react";
import { ToastAction } from "../ui/toast";
import Link from "next/link";
import { Address } from "viem";

interface ToastTransactionProps {
  txHash: Address | undefined;
  explorerName: string;
  explorerLink: string;
}

const ToastTx = ({
  explorerLink,
  explorerName,
  txHash,
}: ToastTransactionProps) => {
  return (
    <ToastAction
      altText={`View on ${explorerName}`}
      className="bg-transparent border border-aqua"
    >
      <Link
        href={`${explorerLink}/${txHash}`}
        passHref
        className="hover:underline"
        target="_blank"
      >
        {" "}
        Monitor at {explorerName}{" "}
      </Link>
    </ToastAction>
  );
};

export default ToastTx;
