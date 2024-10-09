// Response.d.ts for API response global type declaration

export {};

declare global {
  interface CheckStreamKeyResponse {
    valid: boolean;
  }

  interface BaseWebsocketResponse {
    message: string;
    data: Record<string, unknown>;
  }

  interface ListenSupportResponse extends BaseWebsocketResponse {
    data: {
      address: string;
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
}
