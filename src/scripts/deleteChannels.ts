/* istanbul ignore file */
import { dbJassbot } from '../db/sources';
import { logger, mongodb } from '../utils';
import scriptsHelper from './scriptsHelper';

(async () => {
  logger.info('scripts: deleteChannels called');

  const { key, error: keyError } = scriptsHelper.getFakedataKey();
  if (keyError) {
    logger.info('scripts: deleteChannels exiting', { error: keyError });

    process.exit(1);
  }

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('scripts: deleteChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const filter = { channelId: { $regex: `^${key}` } };
  const results = await mongodb.deleteMany(dbJassbot.getChannelCollection(), filter);
  logger.info('scripts: deleteChannels completed', { results });

  await dbJassbot.close();

  process.exit(0);
})();
