"use client";

import React from "react";
import { Identity, Name } from "@coinbase/onchainkit/identity";
import { baseSepolia } from "viem/chains";

interface DisplayBasenameProps {
  address: `0x${string}` | undefined;
  color?: string;
}

export function Basenames({ address, color }: DisplayBasenameProps) {
  return (
    <Identity
      address={address}
      chain={baseSepolia}
      schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
    >
      <Name
        address={address}
        chain={baseSepolia}
        className="font-play text-5xl"
        style={color ? { color } : {}}
      />
    </Identity>
  );
}
