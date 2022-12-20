/* istanbul ignore file */
import app from './app';
import db from './db';
import listeners from './listeners';
import config from './utils/config';
import logger from './utils/logger';

(async () => {
  const {
    app: { port },
  } = config;

  listeners.register(app);

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
