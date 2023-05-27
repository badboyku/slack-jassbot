/* eslint-disable testing-library/no-debugging-utils */
import { config, logger, slackLogger } from '@utils';

jest.mock('@utils/config');
jest.mock('@utils/logger/logger');

describe('utils slackLogger', () => {
  const msg = 'message';
  const msgColon = 'message: with colon';
  const msgJson = 'message: {"foo":"bar"}';
  const configSlackDefault = { apiHost: '', appToken: '', botToken: '', botUserId: '', logLevel: 'INFO' };
  const testCases = [
    { test: 'no msg', msgs: [], message: 'Unknown message', context: undefined },
    { test: 'only one msg', msgs: [msg], message: msg, context: undefined },
    { test: 'more than one msg', msgs: [msg, msg, msg], message: msg, context: { msgExtra: [msg, msg] } },
    { test: 'msg with colon', msgs: [msgColon], message: msgColon, context: undefined },
    { test: 'msg with colon and JSON data', msgs: [msgJson], message: msg, context: { data: { foo: 'bar' } } },
  ];

  describe('calling function debug', () => {
    beforeEach(() => {
      config.slack = { ...configSlackDefault, logLevel: 'DEBUG' };
      jest.spyOn(logger, 'debug').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    testCases.forEach(({ test, msgs, message, context }) => {
      describe(`successfully with ${test}`, () => {
        beforeEach(() => {
          slackLogger.debug(...msgs);
        });

        it('calls logger.debug', () => {
          expect(logger.debug).toHaveBeenCalledWith(message, context);
        });
      });
    });
  });

  describe('calling function info', () => {
    beforeEach(() => {
      config.slack = { ...configSlackDefault, logLevel: 'INFO' };
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    testCases.forEach(({ test, msgs, message, context }) => {
      describe(`successfully with ${test}`, () => {
        beforeEach(() => {
          slackLogger.info(...msgs);
        });

        it('calls logger.info', () => {
          expect(logger.info).toHaveBeenCalledWith(message, context);
        });
      });
    });
  });

  describe('calling function warn', () => {
    beforeEach(() => {
      config.slack = { ...configSlackDefault, logLevel: 'WARN' };
      jest.spyOn(logger, 'warn').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    testCases.forEach(({ test, msgs, message, context }) => {
      describe(`successfully with ${test}`, () => {
        beforeEach(() => {
          slackLogger.warn(...msgs);
        });

        it('calls logger.warn', () => {
          expect(logger.warn).toHaveBeenCalledWith(message, context);
        });
      });
    });
  });

  describe('calling function error', () => {
    beforeEach(() => {
      config.slack = { ...configSlackDefault, logLevel: 'ERROR' };
      jest.spyOn(logger, 'error').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    testCases.forEach(({ test, msgs, message, context }) => {
      describe(`successfully with ${test}`, () => {
        beforeEach(() => {
          slackLogger.error(...msgs);
        });

        it('calls logger.error', () => {
          expect(logger.error).toHaveBeenCalledWith(message, context);
        });
      });
    });
  });
});
