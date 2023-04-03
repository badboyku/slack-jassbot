import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackOptionsMiddlewareArgs } from '@slack/bolt';

const optionsListener = async (args: SlackOptionsMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, payload, options, body } = args;

  await ack();

  switch (true) {
    default:
      logger.info('optionsListener: unknown options', { payload, options, body });
  }
};

export default optionsListener;
