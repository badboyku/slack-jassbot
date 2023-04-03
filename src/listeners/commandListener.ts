import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from '@slack/bolt';

const commandListener = async (args: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, payload, command, body } = args;

  await ack();

  switch (true) {
    default:
      logger.info('commandListener: unknown command', { payload, command, body });
  }
};

export default commandListener;
