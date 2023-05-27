import { optionsListener } from '@listeners';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackOptionsMiddlewareArgs } from '@slack/bolt';

jest.mock('@utils/logger/logger');

describe('listeners options', () => {
  const ack = jest.fn();
  const payload = 'payload';
  const options = 'options';
  const body = 'body';
  const argsDefault = { ack, payload, options, body };

  describe('when called', () => {
    const args = argsDefault;

    beforeEach(() => {
      optionsListener(args as unknown as SlackOptionsMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls ack', () => {
      expect(ack).toHaveBeenCalled();
    });
  });

  describe('when called with options unknown', () => {
    const args = argsDefault;

    beforeEach(() => {
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });

      optionsListener(args as unknown as SlackOptionsMiddlewareArgs & AllMiddlewareArgs);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls logger.info', () => {
      expect(logger.info).toHaveBeenCalledWith('optionsListener: unknown options', { payload, options, body });
    });
  });
});
