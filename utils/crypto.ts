/**
 * This function imports the user's password as a CryptoKey
 * The returned key will be used to derive the user's master key
 *
 * @param password
 * @returns {Promise<CryptoKey>}
 */
async function _getKeyMaterial(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
}

/**
 * This function derives a key from a password and salt
 * The returned key will be the user's master key
 *
 * @param keyMaterial - generated from getKeyMaterial()
 * @param salt - use Crypto.getRandomValues() to generate a salt
 * @returns {Promise<CryptoKey>}
 */
async function _getKey(
  keyMaterial: CryptoKey,
  salt: ArrayBuffer
): Promise<CryptoKey> {
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function generateMasterKeyFromPassword(
  password: string,
  predefinedBase64Salt?: string
): Promise<{
  key: string;
  salt: string;
}> {
  const keyMaterial = await _getKeyMaterial(password);

  // if predefined salt is not provided, generate a random salt
  // else convert base64 to Uint8Array from salt
  const salt = predefinedBase64Salt
    ? base64decode(predefinedBase64Salt)
    : window.crypto.getRandomValues(new Uint8Array(16));
  const key = await _getKey(keyMaterial, salt);

  // In this format the key is supplied as an ArrayBuffer containing the raw bytes for the key.
  const exported = await window.crypto.subtle.exportKey("raw", key);

  // Convert the ArrayBuffer to a base64 string.
  const keyString = base64encode(exported);

  // Convert the salt to a base64 string.
  const saltString = base64encode(salt);

  return {
    key: keyString,
    salt: saltString,
  };
}

// Modified from https://github.com/niklasvh/base64-arraybuffer/blob/master/src/index.ts
const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Use a lookup table to find the index.
const lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

export const base64encode = (arraybuffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(arraybuffer);
  let i;
  const len = bytes.length;
  let base64 = "";

  for (i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += chars[bytes[i + 2] & 63];
  }

  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + "==";
  }

  return base64;
};

export const base64decode = (base64: string): ArrayBuffer => {
  let bufferLength = base64.length * 0.75;
  const len = base64.length;
  let i;
  let p = 0;
  let encoded1;
  let encoded2;
  let encoded3;
  let encoded4;

  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }

  const arraybuffer = new ArrayBuffer(bufferLength);
  const bytes = new Uint8Array(arraybuffer);

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arraybuffer;
};
