import Header from "@/components/layout/header";
import { Metadata } from "next";

import Game from "../public/icons/game.json";
import DisplayLottie from "@/components/lottie/lottie";
import Background from "@/components/layout/background";

export const metadata: Metadata = {
  title: "StreamFund",
  description:
    "StreamFund is a Web3-based donation platform that enables streamers to receive cryptocurrency support directly from their audience. With StreamFund, streamers can monetize their content effortlessly while fans contribute using crypto, enjoying lower fees and instant transactions. Our platform enhances viewer engagement through interactive perks and provides transparent, secure donation tracking powered by blockchain technology.",
  keywords: [
    "streamfund",
    "stream",
    "fund",
    "donation",
    "crypto",
    "cryptocurrency",
    "blockchain",
    "streamer",
    "audience",
    "monetize",
    "content",
    "fees",
    "transactions",
    "engagement",
    "perks",
    "tracking",
    "technology",
  ],
  authors: {
    name: "Wildanzrrr",
    url: "https://wildanzr.my.id",
  },
  creator: "Wildanzrrr",
  publisher: "Wildanzrrr",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://streamfund.vercel.app",
    siteName: "StreamFund",
    title: "StreamFund",
    description:
      "StreamFund is a Web3-based donation platform that enables streamers to receive cryptocurrency support directly from their audience. With StreamFund, streamers can monetize their content effortlessly while fans contribute using crypto, enjoying lower fees and instant transactions. Our platform enhances viewer engagement through interactive perks and provides transparent, secure donation tracking powered by blockchain technology.",
  },
};

export default function Home() {
  return (
    <div className="flex relative flex-col items-start justify-start w-full h-full min-h-screen">
      <Background />
      <div className="flex flex-col space-y-10 items-center justify-start w-full h-full z-10">
        <Header />
        <div className="flex flex-col space-y-5 w-full h-full items-center justify-center p-10">
          <h1 className="text-6xl font-play font-bold text-white text-left md:text-center">
            Stream, Engage, and Earn
          </h1>
          <h3 className="text-2xl font-play text-white text-left md:text-center">
            The Future of Support for Content Creators is Here!
          </h3>
        </div>

        <DisplayLottie animationData={Game} />

        <div className="flex flex-col space-y-5 w-full h-full justify-start z-10 p-10">
          <p className="text-white font-play text-2xl text-center">
            Your viewers are more than just fans; they’re your biggest
            supporters! StreamFund makes it easy for them to donate and interact
            with you in real-time, while you enjoy instant payouts and
            transparent tracking.
          </p>
        </div>
      </div>
    </div>
  );
}
