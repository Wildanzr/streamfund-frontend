"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Zap, Shield, Coins, Bitcoin } from "lucide-react";
import Link from "next/link";
import WalletButton from "./shared/WalletButton";

export function LandingPageComponent() {
  const [donationAmount, setDonationAmount] = useState("5");
  const [isStreaming, setIsStreaming] = useState(false);
  interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
  }

  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const streamingInterval = setInterval(() => {
      setIsStreaming((prev) => !prev);
    }, 5000);

    return () => clearInterval(streamingInterval);
  }, []);

  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 5 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
        });
      }
      setParticles(newParticles);
    };

    createParticles();

    const animateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x:
            (particle.x + particle.speedX + window.innerWidth) %
            window.innerWidth,
          y:
            (particle.y + particle.speedY + window.innerHeight) %
            window.innerHeight,
        }))
      );
    };

    const animationInterval = setInterval(animateParticles, 50);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-blue-500 opacity-20"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
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
                <Link
                  href="/app"
                  className="hover:text-purple-500 transition-colors"
                >
                  APP
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <section className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              Stream, Earn, and Connect — The Future of Support for Content
              Creators is Here!
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Monetize your stream effortlessly with Web3 donations and build a
              loyal community.
            </p>
            <div className="flex flex-col items-center justify-center w-full h-full">
              <WalletButton />
            </div>
          </section>

          <section className="container mx-auto px-4 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Empower Your Content, Engage Your Audience
                </h2>
                <p className="text-gray-300 mb-6">
                  Your viewers are more than just fans; they&apos;re your
                  biggest supporters! Our platform makes it easy for them to
                  donate and interact with you in real-time while you enjoy
                  instant payouts and transparent tracking — all powered by
                  blockchain technology.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-green-500" />
                    <span>Secure blockchain transactions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Loader2 className="w-6 h-6 text-blue-500" />
                    <span>Real-time interactions and alerts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Coins className="w-6 h-6 text-yellow-500" />
                    <span>Instant crypto payouts</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg border border-purple-500">
                <h3 className="text-2xl font-bold mb-4">
                  Live Donation Simulator
                </h3>
                <div className="mb-4">
                  <Input
                    type="number"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full bg-gray-700 text-white"
                    placeholder="Enter donation amount"
                  />
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>
                    alert(`Simulated donation of $${donationAmount} sent!`)
                  }
                >
                  Send Donation
                </Button>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400 mb-2">
                    Live Stream Simulation
                  </p>
                  <div className="flex justify-center items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isStreaming ? "bg-red-500" : "bg-gray-500"
                      }`}
                    ></div>
                    <span>{isStreaming ? "Streaming" : "Offline"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Supported Cryptocurrencies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg">
                <Bitcoin className="w-16 h-16 text-yellow-500 mb-4" />
                <span className="text-lg font-semibold">Bitcoin</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg">
                <Bitcoin className="w-16 h-16 text-blue-500 mb-4" />
                <span className="text-lg font-semibold">Ethereum</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg">
                <Coins className="w-16 h-16 text-green-500 mb-4" />
                <span className="text-lg font-semibold">USDC</span>
              </div>
              <div className="flex flex-col items-center p-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg">
                <Coins className="w-16 h-16 text-purple-500 mb-4" />
                <span className="text-lg font-semibold">Custom Tokens</span>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-bold mb-4">About</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Team
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Guides
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      API Docs
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Discord
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
              <p>&copy; 2024 StreamChain. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
