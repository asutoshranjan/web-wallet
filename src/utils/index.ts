import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { HDNodeWallet, Wallet } from "ethers";

// Generate new mnemonic and seed
export function generateMnemonicAndSeed() {
  const mnemonic = generateMnemonic();
  const seed = mnemonicToSeedSync(mnemonic);
  return { mnemonic, seed };
}

// Create derived seed from root seed or mnemonic
export function getDerivedSeed({ seed, path }: { seed: string; path: string }) {
  const derivedSeed = derivePath(path, seed).key;
  return derivedSeed;
}

// Generate public and private key pair from seed

export function generateKeypair(seed: Buffer) {
  //   const keypair = Keypair.fromSeed(seed);
  //   console.log("Public Key :", keypair.publicKey.toBase58());
  //   console.log("Private Key :", keypair.secretKey);

  const secret = nacl.sign.keyPair.fromSeed(seed).secretKey;
  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
  const encodedPrivateKey = bs58.encode(secret);
  
  return { secret, publicKey, encodedPrivateKey };
}


export function generateEthereumWallet(seed: Buffer, derivedPath: string) {
    const hdNode = HDNodeWallet.fromSeed(seed);
    const wallet = hdNode.derivePath(derivedPath);

    const publicKey = wallet.address;
    const privateKey = wallet.privateKey;

    return { publicKey, privateKey };

}

// Get public key from private key: SOL
export function getPublicKeyFromPrivateKey(privateKey: string) {
  const secret = bs58.decode(privateKey);
  const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
  
  console.log("My Public Key:", publicKey);
}

export function formatPublicKey(publickey: string, offset: number = 4) {
    let key = publickey.trim();
    return key.slice(0, offset) + "..." + key.slice(-offset);
}
