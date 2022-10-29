/* istanbul ignore file */
import { App } from '@slack/bolt';
import registerListeners from './listeners';
import config from './utils/config';
import logger from './utils/logger';
import { getSlackLogger, getSlackLogLevel } from './utils/slackLogger';

const {
  app: { port },
  slack: { logLevel, appToken, botToken },
} = config;

const slackLogLevel = getSlackLogLevel(logLevel);
const slackLogger = getSlackLogger(slackLogLevel);

/** Initialization */
const app = new App({
  appToken,
  token: botToken,
  socketMode: true,
  logger: slackLogger,
  logLevel: slackLogLevel,
});

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(port);
    logger.info('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    logger.error('Unable to start App', { error });
  }
})();
