/* eslint-disable no-console, testing-library/no-debugging-utils */
import { config, logger } from '@utils';
import { getSeverityNum } from '@utils/logger';

jest.mock('@utils/config');

describe('utils logger', () => {
  const message = 'message';
  const context = { foo: 'bar' };
  const logMessage = 'logMessage';
  const configAppDefault = { logLevel: 'INFO', logOutputFormat: 'ELK', nodeEnv: 'TEST', port: 3000, isTsNode: true };

  beforeEach(() => {
    jest.spyOn(JSON, 'stringify').mockReturnValueOnce(logMessage);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('calling function debug', () => {
    beforeEach(() => {
      config.app = { ...configAppDefault, logLevel: 'DEBUG' };
      jest.spyOn(console, 'debug').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('successfully', () => {
      beforeEach(() => {
        logger.debug(message, context);
      });

      it('calls JSON.stringify', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'DEBUG', message, context });
      });

      it('calls console.debug', () => {
        expect(console.debug).toHaveBeenCalledWith(logMessage);
      });
    });

    describe('with logOutputFormat=DEV', () => {
      beforeEach(() => {
        config.app = { ...configAppDefault, logLevel: 'DEBUG', logOutputFormat: 'DEV' };

        logger.debug(message, context);
      });

      it('calls JSON.stringify with spaces', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'DEBUG', message, context }, null, 4);
      });
    });

    describe('with app log level higher than DEBUG', () => {
      beforeEach(() => {
        config.app = { ...configAppDefault, logLevel: 'ERROR' };

        logger.debug(message, context);
      });

      it('does not call JSON.stringify', () => {
        expect(JSON.stringify).not.toHaveBeenCalled();
      });

      it('does not call console.debug', () => {
        expect(console.debug).not.toHaveBeenCalled();
      });
    });
  });

  describe('calling function info', () => {
    beforeEach(() => {
      config.app = { ...configAppDefault, logLevel: 'INFO' };
      jest.spyOn(console, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('successfully', () => {
      beforeEach(() => {
        logger.info(message, context);
      });

      it('calls JSON.stringify', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'INFO', message, context });
      });

      it('calls console.info', () => {
        expect(console.info).toHaveBeenCalledWith(logMessage);
      });
    });

    describe('with logOutputFormat=DEV', () => {
      beforeEach(() => {
        config.app = { ...configAppDefault, logLevel: 'INFO', logOutputFormat: 'DEV' };

        logger.info(message, context);
      });

      it('calls JSON.stringify with spaces', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'INFO', message, context }, null, 4);
      });
    });

    describe('with app log level higher than INFO', () => {
      beforeEach(() => {
        config.app = { ...configAppDefault, logLevel: 'ERROR' };

        logger.info(message, context);
      });

      it('does not call JSON.stringify', () => {
        expect(JSON.stringify).not.toHaveBeenCalled();
      });

      it('does not call console.info', () => {
        expect(console.info).not.toHaveBeenCalled();
      });
    });
  });

  describe('calling function warn', () => {
    beforeEach(() => {
      config.app = { ...configAppDefault, logLevel: 'WARN' };
      jest.spyOn(console, 'warn').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('successfully', () => {
      beforeEach(() => {
        logger.warn(message, context);
      });

      it('calls JSON.stringify', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'WARN', message, context });
      });

      it('calls console.warn', () => {
        expect(console.warn).toHaveBeenCalledWith(logMessage);
      });
    });

    describe('with logOutputFormat=DEV', () => {
      beforeEach(() => {
        config.app = { ...configAppDefault, logLevel: 'WARN', logOutputFormat: 'DEV' };

        logger.warn(message, context);
      });

      it('calls JSON.stringify with spaces', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'WARN', message, context }, null, 4);
      });
    });

    describe('with app log level higher than WARN', () => {
      beforeEach(() => {
        config.app = { ...configAppDefault, logLevel: 'ERROR' };

        logger.warn(message, context);
      });

      it('does not call JSON.stringify', () => {
        expect(JSON.stringify).not.toHaveBeenCalled();
      });

      it('does not call console.warn', () => {
        expect(console.warn).not.toHaveBeenCalled();
      });
    });
  });

  describe('calling function error', () => {
    beforeEach(() => {
      config.app = { ...configAppDefault, logLevel: 'ERROR' };
      jest.spyOn(console, 'error').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('successfully', () => {
      beforeEach(() => {
        logger.error(message, context);
      });

      it('calls JSON.stringify', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'ERROR', message, context });
      });

      it('calls console.error', () => {
        expect(console.error).toHaveBeenCalledWith(logMessage);
      });
    });

    describe('with logOutputFormat=DEV', () => {
      beforeEach(() => {
        config.app = { ...configAppDefault, logLevel: 'ERROR', logOutputFormat: 'DEV' };

        logger.error(message, context);
      });

      it('calls JSON.stringify with spaces', () => {
        expect(JSON.stringify).toHaveBeenCalledWith({ severity: 'ERROR', message, context }, null, 4);
      });
    });
  });

  describe('calling function getSeverityNum', () => {
    const testCases = [
      { severity: 'DEBUG', num: 0 },
      { severity: 'INFO', num: 1 },
      { severity: 'WARN', num: 2 },
      { severity: 'ERROR', num: 3 },
      { severity: 'unknown', num: 3 },
    ];
    testCases.forEach(({ severity, num }) => {
      describe(`with severity ${severity}`, () => {
        it(`returns severity num ${num}`, () => {
          expect(getSeverityNum(severity)).toEqual(num);
        });
      });
    });
  });
});
