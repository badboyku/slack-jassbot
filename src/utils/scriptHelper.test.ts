import process from 'node:process';
import { scriptHelper } from '@utils';
import type { GetFakedataPrefixResult } from '@types';

describe('utils scriptHelper', () => {
  const ENV_BACKUP = process.env;

  describe('calling function getFakedataPrefix', () => {
    const fakedataPrefix = 'foo';
    let result: GetFakedataPrefixResult;

    describe('successfully', () => {
      beforeEach(() => {
        process.env.FAKEDATA_PREFIX = fakedataPrefix;

        result = scriptHelper.getFakedataPrefix();
      });

      afterEach(() => {
        process.env = ENV_BACKUP;
      });

      it('returns fakedataPrefix', () => {
        expect(result.fakedataPrefix).toEqual(fakedataPrefix);
      });
    });

    describe('with env var FAKEDATA_PREFIX missing', () => {
      beforeEach(() => {
        delete process.env.FAKEDATA_PREFIX;

        result = scriptHelper.getFakedataPrefix();
      });

      afterEach(() => {
        process.env = ENV_BACKUP;
      });

      it('returns error', () => {
        expect(result.error).toEqual('Missing env variable: FAKEDATA_PREFIX');
      });
    });

    describe('with env var FAKEDATA_PREFIX default not changed', () => {
      beforeEach(() => {
        process.env.FAKEDATA_PREFIX = 'CHANGEME';

        result = scriptHelper.getFakedataPrefix();
      });

      afterEach(() => {
        process.env = ENV_BACKUP;
      });

      it('returns error', () => {
        expect(result.error).toEqual('Invalid env variable: FAKEDATA_PREFIX, must not be CHANGEME');
      });
    });
  });
});
