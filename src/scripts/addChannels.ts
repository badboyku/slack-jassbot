/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { UserModel } from '@db/models';
import { dbJassbot } from '@db/sources';
import { channelService } from '@services';
import { config, logger } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelData } from '@types';

const getSampleUserIds = async (size = 1000): Promise<string[]> => {
  const userIds = [];

  const pipeline = [{ $match: { userId: /^TEST/ } }, { $sample: { size } }];
  const options = { batchSize: 1000 };
  const cursor = UserModel.aggregate(pipeline).cursor(options);
  for await (const user of cursor) {
    userIds.push(user.userId);
  }

  return userIds;
};

const getMembers = (userIds: string[] = []): string[] => {
  const numMembers = faker.number.int({ min: 0, max: Math.floor(userIds.length / 2) });
  if (numMembers === 0) {
    return [];
  }

  const sizeMaxIndex = userIds.length - 1;
  const halfNumMembers = Math.floor(numMembers / 2);
  const randIndex = faker.number.int({ min: 0, max: sizeMaxIndex });

  let start = randIndex - halfNumMembers;
  let end = randIndex + halfNumMembers;
  if (start < 0) {
    start = 0;
    end = numMembers - 1;
  } else if (end > sizeMaxIndex) {
    start = sizeMaxIndex - numMembers - 1;
    end = sizeMaxIndex;
  }

  return userIds.slice(start, end);
};

(async () => {
  const numChannelsArg = Number(process.argv[2]) || undefined;
  const numChannels = Math.min(numChannelsArg || 1000, 5000);
  logger.info('scripts: addChannels called', { numChannelsArg, numChannels });

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: addChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const userIds = await getSampleUserIds();

  const ops: AnyBulkWriteOperation<ChannelData>[] = [];
  for (let i = 0; i < numChannels; i += 1) {
    const members = getMembers(userIds);

    const isMember = faker.datatype.boolean();
    if (isMember) {
      members.push(config.slack.botUserId);
    }

    const filter = { channelId: `TEST${faker.string.alphanumeric({ length: 7, casing: 'upper' })}` };
    const update = {
      $set: {
        name: faker.word.words({ count: { min: 1, max: 8 } }).replaceAll(' ', '-'),
        isMember,
        isPrivate: faker.datatype.boolean(),
        numMembers: members.length,
        members,
        __v: 0,
      },
    };

    ops.push({ updateOne: { filter, update, upsert: true } });
  }

  const results = await channelService.bulkWrite(ops);
  logger.info('scripts: addChannels completed', { results });

  await dbJassbot.disconnect();

  process.exit(0);
})();
