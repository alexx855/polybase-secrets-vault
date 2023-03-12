import { Polybase } from "@polybase/client";
import { aescbc, decodeFromString, encodeToString, EncryptedDataAesCbc256 } from '@polybase/util'

export const db = new Polybase({
  defaultNamespace: "pk/0x5009d7afd855f3308a193071d5116d464467ce51c010d7d9454a19830bcc62c3723a899fd70d6c4185667acd7ceb8231fdc743ed740fc84b6006c79440e8f0f1/polytest-url-shorter",
});

export const urlsCollectionRef = db.collection<{
  id: string;
  nonce: string;
  ciphertext: string;
}>("Urls");

// This returns symmetric key as Uint8Array
export const generateSecretKey = () => aescbc.generateSecretKey()

export async function symmmetricEncryptString(key: Uint8Array, str: string,): Promise<EncryptedDataAesCbc256> {
  // Convert string value to Uint8Array so it can be encrypted
  const strDataToBeEncrypted = decodeFromString(str, 'utf8')

  // Encrypt the data, as EncryptedDataAesCbc256
  const encryptedData = await aescbc.symmetricEncrypt(key, strDataToBeEncrypted)

  // Store this data for later access
  return {
    version: encryptedData.version, // aes-cbc-256/symmetric
    nonce: encryptedData.nonce, // Uint8array
    ciphertext: encryptedData.ciphertext, // Uint8array
  }
}

export async function symmetricDecryptString(key: Uint8Array, encryptedData: EncryptedDataAesCbc256): Promise<string> {
  // Decrypt the data (as EncryptedDataAesCbc256)
  const strData = await aescbc.symmetricDecrypt(key, encryptedData)

  // Convert back from Uint8Array to string
  const str = encodeToString(strData, 'utf8')

  return str
}