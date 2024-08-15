"use client";
import { useState } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import Toast from "../toast";

export default function MnemonicGrid({
  mnemonic,
}: {
  mnemonic: string | undefined;
}) {
  const [copy, setCopy] = useState(false);

  const copyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic!);
    setCopy(true);
    Toast ({message: "Save your mnemonic safely", type: "Mnemonic Copied"});

    let timer = setTimeout(() => {
      setCopy(false);
    }, 2200);

    return () => {
      clearTimeout(timer);
    };
  };

  if (!mnemonic) {
    return (
      <h2 className="text-gray-400/60 text-lg font-Inter font-medium tracking-wide">
        First Generate Mnemonic
      </h2>
    );
  } else {
    return (
      <div className="w-full">
        <div className="grid grid-cols-4 gap-4">
          {mnemonic.split(" ").map((word, index) => (
            <div
              key={index}
              className="bg-blue-3 text-blue-1 font-Inter font-medium text-lg rounded-md p-2 flex justify-center items-center"
            >
              <h2>{word}</h2>
            </div>
          ))}
        </div>
        <div className="flex flex-row-reverse mt-2">
          {copy ? (
            <div className="flex flex-row justify-center items-center gap-x-1 text-light-green">
              <IconCheck size={18} />
              <h2 className="text-sm font-inter font-medium">Copied</h2>
            </div>
          ) : (
            <button
              onClick={copyMnemonic}
              className="flex flex-row justify-center items-center gap-x-1 text-gray-1"
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
