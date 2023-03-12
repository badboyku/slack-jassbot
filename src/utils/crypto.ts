import CryptoJS from 'crypto-js';
import config from './config';

const {
  crypto: { key },
} = config;

const createHmac = (text: string): string => {
  return CryptoJS.HmacMD5(text, key).toString();
};

const decrypt = (text: string): string => {
  return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8);
};

const encrypt = (text: string): string => {
  return CryptoJS.AES.encrypt(text, key).toString();
};

export default { createHmac, decrypt, encrypt };
