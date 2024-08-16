import { KeyPair } from "../home";
import { formatPublicKey } from "@/utils";
import { IconCopy, IconEye } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function RenderWallets({ keyPairs }: { keyPairs: KeyPair[] }) {
  if (keyPairs.length > 0) {
    return (
      <div>
        {keyPairs.map((keyPair, index) => (
          <WalletCard key={index} keyPair={keyPair} index={index} />
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

function WalletCard({ keyPair, index }: { keyPair: KeyPair; index: number }) {
  const [copy, setCopy] = useState("");
  const [view, setView] = useState("");

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

  return (
    <div
      key={index}
      className="border-2 flex flex-row border-blue-2 text-deep-black w-full font-Inter font-medium text-sm rounded-md py-3 px-4 mt-2 animate-fadeIn"
    >
      <div className="text-lg font-medium mr-2 font-Inter text-gray-500/50">
        #{keyPair.id}
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-x-2 font-semibold">
          <h2>Public Key: {formatPublicKey(keyPair.publicKey!, 9)}</h2>
          {copy === keyPair.publicKey ? (
            <h2 className="text-xs text-light-green font-Inter font-medium">
              Copied Key
            </h2>
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
          <div className="flex flex-row">
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
                  <IconEye size={16} />
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {view === keyPair.encodedPrivateKey ? (
            <p className="w-full break-all overflow-wrap break-word">
              {keyPair.encodedPrivateKey}
            </p>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
