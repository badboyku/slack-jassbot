import logger from '../utils/logger';
import type { AllMiddlewareArgs, SlackOptionsMiddlewareArgs } from '@slack/bolt';

const optionsListener = async (args: SlackOptionsMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, payload, options, body } = args;

  await ack();

  switch (true) {
    default:
      logger.warn('Unknown app options', { payload, options, body });
  }
};

export default optionsListener;
