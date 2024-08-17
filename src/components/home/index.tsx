"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IconCurrencySolana,
  IconCurrencyEthereum,
  IconBrandGithub,
  IconX,
} from "@tabler/icons-react";
import EthImage from "../../../public/eth.png";
import SolImage from "../../../public/sol.png";
import {
  generateMnemonicAndSeed,
  getDerivedSeed,
  generateKeypair,
  getPublicKeyFromPrivateKey,
  formatPublicKey,
  generateEthereumWallet,
  generateAndSyncSeed,
} from "@/utils";
import MnemonicGrid from "../mnemonic-grid";
import RenderWallets from "../render-wallets";
import Toast from "../toast";
import Link from "next/link";
import WalletBalance from "../balance";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMnemonic, setInputMnemonic] = useState("");
  const [initLoad, setInitLoad] = useState<boolean>(true);

  useEffect(() => {
    // Load from local storage
    const seed = window.localStorage.getItem("seed");
    const keyPair = window.localStorage.getItem("keyPair");
    const ethWallet = window.localStorage.getItem("ethWallet");
    const count = window.localStorage.getItem("count");

    if (seed) {
      setSeed(JSON.parse(seed));
    }
    if (keyPair) {
      setKeyPair(JSON.parse(keyPair));
    }
    if (ethWallet) {
      setEthWallet(JSON.parse(ethWallet));
    }
    if (count) {
      setCount(parseInt(count));
    }
    setInitLoad(false);
  }, []);

  const isWalletAddDisabled = () => {
    if (seed.seed === undefined) {
      return true;
    } else return false;
  };

  const handleManualMnemonic = () => {
    if (!inputMnemonic || inputMnemonic.trim().split(" ").length !== 12) {
      Toast({ message: "Invalid Mnemonic", type: "Error" });
      return;
    }
    const { seed } = generateAndSyncSeed(inputMnemonic.trim());
    setSeed({ mnemonic: inputMnemonic, seed });
    window.localStorage.setItem(
      "seed",
      JSON.stringify({ mnemonic: inputMnemonic, seed })
    );
    Toast({ message: "Mnemonic Added", type: "Success", check: true });
    setIsModalOpen(false);
  };

  const addNewMnemonic = () => {
    const { mnemonic, seed } = generateMnemonicAndSeed();
    console.log("Generated Mnemonic:", mnemonic);
    setSeed({
      mnemonic,
      seed,
    });
    // save to local storage
    window.localStorage.setItem("seed", JSON.stringify({ mnemonic, seed }));
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
    const i = count;
    const path = `m/44'/${coin_type}'/${i}'/0'`;
    const derivedSeed = getDerivedSeed({
      seed: seed.seed!.toString("hex"),
      path,
    });

    if (coin === "Solana") {
      const { publicKey, encodedPrivateKey } = generateKeypair(derivedSeed);
      const newData = [...keyPair, { publicKey, encodedPrivateKey, id: i }];
      setKeyPair(newData);
      window.localStorage.setItem("keyPair", JSON.stringify(newData));
      Toast({
        message: "New Wallet Generated",
        type: "SOL: " + formatPublicKey(publicKey, 5),
      });
      setCount((prev) => {
        window.localStorage.setItem("count", (prev + 1).toString());
        return prev + 1;
      });
    }

    if (coin === "Ethereum") {
      const myseed = generateAndSyncSeed(seed.mnemonic!);
      const { publicKey, privateKey } = generateEthereumWallet(
        myseed.seed!,
        path
      );
      const newData = [
        ...ethWallet,
        { publicKey, encodedPrivateKey: privateKey, id: i },
      ];
      setEthWallet(newData);
      window.localStorage.setItem("ethWallet", JSON.stringify(newData));
      Toast({
        message: "New Wallet Generated",
        type: "ETH: " + formatPublicKey(publicKey, 5),
      });
      setCount((prev) => {
        window.localStorage.setItem("count", (prev + 1).toString());
        return prev + 1;
      });
    }
  };

  const deleteall = () => {
    setSeed({});
    setKeyPair([]);
    setEthWallet([]);
    setCount(0);
    window.localStorage.removeItem("seed");
    window.localStorage.removeItem("keyPair");
    window.localStorage.removeItem("ethWallet");
    window.localStorage.removeItem("count");
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
    <main className="flex min-h-screen flex-col items-center px-8 py-6 pb-10 bg-blue-3">
      <div className="w-full mb-4">
        <div className="font-Inter text-blue-1 text-3xl font-medium md:px-16">
          Safe Wallet
        </div>
        <div className="font-Inter font-medium text-base text-gray-500/50 md:px-16 tracking-wide">
          Generate with ease
        </div>
      </div>

      <div className="bg-light-white shadow-md w-full md:w-3/5 h-56 rounded-lg mb-4 flex flex-col justify-center items-center px-6 pt-4 pb-2">
        <MnemonicGrid
          mnemonic={seed.mnemonic}
          btnfunc={() => {
            setIsModalOpen(true);
          }}
        />
      </div>
      <div className="w-full md:w-3/5 flex flex-row-reverse"></div>

      <div className="w-full md:w-3/5 mt-8 md:mt-4">
        <div className="flex flex-col gap-y-4 md:gap-y-0 md:flex-row flex-1 justify-between items-center">
          <div className=" flex flex-row bg-blue-2 rounded-md rounded-tr-2xl text-blue-1 py-2 pl-2 pr-7">
            <RenderButtons />
          </div>
          <div className="flex-1 flex flex-row-reverse">
            { !isWalletAddDisabled() && <button
              onClick={deleteall}
              className={`py-2 px-4 font-Inter font-medium rounded-md text-lg  bg-light-red text-light-white`}
            >
              Delete All
            </button>}
          </div>
        </div>
      </div>

      <div className="bg-light-white shadow-md w-full md:w-3/5 h-96 rounded-lg mb-4 mt-4 flex flex-col md:flex-row justify-center items-center">
        <div className="w-full md:w-2/3 h-96 flex flex-col py-2 px-3 max-h-96 overflow-y-auto rounded-l-lg scroll-smooth [scrollbar-width:]">
          <RenderWallets keyPairs={coin === "Solana" ? keyPair : ethWallet} />
        </div>
        <div className="w-1/3 h-2/5 md:h-full flex flex-col justify-center items-center md:border-l-2">
          <div className="pt-4 flex flex-row gap-x-2">
            <RenderEthSol />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <button
              onClick={addNewWallet}
              className={`${
                isWalletAddDisabled() ? "bg-gray-300" : "bg-blue-1"
              } py-2 px-4 text-light-white font-Inter text-sm font-medium rounded-md md:text-sm lg:text-sm transition-colors duration-500 ease-in-out`}
            >
              Add New Wallet
            </button>
          </div>
        </div>
      </div>

      <div className="bg-light-white shadow-md w-full md:w-3/5 rounded-lg mb-4 flex flex-col md:flex-row justify-center items-center mt-16">
        <WalletBalance />
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-lg shadow-md w-full md:w-3/5 mx-auto my-6">
        <h2 className="text-lg text-blue-1 font-semibold mb-2">Note:</h2>
        <p className="leading-relaxed">
          To test the balance functionality, you can transfer some Devnet SOL or
          Sepolia ETH to your generated wallets. Alternatively, use the mnemonic
          phrase provided below to generate four Solana wallets and four
          Ethereum wallets. Since the wallets are derived from the same seed and
          path, they will already contain some Devnet tokens that I have
          transferred for testing purposes.
        </p>
        <p className="font-mono bg-blue-100 border border-blue-300 text-blue-800 p-3 mt-4 rounded-md">
          Mnemonic: gravity jeans exhibit exist unusual kiss east hamster merit
          stand opera river
        </p>
        <p className="mt-4">
          You can explore the balances of these wallets directly after
          generating them!
        </p>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white pt-2 pb-6 px-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex flex-col justify-end items-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className=" text-black underline"
              >
                <IconX size={24} />
              </button>
            </div>
            <h2 className="text-2xl font-semibold mb-4">
              Enter or Generate Mnemonic
            </h2>
            <textarea
              value={inputMnemonic}
              onChange={(e) => setInputMnemonic(e.target.value)}
              placeholder="Enter 12-word mnemonic"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows={3}
            />
            <div className="flex justify-between">
              <button
                onClick={() => {
                  handleManualMnemonic();
                  setIsModalOpen(false);
                }}
                className="bg-blue-1 font-Inter py-2 px-4 text-white rounded-md"
              >
                Add Mnemonic
              </button>
              <button
                onClick={() => {
                  addNewMnemonic();
                  setIsModalOpen(false);
                }}
                className="bg-light-green font-Inter py-2 px-4 text-white rounded-md"
              >
                Generate Mnemonic
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row z-10 gap-x-3 mt-20 font-Inter font-medium">
        <h2 className="text-gray-400 font-semibold">100xdevs</h2>
        <h2 className="text-gray-700/70">•</h2>
        <div className="flex flex-row gap-x-1">
          <h2 className="text-black/75">@asutosh</h2>
          <Link href={"https://github.com/asutoshranjan"}>
            <IconBrandGithub size={22} className="text-black/75" />
          </Link>
        </div>
      </div>
      {initLoad && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
        </div>
      )}
    </main>
  );
}
