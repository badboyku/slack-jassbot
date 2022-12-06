/* istanbul ignore file */
import { App } from '@slack/bolt';
import db from './db';
import registerListeners from './listeners';
import config from './utils/config';
import logger from './utils/logger';
import slackLogger from './utils/slackLogger';

const {
  app: { port },
  slack: { appToken, botToken },
} = config;

/** Initialization */
const app = new App({ appToken, token: botToken, socketMode: true, logger: slackLogger });

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(port);
    logger.info('⚡️ App is running! ⚡️');
  } catch (error) {
    logger.error('Unable to start App', { error });
  }

  try {
    db.connect();
  } catch (error) {
    logger.error('Unable to connect to db', { error });
  }
})();
