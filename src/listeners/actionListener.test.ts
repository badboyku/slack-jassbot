import { actionController } from '@controllers';
import { actionListener } from '@listeners';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';

jest.mock('@controllers/actionController');
jest.mock('@utils/logger');

describe('listeners action', () => {
  const ack = jest.fn();
  const payload = 'payload';
  const action = { action_id: 'callbackId' };
  const body = 'body';
  const argsDefault = { ack, payload, action, body };

  describe('when called', () => {
    const args = argsDefault;

    beforeEach(() => {
      actionListener(args as unknown as SlackActionMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls ack', () => {
      expect(ack).toHaveBeenCalled();
    });
  });

  describe('when called with action_id manageUserDates', () => {
    const args = { ...argsDefault, action: { action_id: 'manageUserDates' } };

    beforeEach(() => {
      actionListener(args as unknown as SlackActionMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls actionController.manageUserDates', () => {
      expect(actionController.manageUserDates).toHaveBeenCalledWith(args);
    });
  });

  describe('when called with action_id unknown', () => {
    const args = argsDefault;

    beforeEach(() => {
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });
      actionListener(args as unknown as SlackActionMiddlewareArgs & AllMiddlewareArgs);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls logger.info', () => {
      expect(logger.info).toHaveBeenCalledWith('actionListener: unknown action', { payload, action, body });
    });
  });
});
