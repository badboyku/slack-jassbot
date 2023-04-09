import { gracefulHelper } from '@utils/helpers';
import type Bree from 'bree';
import type Graceful, { GracefulOptions } from '@ladjs/graceful';

jest.mock('@ladjs/graceful');

describe('utils/helpers gracefulHelper', () => {
  describe('calling function getGraceful', () => {
    describe('successfully', () => {
      let result: Graceful;

      beforeEach(() => {
        result = gracefulHelper.getGraceful();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns new Graceful object', () => {
        expect(result).toBeTruthy();
      });
    });
  });

  describe('calling function getGracefulOptions', () => {
    const bree = {};

    describe('successfully', () => {
      let options: GracefulOptions;

      beforeEach(() => {
        options = gracefulHelper.getGracefulOptions(bree as Bree);
      });

      it('returns options with brees', () => {
        expect(options.brees).toEqual([bree]);
      });
    });
  });
});
