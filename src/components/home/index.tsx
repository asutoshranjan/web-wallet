"use client";

import Image from "next/image";
import { useState } from "react";
import { IconCurrencySolana, IconCurrencyEthereum } from "@tabler/icons-react";
import EthImage from "../../../public/eth.png";
import SolImage from "../../../public/sol.png";
import {
  generateMnemonicAndSeed,
  getDerivedSeed,
  generateKeypair,
  getPublicKeyFromPrivateKey,
  formatPublicKey,
  generateEthereumWallet,
} from "@/utils";
import MnemonicGrid from "../mnemonic-grid";
import RenderWallets from "../render-wallets";
import Toast from "../toast";

interface Seed {
  mnemonic?: string;
  seed?: Buffer;
}

export interface KeyPair {
  publicKey?: string;
  encodedPrivateKey?: string;
  id?: number;
}

export default function Home() {
  const [coin, setCoin] = useState("Solana");
  const [count, setCount] = useState(0);
  const [seed, setSeed] = useState<Seed>({});
  const [keyPair, setKeyPair] = useState<KeyPair[]>([]);
  const [ethWallet, setEthWallet] = useState<KeyPair[]>([]);

  const isWalletAddDisabled = () => {
    if (seed.seed === undefined) {
      return true;
    } else return false;
  };

  const addNewMnemonic = () => {
    const { mnemonic, seed } = generateMnemonicAndSeed();
    console.log("Generated Mnemonic:", mnemonic);
    setSeed({
      mnemonic,
      seed,
    });
    Toast({
      message: "You can generate a wallet now",
      type: "New Mnemonic Generated",
    });
  };

  const addNewWallet = () => {
    if (seed.seed === undefined) {
      Toast({ message: "Generate Mnemonic First", type: "Error" });
      return;
    }

    const coin_type =
      coin === "Solana" ? 501 : coin === "Ethereum" ? 60 : undefined;
    // const coin_type = 501
    const i = count;
    const path = `m/44'/${coin_type}'/${i}'/0'`;
    const derivedSeed = getDerivedSeed({
      seed: seed.seed!.toString("hex"),
      path,
    });

    if (coin === "Solana") {
      const { publicKey, encodedPrivateKey } = generateKeypair(derivedSeed);
      setKeyPair([...keyPair, { publicKey, encodedPrivateKey, id: i }]);
      Toast({
        message: "New Wallet Generated",
        type: "SOL: " + formatPublicKey(publicKey, 5),
      });
      setCount((prev) => prev + 1);
    }

    if (coin === "Ethereum") {
      const { publicKey, privateKey } = generateEthereumWallet(
        derivedSeed,
        path
      );
      setEthWallet([
        ...ethWallet,
        { publicKey, encodedPrivateKey: privateKey, id: i },
      ]);
      Toast({
        message: "New Wallet Generated",
        type: "ETH: " + formatPublicKey(publicKey, 5),
      });
      setCount((prev) => prev + 1);
    }
  };

  function RenderButtons() {
    return (
      <div className="flex flex-row gap-x-2">
        <button
          onClick={() => setCoin("Solana")}
          className={`py-2 px-4 font-Inter font-medium rounded-md text-lg ${
            coin === "Solana" ? "bg-blue-1 text-light-white" : ""
          }`}
        >
          <div className="flex flex-row items-center gap-x-1">
            <IconCurrencySolana size={21} />
            <div>Solana</div>
          </div>
        </button>
        <button
          onClick={() => setCoin("Ethereum")}
          className={`py-2 px-4 font-Inter font-medium rounded-md text-lg ${
            coin === "Ethereum" ? "bg-blue-1 text-light-white" : ""
          }`}
        >
          <div className="flex flex-row items-center gap-x-0">
            <IconCurrencyEthereum size={21} />
            <div>Ethereum</div>
          </div>
        </button>
      </div>
    );
  }

  function RenderEthSol() {
    if (coin === "Solana") {
      return (
        <div className="flex flex-row gap-x-1">
          <Image src={SolImage} alt="Solana" width={30} height={20} />
          <div className="text-xl text-gray-800/70 tracking-normal font-semibold">
            Solana
          </div>
        </div>
      );
    }
    if (coin === "Ethereum") {
      return (
        <div className="flex flex-row gap-x-1">
          <Image src={EthImage} alt="Ethirium" width={30} height={20} />
          <div className="text-xl text-gray-800/70 tracking-normal font-semibold">
            Ethereum
          </div>
        </div>
      );
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-8 py-6 pb-14 bg-blue-3">
      <div className="w-full mb-4">
        <div className="font-Inter text-blue-1 text-3xl font-medium md:px-16">
          Safe Wallet
        </div>
        <div className="font-Inter font-medium text-base text-gray-500/50 md:px-16 tracking-wide">
          Generate with ease
        </div>
      </div>

      <div className="bg-light-white shadow-md w-full md:w-3/5 h-56 rounded-lg mb-4 flex flex-col justify-center items-center px-6 pt-4 pb-2">
        <MnemonicGrid mnemonic={seed.mnemonic} />
      </div>
      <div className="w-full md:w-3/5 flex flex-row-reverse">
        <button
          onClick={addNewMnemonic}
          className="bg-blue-1 py-2 px-4 text-light-white font-Inter font-medium rounded-md text-base md:text-lg"
        >
          Generate Mnemonic
        </button>
      </div>

      <div className="w-full md:w-3/5 mt-8 md:mt-4">
        <div className="flex flex-row">
          <div className=" flex flex-row bg-blue-2 rounded-md rounded-tr-2xl text-blue-1 py-2 pl-2 pr-7">
            <RenderButtons />
          </div>
        </div>
      </div>

      <div className="bg-light-white shadow-md w-full md:w-3/5 h-96 rounded-lg mb-4 mt-4 flex flex-col md:flex-row justify-center items-center">
        <div className="w-full md:w-2/3 h-96 flex flex-col py-2 px-3 max-h-96 overflow-y-auto rounded-l-lg scroll-smooth [scrollbar-width:]">
          <RenderWallets keyPairs={coin === "Solana" ? keyPair : ethWallet} />
        </div>
        <div className="w-1/3 h-full flex flex-col justify-center items-center md:border-l-2">
          <div className="pt-4 flex flex-row gap-x-2">
            <RenderEthSol />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <button
              onClick={addNewWallet}
              className={`${
                isWalletAddDisabled() ? "bg-gray-300" : "bg-blue-1"
              } py-2 px-4 text-light-white font-Inter text-sm font-medium rounded-md md:text-sm lg:text-sm`}
            >
              Add New Wallet
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
