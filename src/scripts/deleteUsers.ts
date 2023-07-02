/* istanbul ignore file */
import { dbJassbot } from '../db/sources';
import { logger, mongodb } from '../utils';
import scriptsHelper from './scriptsHelper';

(async () => {
  logger.info('scripts: deleteUsers called');

  const { key, error: keyError } = scriptsHelper.getFakedataKey();
  if (keyError) {
    logger.info('scripts: deleteUsers exiting', { error: keyError });

    process.exit(1);
  }

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('scripts: deleteUsers exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const filter = { userId: { $regex: `^${key}` } };
  const results = await mongodb.deleteMany(dbJassbot.getUserCollection(), filter);
  logger.info('scripts: deleteUsers completed', { results });

  await dbJassbot.close();

  process.exit(0);
})();
