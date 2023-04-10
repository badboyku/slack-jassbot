import { viewController } from '@controllers';
import { viewListener } from '@listeners';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

jest.mock('@controllers/viewController');
jest.mock('@utils/logger');

describe('listeners view', () => {
  const ack = jest.fn();
  const payload = 'payload';
  const view = { callback_id: 'callbackId' };
  const body = 'body';
  const argsDefault = { ack, payload, view, body };

  describe('when called', () => {
    const args = argsDefault;

    beforeEach(() => {
      viewListener(args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls ack', () => {
      expect(ack).toHaveBeenCalled();
    });
  });

  describe('when called with callback_id saveUserDates', () => {
    const args = { ...argsDefault, view: { callback_id: 'saveUserDates' } };

    beforeEach(() => {
      viewListener(args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls viewController.saveUserDates', () => {
      expect(viewController.saveUserDates).toHaveBeenCalledWith(args);
    });
  });

  describe('when called with callback_id saveUserDatesRefreshAppHome', () => {
    const args = { ...argsDefault, view: { callback_id: 'saveUserDatesRefreshAppHome' } };

    beforeEach(() => {
      viewListener(args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls viewController.saveUserDates with refreshAppHome', () => {
      expect(viewController.saveUserDates).toHaveBeenCalledWith(args, true);
    });
  });

  describe('when called with callback_id unknown', () => {
    const args = argsDefault;

    beforeEach(() => {
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });
      viewListener(args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls logger.info', () => {
      expect(logger.info).toHaveBeenCalledWith('viewListener: unknown view', { payload, view, body });
    });
  });
});
