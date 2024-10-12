// Response.d.ts for API response global type declaration

export {};

declare global {
  interface CheckStreamKeyResponse {
    valid: boolean;
  }

  interface Token {
    _id: string;
    address: string;
    decimal: number;
    symbol: string;
    logo: string;
  }

  interface TokenResponse {
    tokens: Token[];
  }

  type CheckAddressResponse = CheckStreamKeyResponse;

  interface BaseWebsocketResponse {
    message: string;
    data: Record<string, unknown>;
  }

  interface ListenSupportResponse extends BaseWebsocketResponse {
    data: {
      amount: number;
      decimals: number;
      from: string;
      message: string;
      symbol: string;
    };
  }

  interface StreamerResponse {
    _id: string;
    address: string;
  }

  interface QRConfigResponse {
    quietZone: number;
    bgColor: string;
    fgColor: string;
    level: "H" | "L" | "M" | "Q" | undefined;
    style: "squares" | "dots" | "fluid" | undefined;
    streamer: StreamerResponse;
  }

  interface MarqueeConfigResponse {
    backgroundColor: string;
    textColor: string;
    font: string;
    textSize: number;
    text: string;
    streamer: StreamerResponse;
  }

  interface AlertConfigResponse {
    backgroundColor: string;
    mainColor: string;
    secondColor: string;
    font: string;
    textSize: number;
    sound: string;
    effect: string;
    streamer: StreamerResponse;
  }

  interface SupportResponse {
    _id: string;
    from: string;
    amount: number;
    message: string;
    token: {
      _id: string;
      decimal: number;
      symbol: string;
      logo: string;
    };
    hash: string;
  }

  interface QueryStreamerResponse {
    _id: string;
    streamkey: string;
    address: string;
    supports: SupportResponse[];
  }
}
