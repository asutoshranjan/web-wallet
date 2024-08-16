"use client";
import { useState, useEffect, useRef } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import Toast from "../toast";

export default function MnemonicGrid({
  mnemonic,
  btnfunc,
}: {
  mnemonic: string | undefined;
  btnfunc: () => void;
}) {
  const [copy, setCopy] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const copyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic!);
    setCopy(true);
    Toast({
      message: "Save your mnemonic safely",
      type: "Mnemonic Copied",
      check: true,
    });

    let timer = setTimeout(() => {
      setCopy(false);
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  };

  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [mnemonic]);

  if (!mnemonic) {
    return (
      <div className="text-gray-400/60 text-lg font-Inter font-medium tracking-wide animate-fadeIn">
        <button
          onClick={btnfunc}
          className="bg-blue-1 py-2 px-4 text-light-white font-Inter font-medium rounded-md text-base md:text-lg"
        >
          Add New Mnemonic
        </button>
      </div>
    );
  } else {
    return (
      <div className="w-full animate-fadeIn">
        <div
          ref={gridRef}
          key={animationKey} // Trigger re-render on animationKey change
          className="grid grid-cols-4 gap-4"
        >
          {mnemonic.split(" ").map((word, index) => (
            <div
              key={index}
              className="bg-blue-3 text-blue-1 font-Inter font-medium text-lg rounded-md p-2 flex justify-center items-center"
              style={{
                animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s forwards`,
              }}
            >
              <h2>{word}</h2>
            </div>
          ))}
        </div>
        <div className="flex flex-row-reverse mt-2">
          {copy ? (
            <div
              className="flex flex-row justify-center items-center gap-x-1 text-light-green"
              style={{ animation: "fadeIn 0.5s ease-in-out 0.5s forwards" }}
            >
              <IconCheck size={18} />
              <h2 className="text-sm font-inter font-medium">Copied</h2>
            </div>
          ) : (
            <button
              onClick={copyMnemonic}
              className="flex flex-row justify-center items-center gap-x-1 text-gray-1 animate-fadeIn"
            >
              <IconCopy size={18} />
              <h2 className="text-sm font-Inter">Copy Mnemonic</h2>
            </button>
          )}
        </div>
      </div>
    );
  }
}
