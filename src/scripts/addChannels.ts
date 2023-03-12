/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { channelService } from '../services';
import config from '../utils/config';
import db from '../utils/db';
import logger from '../utils/logger';
import { UserModel } from '../db/models';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelDocType } from '../db/models/ChannelModel';

(async () => {
  const maxNumChannels = 5000;
  const defaultNumChannels = 1000;
  const numChannelsArg = Number(process.argv[2]) || undefined;
  const numChannels = Math.min(numChannelsArg || defaultNumChannels, maxNumChannels);
  logger.info('scripts: addChannels called', { numChannelsArg, numChannels });

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('scripts: addChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const {
    slack: { botUserId },
  } = config;

  // Grab sample users.
  const sampleSize = 2000;
  const sampleSizeMaxIndex = sampleSize - 1;
  const userIds = [];
  const pipeline = [{ $match: { userId: /^TEST/ } }, { $sample: { size: sampleSize } }];
  const cursor = UserModel.aggregate(pipeline).cursor({ batchSize: 250 });
  for await (const user of cursor) {
    userIds.push(user.userId);
  }
  logger.debug('scripts: addChannels grabbed sample users');

  const ops: AnyBulkWriteOperation<ChannelDocType>[] = [];
  for (let i = 0; i < numChannels; i += 1) {
    const numMembers = faker.datatype.number(Math.floor(sampleSize / 2));
    const halfNumMembers = Math.floor(numMembers / 2);
    const randIndex = faker.datatype.number({ min: 0, max: sampleSizeMaxIndex });
    let start = randIndex - halfNumMembers;
    let end = randIndex + halfNumMembers;
    if (start < 0) {
      start = 0;
      end = numMembers - 1;
    }
    if (end > sampleSizeMaxIndex) {
      start = sampleSizeMaxIndex - numMembers - 1;
      end = sampleSizeMaxIndex;
    }
    const members = userIds.slice(start, end);
    const isMember = faker.datatype.boolean();
    if (isMember) {
      members.push(botUserId);
    }

    const filter = { channelId: `TEST${faker.random.alphaNumeric(7, { casing: 'upper' })}` };
    const update = {
      $set: { isMember, isPrivate: faker.datatype.boolean(), numMembers: members.length, members, __v: 0 },
    };

    ops.push({ updateOne: { filter, update, upsert: true } });
  }

  const results = await channelService.bulkWrite(ops);
  logger.info('scripts: addChannels completed', { results });

  await db.disconnect();

  process.exit(0);
})();
