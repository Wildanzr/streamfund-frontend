import Image from "next/image";
// import WalletButton from "../shared/WalletButton";
import Link from "next/link";
import { ConnectButton } from "@particle-network/connectkit";

const Header = () => {
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center z-10 p-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image src="/icons/live.svg" width={50} height={50} alt="StreamFund" />
        <span className="font-protest tracking-wider text-3xl font-bold text-white hidden sm:flex">
          StreamFund
        </span>
      </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            {/* <WalletButton /> */}
            <ConnectButton />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
