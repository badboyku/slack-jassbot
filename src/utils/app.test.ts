import {
  actionListener,
  commandListener,
  eventListener,
  messageListener,
  optionsListener,
  shortcutListener,
  viewListener,
} from '@listeners';
import { app, config, logger } from '@utils';
import { appHelper } from '@utils/helpers';
import type { App, CodedError } from '@slack/bolt';
import type { AppStartResult } from '@types';

jest.mock('@listeners/actionListener');
jest.mock('@listeners/commandListener');
jest.mock('@listeners/eventListener');
jest.mock('@listeners/messageListener');
jest.mock('@listeners/optionsListener');
jest.mock('@listeners/shortcutListener');
jest.mock('@listeners/viewListener');
jest.mock('@utils/config');
jest.mock('@utils/logger');
jest.mock('@utils/helpers/appHelper');

describe('utils app', () => {
  const configAppDefault = { logLevel: '', logOutputFormat: '', nodeEnv: '', port: 123, isTsNode: false };
  const err = new Error('some error');
  const appMockDefault = {
    error: jest.fn(),
    action: jest.fn(),
    command: jest.fn(),
    event: jest.fn(),
    message: jest.fn(),
    options: jest.fn(),
    shortcut: jest.fn(),
    view: jest.fn(),
    start: jest.fn(),
  };

  describe('calling function start', () => {
    describe('successfully', () => {
      const error = (callback: (_error: CodedError) => void) => {
        callback(err as CodedError);
      };
      const appMock = { ...appMockDefault, error };
      let result: AppStartResult;

      beforeEach(async () => {
        config.app = configAppDefault;
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as unknown as App);
        jest.spyOn(logger, 'info').mockImplementationOnce(() => {
          // Do nothing.
        });
        jest.spyOn(logger, 'warn').mockImplementation(() => {
          // Do nothing.
        });

        result = await app.start();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls appHelper.getApp', () => {
        expect(appHelper.getApp).toHaveBeenCalled();
      });

      it('calls logger.warn with error occurring in app', () => {
        expect(logger.warn).toHaveBeenCalledWith('app: error has occurred', { error: err });
      });

      it('calls app.action', () => {
        expect(appMock.action).toHaveBeenCalledWith(/w*/, actionListener);
      });

      it('calls app.command', () => {
        expect(appMock.command).toHaveBeenCalledWith(/w*/, commandListener);
      });

      it('calls app.event', () => {
        expect(appMock.event).toHaveBeenCalledWith(/w*/, eventListener);
      });

      it('calls app.message', () => {
        expect(appMock.message).toHaveBeenCalledWith(/w*/, messageListener);
      });

      it('calls app.options', () => {
        expect(appMock.options).toHaveBeenCalledWith(/w*/, optionsListener);
      });

      it('calls app.shortcut', () => {
        expect(appMock.shortcut).toHaveBeenCalledWith(/w*/, shortcutListener);
      });

      it('calls app.view', () => {
        expect(appMock.view).toHaveBeenCalledWith(/w*/, viewListener);
      });

      it('calls app.start', () => {
        expect(appMock.start).toHaveBeenCalledWith(config.app.port);
      });

      it('calls logger.info', () => {
        expect(logger.info).toHaveBeenCalledWith(`app: start success on port ${config.app.port}`);
      });

      it('returns isStarted is true', () => {
        expect(result).toEqual({ isStarted: true });
      });
    });

    describe('with error', () => {
      let result: AppStartResult;

      beforeEach(async () => {
        config.app = configAppDefault;
        const start = jest.fn().mockImplementationOnce(() => {
          throw err;
        });
        const appMock = { ...appMockDefault, start };
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as unknown as App);
        jest.spyOn(logger, 'warn').mockImplementation(() => {
          // Do nothing.
        });

        result = await app.start();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn when app.start fails', () => {
        expect(logger.warn).toHaveBeenCalledWith('app: start failed', { error: err });
      });

      it('returns isStarted is false', () => {
        expect(result).toEqual({ isStarted: false });
      });
    });
  });
});
