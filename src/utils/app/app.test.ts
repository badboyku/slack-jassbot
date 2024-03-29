import {
  actionListener,
  commandListener,
  eventListener,
  messageListener,
  optionsListener,
  shortcutListener,
  viewListener,
} from '@listeners';
import { app, appHelper, config, logger } from '@utils';
import type { AppStartResult } from '@types';

jest.mock('@listeners/actionListener');
jest.mock('@listeners/commandListener');
jest.mock('@listeners/eventListener');
jest.mock('@listeners/messageListener');
jest.mock('@listeners/optionsListener');
jest.mock('@listeners/shortcutListener');
jest.mock('@listeners/viewListener');
jest.mock('@utils/app/appHelper');
jest.mock('@utils/config');
jest.mock('@utils/logger/logger');

describe('utils app', () => {
  const configAppDefault = {
    isTsNode: false,
    logLevel: '',
    logOutputFormat: '',
    name: '',
    nodeEnv: '',
    port: 123,
    version: '',
  };
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
      const error = (callback: (_error: never) => void) => {
        callback(err as never);
      };
      const appMock = { ...appMockDefault, error };
      let result: AppStartResult;

      beforeEach(async () => {
        config.app = configAppDefault;
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as never);
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

      it('calls app.action with actionListener', () => {
        expect(appMock.action).toHaveBeenCalledWith(/w*/, actionListener);
      });

      it('calls app.command with commandListener', () => {
        expect(appMock.command).toHaveBeenCalledWith(/w*/, commandListener);
      });

      it('calls app.event with eventListener', () => {
        expect(appMock.event).toHaveBeenCalledWith(/w*/, eventListener);
      });

      it('calls app.message with messageListener', () => {
        expect(appMock.message).toHaveBeenCalledWith(/w*/, messageListener);
      });

      it('calls app.options with optionsListener', () => {
        expect(appMock.options).toHaveBeenCalledWith(/w*/, optionsListener);
      });

      it('calls app.shortcut with shortcutListener', () => {
        expect(appMock.shortcut).toHaveBeenCalledWith(/w*/, shortcutListener);
      });

      it('calls app.view with viewListener', () => {
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
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as never);
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
