import CryptoJS from 'crypto-js';
import { config, crypto } from '@utils';

jest.mock('@utils/config');

describe('utils crypto', () => {
  const cryptoKey = 'cryptoKey';
  const text = 'text';
  const expected = 'expected';
  config.crypto = { key: cryptoKey };
  let result: string;
  let toString: jest.Mock;

  describe('calling function createHmac', () => {
    beforeEach(() => {
      toString = jest.fn(() => expected);
      jest.spyOn(CryptoJS, 'HmacMD5').mockReturnValueOnce({ toString } as never);

      result = crypto.createHmac(text);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls CryptoJS.HmacMD5', () => {
      expect(CryptoJS.HmacMD5).toHaveBeenCalledWith(text, cryptoKey);
    });

    it('calls toString', () => {
      expect(toString).toHaveBeenCalled();
    });

    it('returns hmac string', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('calling function decrypt', () => {
    beforeEach(() => {
      toString = jest.fn(() => expected);
      jest.spyOn(CryptoJS.AES, 'decrypt').mockReturnValueOnce({ toString } as never);

      result = crypto.decrypt(text);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls CryptoJS.AES.decrypt', () => {
      expect(CryptoJS.AES.decrypt).toHaveBeenCalledWith(text, cryptoKey);
    });

    it('calls toString', () => {
      expect(toString).toHaveBeenCalledWith(CryptoJS.enc.Utf8);
    });

    it('returns decrypted string', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('calling function encrypt', () => {
    beforeEach(() => {
      toString = jest.fn(() => expected);
      jest.spyOn(CryptoJS.AES, 'encrypt').mockReturnValueOnce({ toString } as never);

      result = crypto.encrypt(text);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls CryptoJS.AES.encrypt', () => {
      expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(text, cryptoKey);
    });

    it('calls toString', () => {
      expect(toString).toHaveBeenCalled();
    });

    it('returns encrypted string', () => {
      expect(result).toEqual(expected);
    });
  });
});
