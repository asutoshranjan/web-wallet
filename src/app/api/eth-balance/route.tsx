import {NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from "@solana/web3.js";
import { formatEther } from 'ethers';

type ResponceData = {
    value: string;
}

const eth_main = process.env.ETH_RPC_MAIN_URL;
const eth_dev = process.env.ETH_SEPOLIA_RPC_URL;

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const url = data.type === "mainnet" ? eth_main : data.type === "devnet" ? eth_dev : "";
        const publicKey = data.publicKey;

        const response = await fetch(url!, {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: 1,
              jsonrpc: "2.0",
              method: "eth_getBalance",
              params: [
                publicKey, 
                "latest"
              ],
            }),
          });
    
          if (!response.ok) {
            return NextResponse.json({ message: "Error in fetching data via rpc" }, {status: 400});
          }
    
          const resultdata = await response.json();
          console.log("Data:", resultdata);
          const eth = formatEther(resultdata.result);

          const val = Number(eth).toFixed(5);

          console.log("ETH Balance:", eth, val);

        const resdata: ResponceData = {
            value: val,
        };

        console.log("Response Data:", resdata);

        if (req.method !== "POST") {
            return NextResponse.json({ message: "This Method Not Allowed" }, {status: 405});
        }
        return NextResponse.json(resdata, {status: 200});
    } catch (error) {
        console.log("Error occurred:",error);
        return NextResponse.json({ message: "Internal Server Error" }, {status: 500});
    }

}