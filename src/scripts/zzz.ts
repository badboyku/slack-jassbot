/* istanbul ignore file */
import { dbJassbot } from '@db/sources';
import { jobService } from '@services';
import { logger } from '@utils';

(async () => {
  logger.info('scripts: test called');

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: test exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  await jobService.findTomorrowsBirthdays();
  logger.info('scripts: test completed');

  await dbJassbot.disconnect();

  process.exit(0);
})();
