"use client";

import Image from "next/image";
// import WalletButton from "../shared/WalletButton";
import Link from "next/link";
import { useEffect, useState } from "react";
import ConnectWallet from "../shared/ConnectWallet";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      className={`w-full fixed top-0 z-20 bg-transparent ${
        isScrolled &&
        "bg-white/10 ease-in-out duration-1000 shadow-lg backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 py-6 flex justify-between items-center p-10">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/icons/live.svg"
            height={0}
            width={0}
            alt="StreamFund"
            style={{ width: "50px", height: "auto" }}
          />
          <span className="font-protest tracking-wider text-3xl font-bold text-white hidden sm:flex">
            StreamFund
          </span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <ConnectWallet />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
