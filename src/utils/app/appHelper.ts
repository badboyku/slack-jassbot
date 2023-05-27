import { App } from '@slack/bolt';
import { config, slackLogger } from '@utils';
import type { AppOptions } from '@slack/bolt';

const getAppOptions = (): AppOptions => ({
  appToken: config.slack.appToken,
  token: config.slack.botToken,
  socketMode: true,
  logger: slackLogger,
});

const getApp = (options: AppOptions = getAppOptions()): App => new App(options);

export default { getApp, getAppOptions };
