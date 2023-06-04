import CryptoJS from 'crypto-js';
import { config } from '@utils';

const createHmac = (text: string): string => {
  return CryptoJS.HmacMD5(text, config.crypto.key).toString();
};

const decrypt = (text: string): string => {
  return CryptoJS.AES.decrypt(text, config.crypto.key).toString(CryptoJS.enc.Utf8);
};

const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, config.crypto.key).toString();
};

export default { createHmac, decrypt, encrypt };
