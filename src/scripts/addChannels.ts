/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { dbJassbot } from '@db/sources';
import { channelService } from '@services';
import { config, logger, scriptHelper } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelData } from '@types';

(async () => {
  const numChannelsArg = Number(process.argv[2]) || undefined;
  const numChannels = Math.min(numChannelsArg || 1000, 5000);
  logger.info('scripts: addChannels called', { numChannelsArg, numChannels });

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: addChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { fakedataPrefix, error: fakedataPrefixError } = scriptHelper.getFakedataPrefix();
  if (fakedataPrefixError) {
    logger.info('scripts: addUsers exiting', { error: fakedataPrefixError });

    process.exit(1);
  }

  const ops: AnyBulkWriteOperation<ChannelData>[] = [];
  for (let i = 0; i < numChannels; i += 1) {
    const isMember = faker.datatype.boolean({ probability: 0.1 });
    const memberIds = isMember ? [config.slack.botUserId] : [];

    ops.push({
      updateOne: {
        filter: { channelId: `${fakedataPrefix}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}` },
        update: {
          $set: {
            name: faker.word.words({ count: { min: 1, max: 8 } }).replaceAll(' ', '-'),
            isArchived: !isMember && faker.datatype.boolean({ probability: 0.02 }),
            isMember,
            isPrivate: faker.datatype.boolean({ probability: 0.4 }),
            numMembers: memberIds.length,
            memberIds,
            __v: 0,
          },
        },
        upsert: true,
      },
    });
  }

  const results = await channelService.bulkWrite(ops);
  logger.info('scripts: addChannels completed', { results });

  await dbJassbot.disconnect();

  process.exit(0);
})();
