import { defineChain } from "@particle-network/connectkit/chains";

export const STREAMFUND_ADDRESS = "0x71657eD011C7A3C1c36D6F33F08eA3Cb5e6fa8Ae";
export const BASENAMES_ADDRESS = "0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a";
export const NATIVE_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const SUPPORT_OPTIONS = [1, 1.5, 3, 5, 10];

export const AVAILABLE_FONTS = [
  {
    name: "Play",
    value: "font-play",
  },
  {
    name: "Space Grotesk",
    value: "font-grotesk",
  },
  {
    name: "Protest Strike",
    value: "font-protest",
  },
] as const;

export const AVAILABLE_ANIMATIONS = [
  { name: "Wave", value: "wave" },
  { name: "Bounce", value: "bounce" },
  { name: "Pulse", value: "pulse" },
  { name: "Rubber Band", value: "rubberBand" },
  { name: "Tada", value: "tada" },
  { name: "Spin", value: "spin" },
  { name: "Wiggle", value: "wiggle" },
  { name: "Float", value: "float" },
  { name: "Jiggle", value: "jiggle" },
  { name: "Heartbeat", value: "heartbeat" },
  { name: "Swing", value: "swing" },
  { name: "Blink", value: "blink" },
  { name: "Twist", value: "twist" },
  { name: "Pendulum", value: "pendulum" },
  { name: "Rotate", value: "rotate" },
] as const;

export const AVAILABLE_SOUNDS = [
  {
    name: "Among Us",
    value: "among-us",
    src: "https://storage.googleapis.com/sdq-charity/sounds/amongus.mp3",
  },
  {
    name: "Boom",
    value: "boom",
    src: "https://storage.googleapis.com/sdq-charity/sounds/boom.mp3",
  },
  {
    name: "Bruh",
    value: "bruh",
    src: "https://storage.googleapis.com/sdq-charity/sounds/bruh.mp3",
  },
  {
    name: "Buzzer",
    value: "buzzer",
    src: "https://storage.googleapis.com/sdq-charity/sounds/buzzer.mp3",
  },
  {
    name: "Discord notification",
    value: "discord",
    src: "https://storage.googleapis.com/sdq-charity/sounds/discord.mp3",
  },
  {
    name: "Dun dun dunnnnn",
    value: "dun",
    src: "https://storage.googleapis.com/sdq-charity/sounds/dundundun.mp3",
  },
  {
    name: "Spongebob fail",
    value: "fail",
    src: "https://storage.googleapis.com/sdq-charity/sounds/fail.mp3",
  },
  {
    name: "Fart",
    value: "fart",
    src: "https://storage.googleapis.com/sdq-charity/sounds/fart.mp3",
  },
  {
    name: "Fart moaning",
    value: "fart-moan",
    src: "https://storage.googleapis.com/sdq-charity/sounds/fartmoan.mp3",
  },
  {
    name: "Get out",
    value: "get-out",
    src: "https://storage.googleapis.com/sdq-charity/sounds/getout.mp3",
  },
  {
    name: "Rizz",
    value: "rizz",
    src: "https://storage.googleapis.com/sdq-charity/sounds/rizz.mp3",
  },
  {
    name: "Wow",
    value: "wow",
    src: "https://storage.googleapis.com/sdq-charity/sounds/wow.mp3",
  },
] as const;

export const AVAILABLE_VIDEO = [
  {
    name: "Bird Pack",
    value: 5,
    src: "/videos/video-1.mp4",
  },
  {
    name: "Dripping Coin",
    value: 10,
    src: "/videos/video-2.mp4",
  },
  {
    name: "Fireworks",
    value: 25,
    src: "/videos/video-3.mp4",
  },
] as Video[];

export const sepolia = defineChain({
  id: 11_155_111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 751532,
    },
    ensRegistry: { address: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e" },
    ensUniversalResolver: {
      address: "0xc8Af999e38273D658BE1b921b88A9Ddf005769cC",
      blockCreated: 5_317_080,
    },
  },
  testnet: true,
});
