import { App } from '@slack/bolt';
import { appHelper, config, slackLogger } from '@utils';
import type { AppOptions } from '@slack/bolt';

jest.mock('@slack/bolt');
jest.mock('@utils/config');
jest.mock('@utils/slackLogger');

describe('utils appHelper', () => {
  describe('calling function getApp', () => {
    describe('successfully', () => {
      let result: App;

      beforeEach(() => {
        result = appHelper.getApp();
      });

      it('returns new App object', () => {
        expect(result).toBeTruthy();
      });
    });
  });

  describe('calling function getAppOptions', () => {
    const appToken = 'appToken';
    const botToken = 'token';

    describe('successfully', () => {
      let options: AppOptions;

      beforeEach(() => {
        config.slack = { apiHost: '', appToken, botToken, botUserId: '', logLevel: '' };

        options = appHelper.getAppOptions();
      });

      it('returns options with appToken', () => {
        expect(options.appToken).toEqual(appToken);
      });

      it('returns options with token', () => {
        expect(options.token).toEqual(botToken);
      });

      it('returns options with socketMode true', () => {
        expect(options.socketMode).toEqual(true);
      });

      it('returns options with logger', () => {
        expect(options.logger).toEqual(slackLogger);
      });
    });
  });
});
