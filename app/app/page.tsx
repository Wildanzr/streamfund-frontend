import Header from "@/components/layout/header";
import ParticleBg from "@/components/layout/particle";
import { ManagementPlatformComponent } from "@/components/management-platform";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StreamFund | App",
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
    siteName: "StreamFund | App",
    title: "StreamFund | App",
    description:
      "StreamFund is a Web3-based donation platform that enables streamers to receive cryptocurrency support directly from their audience. With StreamFund, streamers can monetize their content effortlessly while fans contribute using crypto, enjoying lower fees and instant transactions. Our platform enhances viewer engagement through interactive perks and provides transparent, secure donation tracking powered by blockchain technology.",
  },
};

export default function Home() {
  return (
    <div className="flex relative flex-col items-start justify-start w-full h-full min-h-screen">
      <Header />
      <div className="absolute inset-0 bg-woman bg-top bg-fixed bg-cover bg-no-repeat blur-lg z-0 brightness-50 " />
      <ParticleBg />
      <div className="flex flex-col space-y-10 items-center justify-start w-full h-full z-10 pt-10">
        <ManagementPlatformComponent />
      </div>
    </div>
  );
}