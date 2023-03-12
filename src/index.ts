/* istanbul ignore file */
import app from './utils/app';
import bree from './utils/bree';
import db from './utils/db';
import logger from './utils/logger';

(async () => {
  logger.info('Starting Application');

  // Connect to database.
  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('Application Exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  // Start app.
  const { isStarted: isAppStarted } = await app.start();
  if (!isAppStarted) {
    await db.disconnect();
    logger.info('Application Exiting', { error: 'App failed to start' });

    process.exit(1);
  }

  // Start bree.
  await bree.start();
})();
