// Global.d.ts for global type declaration

import { UnifiedBalanceResult } from "klaster-sdk";

export {};

declare global {
  interface URLProps {
    params: { id: string };
    searchParams: { [key: string]: string | undefined };
  }

  interface ChildrenProps {
    children: React.ReactNode;
  }

  interface TokenUBalance {
    symbol: string;
    logo: string;
    unified: UnifiedBalanceResult;
  }
}
