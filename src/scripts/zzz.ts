/* istanbul ignore file */
import { dbJassbot } from '@db/sources';
import { slackService } from '@services';
import { logger } from '@utils';

(async () => {
  logger.info('scripts: zzz called');

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: zzz exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const args = { exclude_archived: false, types: 'public_channel,private_channel' };
  const { channels, error } = await slackService.getChannels(args);
  logger.info('scripts: zzz completed', { numChannels: channels.length, error });

  await dbJassbot.disconnect();

  process.exit(0);
})();
