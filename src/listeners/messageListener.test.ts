import { messageListener } from '@listeners';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

jest.mock('@utils/logger');

describe('listeners message', () => {
  const payload = 'payload';
  const event = 'event';
  const message = 'message';
  const body = 'body';
  const argsDefault = { payload, event, message, body };

  describe('when called with message unknown', () => {
    const args = argsDefault;

    beforeEach(() => {
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });

      messageListener(args as unknown as SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls logger.info', () => {
      expect(logger.info).toHaveBeenCalledWith('messageListener: unknown message', { payload, event, message, body });
    });
  });
});
