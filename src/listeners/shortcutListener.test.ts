import { shortcutListener } from '@listeners';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackShortcutMiddlewareArgs } from '@slack/bolt';

jest.mock('@utils/logger/logger');

describe('listeners shortcut', () => {
  const ack = jest.fn();
  const payload = 'payload';
  const shortcut = 'shortcut';
  const body = 'body';
  const argsDefault = { ack, payload, shortcut, body };

  describe('when called', () => {
    const args = argsDefault;

    beforeEach(() => {
      shortcutListener(args as unknown as SlackShortcutMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls ack', () => {
      expect(ack).toHaveBeenCalled();
    });
  });

  describe('when called with shortcut unknown', () => {
    const args = argsDefault;

    beforeEach(() => {
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });

      shortcutListener(args as unknown as SlackShortcutMiddlewareArgs & AllMiddlewareArgs);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls logger.info', () => {
      expect(logger.info).toHaveBeenCalledWith('shortcutListener: unknown shortcut', { payload, shortcut, body });
    });
  });
});
