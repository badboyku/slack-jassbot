import CryptoJS from 'crypto-js';
import { config } from '@utils';

const createHmac = (text: string): string => {
  const {
    crypto: { key },
  } = config;

  return CryptoJS.HmacMD5(text, key).toString();
};

const decrypt = (text: string): string => {
  const {
    crypto: { key },
  } = config;

  return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
};

const encrypt = (text: string): string => {
  const {
    crypto: { key },
  } = config;

  return CryptoJS.AES.encrypt(text, key).toString();
};

export default { createHmac, decrypt, encrypt };
