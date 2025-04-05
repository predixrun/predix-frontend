import { HDKey } from 'ethereum-cryptography/hdkey';
import { sha256 } from 'ethereum-cryptography/sha256';
import * as bip39 from 'bip39';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

import { keccak256 } from 'ethereum-cryptography/keccak';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { Keypair } from '@solana/web3.js';
import { AptosAccount, derivePath } from 'aptos';
import bs58 from 'bs58';

// 고정된 엔트로피를 생성하여 니모닉을 생성
export async function generateMnemonicFromPrivateKey(
  privateKey: string,
): Promise<string> {
  const hash = sha256(new Uint8Array(Buffer.from(privateKey, 'hex')));
  const entropy = hash.slice(0, 16); // BIP39 엔트로피는 최소 128비트(16바이트) 필요
  const mnemonic = bip39.entropyToMnemonic(Buffer.from(entropy));
  return mnemonic;
}

// 니모닉을 사용하여 여러 개의 EVM 프라이빗 키 생성
export async function getEvmPrivateKeyFromMnemonic(
  mnemonic: string,
  userId: number,
): Promise<{ privateKey: string; publicKey: string }> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedAsUint8Array = new Uint8Array(seed);
  const hdKey = HDKey.fromMasterSeed(seedAsUint8Array);

  const derivedKey = hdKey.derive(`m/44'/60'/${userId}'/0/0`).privateKey;

  // 두번째 주소는`m/44'/60'/0'/0/1`
  if (derivedKey) {
    const privateKey = Buffer.from(derivedKey).toString('hex');
    const publicKey = secp256k1.getPublicKey(derivedKey, false).slice(1); // Get uncompressed public key and remove the 0x04 prefix
    const address = keccak256(publicKey).slice(-20);

    return {
      privateKey,
      publicKey: '0x' + Buffer.from(address).toString('hex'),
    };
  }

  return { privateKey: '', publicKey: '' };
}

// 니모닉을 사용하여 여러 개의 Solana 프라이빗 키 생성
export async function getOneSolanaPrivateKeysFromMnemonic(
  mnemonic: string,
  userId: number,
): Promise<{ privateKey: string; publicKey: string }> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedAsUint8Array = new Uint8Array(seed);
  const hdKey = HDKey.fromMasterSeed(seedAsUint8Array);

  const derivedKey = hdKey.derive(`m/44'/501'/${userId}'/0'`).privateKey;

  const derivedSeed = derivePath(
    `m/44'/501'/${userId}'/0'`,
    seed.toString('hex'),
  ).key;
  // 두번째 키는 m/44'/501'/1'/0'
  const keypair = Keypair.fromSeed(derivedSeed);

  const privateKey = bs58.encode(keypair.secretKey);
  const publicKey = keypair.publicKey.toBase58();
  return { privateKey, publicKey };
}

export async function getAptosPrivateKeyFromMnemonic(
  mnemonic: string,
): Promise<{ privateKey: string; publicKey: string; address: string }> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  // Convert mnemonic to seed
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Derive the key using the Aptos derivation path
  const derivedSeed = derivePath(
    `m/44'/637'/0'/0'/0'`,
    seed.toString('hex'),
  ).key;

  // Create an AptosAccount from the derived seed
  const aptosAccount = new AptosAccount(derivedSeed);

  // Encode the private and public keys
  const privateKey = aptosAccount.toPrivateKeyObject().privateKeyHex;
  const publicKey = aptosAccount.pubKey().hex();
  const address = aptosAccount.address().hex();

  return { privateKey, publicKey, address };
}

// 니모닉을 사용하여 0번째 Solana 주소 생성
export async function getSolanaAddressFromMnemonic(
  mnemonic: string,
): Promise<string> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const seedAsUint8Array = new Uint8Array(seed);
  const hdKey = HDKey.fromMasterSeed(seedAsUint8Array);
  const derivedKey = hdKey.derive(`m/44'/501'/0'/0'`).privateKey; // BIP-44 경로를 사용하여 첫 번째 주소 파생
  if (derivedKey) {
    const keypair = nacl.sign.keyPair.fromSeed(derivedKey.slice(0, 32));
    const publicKey = new PublicKey(keypair.publicKey).toBase58();
    return publicKey;
  }

  throw new Error('Failed to derive address from mnemonic');
}
