/* istanbul ignore file */
import app from './utils/app';
import bree from './utils/bree';
import db from './utils/db';
import logger from './utils/logger';

(async () => {
  // Connect to database.
  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.error('Database failed to connect, exiting');

    process.exit(1);
  }

  // Start app.
  const { isStarted: isAppStarted } = await app.start();
  if (!isAppStarted) {
    await db.disconnect();
    logger.error('App failed to start, exiting');

    process.exit(1);
  }

  // Start bree.
  await bree.start();
})();
