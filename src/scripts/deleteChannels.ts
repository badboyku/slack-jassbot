/* istanbul ignore file */
import { dbJassbot } from '@db/sources';
import { channelService } from '@services';
import { logger, scriptHelper } from '@utils';

(async () => {
  logger.info('scripts: deleteChannels called');

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: deleteChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { fakedataPrefix, error: fakedataPrefixError } = scriptHelper.getFakedataPrefix();
  if (fakedataPrefixError) {
    logger.info('scripts: deleteChannels exiting', { error: fakedataPrefixError });

    process.exit(1);
  }

  const filter = { channelId: { $regex: `^${fakedataPrefix}` } };
  const results = await channelService.deleteMany(filter);
  logger.info('scripts: deleteChannels completed', { results });

  await dbJassbot.disconnect();

  process.exit(0);
})();
