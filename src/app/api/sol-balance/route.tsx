import {NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from "@solana/web3.js";

type ResponceData = {
    lamports: string;
    value: string;
}

const solana_main = process.env.SOLANA_RPC_MAIN_URL;
const solana_dev = process.env.SOLANA_RPC_DEV_URL;

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const url = data.type === "mainnet" ? solana_main : data.type === "devnet" ? solana_dev : "";
        const publicKey = data.publicKey;
        const connection = new Connection(url!);
        const key = new PublicKey(publicKey);
        const balance = await connection.getBalance(key);

        const lamports = balance.toString();
        const sol = (balance / 1e9).toFixed(5).toString();

        const resdata: ResponceData = {
            lamports,
            value: sol,
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