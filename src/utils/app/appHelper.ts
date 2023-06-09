import { App } from '@slack/bolt';
import { config, logger, slackLogger } from '@utils';
import type { AppOptions, CodedError } from '@slack/bolt';
import type { ErrorHandler } from '@slack/bolt/dist/App';

const getAppOptions = (): AppOptions => ({
  appToken: config.slack.appToken,
  token: config.slack.botToken,
  socketMode: true,
  logger: slackLogger,
});

let slackApp: App;
const getApp = (options: AppOptions = getAppOptions()): App => {
  if (!slackApp) {
    /* istanbul ignore next */
    const handleError = (error: CodedError) => {
      logger.warn('app: error has occurred', { error });
    };

    slackApp = new App(options);
    slackApp.error(handleError as ErrorHandler);
  }

  return slackApp;
};

export default { getApp, getAppOptions };
