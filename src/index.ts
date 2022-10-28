import {App, LogLevel} from '@slack/bolt';
import config from './utils/config';
import logger from './utils/logger';
// import registerListeners from './listeners';

const {
  app: { port },
  slack: { appToken, botToken },
} = config;

/** Initialization */
const app = new App({
  appToken: appToken,
  token: botToken,
  socketMode: true,
  developerMode: true, // TODO: Be sure to remove this!
  logLevel: LogLevel.DEBUG,
});

/** Register Listeners */
// registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    await app.start(port);
    logger.info('⚡️ Bolt app is running! ⚡️');
  } catch (error) {
    logger.error('Unable to start App', { error });
  }
})();
