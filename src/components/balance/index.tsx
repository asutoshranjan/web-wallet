"use client";

import { useState } from "react";
import Toast from "../../components/toast";

export default function WalletBalance() {
  const [walletType, setWalletType] = useState<"solana" | "ethereum">("solana");
  const [publicKey, setPublicKey] = useState("");
  const [balanceInfo, setBalanceInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<"mainnet" | "devnet">("mainnet");

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    setBalanceInfo(null);

    try {
      const wallet =
        walletType === "solana"
          ? "sol"
          : walletType === "ethereum"
          ? "eth"
          : undefined;
      const response = await fetch(`/api/${wallet}-balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey,
          type: network,
        }),
      });

      if (!response.ok) {
        Toast({ type: "Error", message: "Failed to fetch balance." });
        throw new Error("Failed to fetch balance.");
      }

      const data = await response.json();
      console.log("Data:", data);

      setBalanceInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      Toast({ type: "Error", message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (publicKey) {
      fetchBalance();
    } else {
      setError("Please enter a valid public key.");
      Toast({ type: "Error", message: "Please enter a valid public key." });
    }
  };

  return (
    <div className="w-full">
      <div className="p-6 w-full relative flex flex-col md:flex-row">
        <div className="flex-1">
          <h1 className="text-2xl font-Inter font-semibold text-blue-1 mb-4">
            Wallet Balance
          </h1>

          <div className="mb-4">
            <div className="flex justify-between items-center">
              <label className="text-gray-600">Select Wallet:</label>
              <select
                value={walletType}
                onChange={(e) => {
                  setWalletType(e.target.value as "solana" | "ethereum");
                  setBalanceInfo(null);
                }}
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="solana">Solana</option>
                <option value="ethereum">Ethereum</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter public key"
              value={publicKey}
              onChange={(e) => {
                setPublicKey(e.target.value);
                setBalanceInfo(null);
              }}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {
              <div className="flex items-center gap-4">
                <label className="text-gray-600">Network:</label>
                <select
                  value={network}
                  onChange={(e) => {
                    setNetwork(e.target.value as "mainnet" | "devnet");
                    setBalanceInfo(null);
                  }}
                  className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mainnet">Mainnet</option>
                  <option value="devnet">Devnet</option>
                </select>
              </div>
            }

            <button
              type="submit"
              className="w-full bg-blue-1 text-white font-Inter font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-500 ease-in-out"
            >
              {loading ? "Fetching..." : "Get Balance"}
            </button>
          </form>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center">
          {balanceInfo !== null ? (
            <div className="bg-light-white shadow-md w-full md:w-3/5 rounded-lg mb-4 mt-4 flex flex-col justify-center">
              <div className="p-4">
                <h2 className="text-lg font-Inter font-medium text-deep-black">
                  {walletType === "solana" ? "SOL" : "ETH"} Balance
                </h2>
                <h2 className="text-2xl font-Inter font-semibold text-blue-1">
                  {balanceInfo.value}
                </h2>
              </div>
            </div>
          ) : loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-1"></div>
          ) : (
            <div className="font-medium font-Inter text-gray-500">
              Submit to view your balance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
