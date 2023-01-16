import logger from '../utils/logger';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

const messageListener = async (args: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) => {
  const { payload, event, message, body } = args;

  switch (true) {
    default:
      logger.warn('Unknown app message', { payload, event, message, body });
  }
};

export default messageListener;
