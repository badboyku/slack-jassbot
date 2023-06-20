/* istanbul ignore file */
import {dbNewJassbot} from '@db/sources';
import {userService} from '@services';
import {logger, scriptHelper} from '@utils';

(async () => {
  logger.info('scripts: deleteUsers called');

  const { isConnected: isDbConnected } = await dbNewJassbot.connect();
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
  const { result, error } = await userService.deleteMany(filter);
  logger.info('scripts: deleteUsers completed', { result, error });

  await dbNewJassbot.close();

  process.exit(0);
})();
