/* istanbul ignore file */
import {App} from '@slack/bolt';
import registerListeners from './listeners';
import config from './utils/config';
import logger, {getSlackLogger, getSlackLogLevel} from './utils/logger';
import db from './db';

const {
  app: { port },
  slack: { appToken, botToken },
} = config;

/** Initialization */
const app = new App({
  appToken,
  token: botToken,
  socketMode: true,
  logger: getSlackLogger(),
  logLevel: getSlackLogLevel(),
});

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(port);
    logger.info('⚡️ Bolt app is running! ⚡️');

    db.connect();
  } catch (error) {
    logger.error('Unable to start App', { error });
  }
})();
