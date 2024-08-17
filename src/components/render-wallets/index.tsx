import { KeyPair } from "../home";
import { formatPublicKey } from "@/utils";
import { IconCopy, IconEye, IconCheck, IconWallet } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Toast from "../toast";

export default function RenderWallets({
  keyPairs,
  type,
}: {
  keyPairs: KeyPair[];
  type: string;
}) {
  if (keyPairs.length > 0) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-4 w-full">
        {keyPairs.map((keyPair, index) => (
          <WalletCard key={index} keyPair={keyPair} index={index} type={type} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="text-gray-400/60 text-lg items-center font-Inter font-medium tracking-wide flex-1 flex flex-col justify-center animate-fadeIn">
        <div> Add New Wallet</div>
      </div>
    );
  }
}

function WalletCard({
  keyPair,
  index,
  type,
}: {
  keyPair: KeyPair;
  index: number;
  type: string;
}) {
  const [copy, setCopy] = useState("");
  const [view, setView] = useState("");
  const [solval, setSolval] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyPublicKey = (publicKey: string) => {
    navigator.clipboard.writeText(publicKey);
    setCopy(publicKey);

    let timer = setTimeout(() => {
      setCopy("");
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  };

  const viewPrivateKey = (privateKey: string) => {
    setView(privateKey);

    let timer = setTimeout(() => {
      setView("");
    }, 6500);

    return () => {
      clearTimeout(timer);
    };
  };

  const fetchBalance = async (publicKey: string, walletType: string) => {
    setLoading(true);
    setError(null);
    setSolval(null);

    try {
      const wallet =
        walletType === "Solana"
          ? "sol"
          : walletType === "Ethereum"
          ? "eth"
          : undefined;
      const response = await fetch(`/api/${wallet}-balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey,
          type: "devnet",
        }),
      });

      if (!response.ok) {
        Toast({ type: "Error", message: "Failed to fetch balance." });
        throw new Error("Failed to fetch balance.");
      }

      const data = await response.json();
      console.log("Data:", data);

      setSolval(data.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      Toast({ type: "Error", message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance(keyPair.publicKey!, type);
  }, [type]);

  return (
    <div
      key={index}
      className="border-2 min-h-48 border-blue-2 text-deep-black w-full font-Inter items-center font-medium text-sm rounded-md py-3 px-4 animate-fadeIn"
    >
      <div className="flex flex-row text-gray-500/70 justify-center items-center">
        <IconWallet size={24} />
        <div className="text-lg md:text-lg font-medium mr-2 font-Inter ">
          Wallet #{keyPair.id}
        </div>
      </div>

      <div className="flex flex-col mt-1">
        <div className="flex flex-row text-sm items-center gap-x-2 font-semibold">
          <h2>Public Key: {formatPublicKey(keyPair.publicKey!, 4)}</h2>
          {copy === keyPair.publicKey ? (
            <div className="flex flex-row justify-center items-center gap-x-1 text-light-green">
              <IconCheck size={18} />
            </div>
          ) : (
            <button
              onClick={() => copyPublicKey(keyPair.publicKey!)}
              className="flex flex-row justify-center items-center gap-x-1 text-gray-1"
            >
              <IconCopy size={18} />
            </button>
          )}
        </div>

        <div className="flex flex-col w-full gap-x-2 font-semibold">
          <div className="flex flex-row text-sm">
            <p className="text-gray-1 font-medium font-Inter">
              Private Key: &#160;
            </p>
            {view != keyPair.encodedPrivateKey ? (
              <div className="flex flex-row">
                <p className="text-gray-1 font-medium font-Inter">
                  {formatPublicKey(keyPair.encodedPrivateKey!, 3)}
                </p>
                <button
                  onClick={() => viewPrivateKey(keyPair.encodedPrivateKey!)}
                  className="flex flex-row justify-center items-center ml-2 text-gray-1"
                >
                  <IconEye size={18} />
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {view === keyPair.encodedPrivateKey ? (
            <p className="w-full break-all text-sm overflow-wrap break-word">
              {keyPair.encodedPrivateKey}
            </p>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center h-1/2">
        {!loading ? (
          (solval && !view) && (
            <h2 className="text-lg font-Inter font-semibold text-blue-1">
              {solval} {` ${type === "Solana" ? "SOL" : "ETH"}`}
            </h2>
          )
        ) : (
          <div className="">
            <div className="animate-pulse flex space-x-4">
              <div className=" bg-slate-500/40 h-7 w-14 rounded-lg"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
