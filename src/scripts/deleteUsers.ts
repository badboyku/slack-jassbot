/* istanbul ignore file */
import { dbJassbot } from '@db/sources';
import { userService } from '@services';
import { logger, scriptHelper } from '@utils';

(async () => {
  logger.info('scripts: deleteUsers called');

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: deleteUsers exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { fakedataPrefix, error: fakedataPrefixError } = scriptHelper.getFakedataPrefix();
  if (fakedataPrefixError) {
    logger.info('scripts: deleteUsers exiting', { error: fakedataPrefixError });

    process.exit(1);
  }

  const filter = { userId: { $regex: `^${fakedataPrefix}` } };
  const results = await userService.deleteMany(filter);
  logger.info('scripts: deleteUsers completed', { results });

  await dbJassbot.disconnect();

  process.exit(0);
})();
