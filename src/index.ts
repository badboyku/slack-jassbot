/* istanbul ignore file */
import { dbJassbot } from '@db/sources';
import { app, bree, logger } from '@utils';

(async () => {
  logger.info('Starting Application');

  // Connect to database.
  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.warn('Application Exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  // Start app.
  const { isStarted: isAppStarted } = await app.start();
  if (!isAppStarted) {
    await dbJassbot.disconnect();
    logger.warn('Application Exiting', { error: 'App failed to start' });

    process.exit(1);
  }

  // Start bree.
  await bree.start();
})();
