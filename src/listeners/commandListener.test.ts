import { commandListener } from '@listeners';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';

jest.mock('@utils/logger');

describe('listeners command', () => {
  const ack = jest.fn();
  const payload = 'payload';
  const command = 'command';
  const body = 'body';
  const argsDefault = { ack, payload, command, body };

  describe('when called', () => {
    const args = argsDefault;

    beforeEach(() => {
      commandListener(args as unknown as SlackCommandMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls ack', () => {
      expect(ack).toHaveBeenCalled();
    });
  });

  describe('when called with command unknown', () => {
    const args = argsDefault;

    beforeEach(() => {
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });

      commandListener(args as unknown as SlackCommandMiddlewareArgs & AllMiddlewareArgs);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls logger.info', () => {
      expect(logger.info).toHaveBeenCalledWith('commandListener: unknown command', { payload, command, body });
    });
  });
});
