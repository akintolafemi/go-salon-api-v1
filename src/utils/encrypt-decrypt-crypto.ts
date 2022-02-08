import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const iv = randomBytes(16);
const password = `${process.env.JWT_SECRET}`;
const length = 32;

export const encryptStr = async (str: string) => {
  const key = await promisify(scrypt)(password, 'salt', length) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  return Buffer.concat([
    cipher.update(str),
    cipher.final(),
  ]);
}

export const decryptStr = async (encryptedStr: any) => {
  const key = await promisify(scrypt)(password, 'salt', length) as Buffer;
  
  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  return Buffer.concat([
    decipher.update(encryptedStr),
    decipher.final(),
  ]);
}
