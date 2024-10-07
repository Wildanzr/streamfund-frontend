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
}
