import Home from "@/components/dashboard/Home";
import WalletButton from "@/components/shared/WalletButton";
import { Zap } from "lucide-react";
import React from "react";

const AppPage = () => {
  return (
    <div className="flex w-full h-full min-h-screen bg-gray-800">
      <div className="flex flex-col space-y-5 w-full h-full container mx-auto items-center justify-center">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              StreamChain
            </span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <WalletButton />
              </li>
            </ul>
          </nav>
        </header>

        <Home />
      </div>
    </div>
  );
};

export default AppPage;
