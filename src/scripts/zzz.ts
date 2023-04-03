/* istanbul ignore file */
// import { jobService } from '@services';
import { db, logger } from '@utils';

(async () => {
  logger.info('scripts: test called');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('scripts: test exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  // await jobService.findTomorrowsBirthdays();
  logger.info('scripts: test completed');

  await db.disconnect();

  process.exit(0);
})();
