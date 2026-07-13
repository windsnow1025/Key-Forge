import {sha256Hex} from "./Hash";

const SecretKeyVerifierStorage = "secretKeyVerifier";
const SaltByteLength = 16;

type SecretKeyVerifier = {
  salt: string;
  verifier: string;
};

export function hasSecretKeyVerifier() {
  return readSecretKeyVerifier() !== null;
}

export async function saveSecretKeyVerifier(secretKey: number) {
  const salt = generateSalt();
  const payload: SecretKeyVerifier = {
    salt,
    verifier: await computeSecretKeyVerifier(secretKey, salt),
  };
  localStorage.setItem(SecretKeyVerifierStorage, JSON.stringify(payload));
}

export async function verifySecretKey(secretKey: number) {
  const payload = readSecretKeyVerifier();
  if (!payload) {
    return false;
  }
  return (await computeSecretKeyVerifier(secretKey, payload.salt)) === payload.verifier;
}

function readSecretKeyVerifier(): SecretKeyVerifier | null {
  const storedValue = localStorage.getItem(SecretKeyVerifierStorage);
  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Partial<SecretKeyVerifier>;
    if (
      typeof parsedValue.salt !== "string" ||
      typeof parsedValue.verifier !== "string"
    ) {
      return null;
    }
    return parsedValue as SecretKeyVerifier;
  } catch {
    return null;
  }
}

function computeSecretKeyVerifier(secretKey: number, salt: string) {
  const verifierInput = `${salt}:${secretKey}`;
  return sha256Hex(verifierInput);
}

function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(SaltByteLength)).toHex();
}
