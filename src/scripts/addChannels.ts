/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { dbJassbot } from '../db/sources';
import { config, logger, mongodb } from '../utils';
import scriptsHelper from './scriptsHelper';
import type { WriteError } from 'mongodb';
import type { BulkWrite } from '@types';

const getChannelData = (key: string) => {
  const nowDate = new Date();
  const isMember = faker.datatype.boolean({ probability: 0.1 });
  const memberIds = isMember ? [config.slack.botUserId] : [];

  return {
    // eslint-disable-next-line no-bitwise
    _id: new ObjectId(~~(+nowDate / 1000)),
    channelId: `${key}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}`,
    name: faker.word.words({ count: { min: 1, max: 8 } }).replaceAll(' ', '-'),
    isArchived: !isMember && faker.datatype.boolean({ probability: 0.02 }),
    isMember,
    isPrivate: faker.datatype.boolean({ probability: 0.4 }),
    numMembers: memberIds.length,
    memberIds,
    createdAt: nowDate,
    updatedAt: nowDate,
  };
};

const getLogContext = (bulkWrite: BulkWrite) => {
  const { result, error } = bulkWrite;

  if (error) {
    const { code, writeErrors, result: errResult } = error;
    const errors: WriteError[] = writeErrors as WriteError[];
    const { insertedCount } = errResult;

    return { result: { insertedCount }, error: { code, numWriteErrors: errors.length } };
  }

  if (result) {
    const { insertedCount } = result;

    return { result: { insertedCount } };
  }

  return undefined;
};

(async () => {
  const numChannelsArg = Number(process.argv[2]) || undefined;
  const numChannels = Math.min(numChannelsArg ?? 100, 5000);
  logger.info('scripts: addChannels called', { numChannels });

  const { key, error: keyError } = scriptsHelper.getFakedataKey();
  if (keyError) {
    logger.info('scripts: addChannels exiting', { error: keyError });

    process.exit(1);
  }

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('scripts: addChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const operations = [];
  for (let i = 0; i < numChannels; i += 1) {
    operations.push({ insertOne: { document: getChannelData(key) } });
  }
  const options = { ordered: false };
  const bulkWrite = await mongodb.bulkWrite(dbJassbot.getChannelCollection(), operations, options);
  logger.info('scripts: addChannels completed', getLogContext(bulkWrite));

  await dbJassbot.close();

  process.exit(0);
})();
