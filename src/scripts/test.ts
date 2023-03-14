/* istanbul ignore file */
import { jobService } from '../services';
import db from '../utils/db';
import logger from '../utils/logger';

(async () => {
  logger.info('scripts: temp called');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('scripts: temp exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  await jobService.findTomorrowsBirthdays();
  logger.info('scripts: temp completed');

  await db.disconnect();

  process.exit(0);
})();
