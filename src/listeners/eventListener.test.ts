import { eventController } from '@controllers';
import { eventListener } from '@listeners';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

jest.mock('@controllers/eventController');
jest.mock('@utils/logger');

describe('listeners event', () => {
  const payload = 'payload';
  const event = { type: 'type' };
  const message = 'message';
  const body = 'body';
  const argsDefault = { payload, event, message, body };

  describe('when called with event type app_home_opened', () => {
    const args = { ...argsDefault, event: { type: 'app_home_opened' } };

    beforeEach(() => {
      eventListener(args as unknown as SlackEventMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls actionController.appHomeOpened', () => {
      expect(eventController.appHomeOpened).toHaveBeenCalledWith(args);
    });
  });

  describe('when called with event type app_mention', () => {
    const args = { ...argsDefault, event: { type: 'app_mention' } };

    beforeEach(() => {
      eventListener(args as unknown as SlackEventMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls actionController.appMention', () => {
      expect(eventController.appMention).toHaveBeenCalledWith(args);
    });
  });

  describe('when called with event type member_joined_channel', () => {
    const args = { ...argsDefault, event: { type: 'member_joined_channel' } };

    beforeEach(() => {
      eventListener(args as unknown as SlackEventMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls actionController.memberJoinedChannel', () => {
      expect(eventController.memberJoinedChannel).toHaveBeenCalledWith(args);
    });
  });

  describe('when called with event type member_left_channel', () => {
    const args = { ...argsDefault, event: { type: 'member_left_channel' } };

    beforeEach(() => {
      eventListener(args as unknown as SlackEventMiddlewareArgs & AllMiddlewareArgs);
    });

    it('calls actionController.memberLeftChannel', () => {
      expect(eventController.memberLeftChannel).toHaveBeenCalledWith(args);
    });
  });

  describe('when called with event type unknown', () => {
    const args = argsDefault;

    beforeEach(() => {
      jest.spyOn(logger, 'info').mockImplementationOnce(() => {
        // Do nothing.
      });

      eventListener(args as unknown as SlackEventMiddlewareArgs & AllMiddlewareArgs);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls logger.info', () => {
      expect(logger.info).toHaveBeenCalledWith('eventListener: unknown event', { payload, event, message, body });
    });
  });
});
