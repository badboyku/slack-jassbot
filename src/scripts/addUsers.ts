/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { dbJassbot } from '../db/sources';
import { crypto, dateTime, logger, mongodb } from '../utils';
import scriptsHelper from './scriptsHelper';
import type { DateTime } from 'luxon';
import type { WriteError } from 'mongodb';
import type { BulkWrite } from '@types';

const getUserData = (key: string, i: number) => {
  const nowDate = new Date();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  let birthdayDate: DateTime | undefined;
  let workAnniversaryDate: DateTime | undefined;
  if (i % 10 !== 0) {
    birthdayDate = dateTime.getDateTimeFromJSDate(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }));
    workAnniversaryDate = dateTime.getDateTimeFromJSDate(faker.date.past({ years: 20 }));
  }

  return {
    // eslint-disable-next-line no-bitwise
    _id: new ObjectId(~~(+nowDate / 1000)),
    userId: `${key}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}`,
    teamId: faker.string.alphanumeric({ length: 11, casing: 'upper' }),
    name: faker.internet.userName({ firstName, lastName }),
    realName: fullName,
    displayName: fullName,
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    tz: faker.location.timeZone(),
    isAdmin: faker.datatype.boolean({ probability: 0.01 }),
    isAppUser: faker.datatype.boolean({ probability: 0.01 }),
    isBot: faker.datatype.boolean({ probability: 0.01 }),
    isDeleted: faker.datatype.boolean({ probability: 0.05 }),
    isEmailConfirmed: faker.datatype.boolean({ probability: 0.95 }),
    isOwner: faker.datatype.boolean({ probability: 0.01 }),
    isPrimaryOwner: faker.datatype.boolean({ probability: 0.01 }),
    isRestricted: faker.datatype.boolean({ probability: 0.01 }),
    isUltraRestricted: faker.datatype.boolean({ probability: 0.01 }),
    birthday: crypto.encrypt(birthdayDate?.toISODate() ?? ''),
    birthdayLookup: crypto.createHmac(birthdayDate?.toFormat('LL-dd') ?? ''),
    workAnniversary: crypto.encrypt(workAnniversaryDate?.toISODate() ?? ''),
    workAnniversaryLookup: crypto.createHmac(workAnniversaryDate?.toFormat('LL-dd') ?? ''),
    channelIds: [],
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
  const numUsersArg = Number(process.argv[2]) || undefined;
  const numUsers = Math.min(numUsersArg ?? 100, 5000);
  logger.info('scripts: addUsers called', { numUsers });

  const { key, error: keyError } = scriptsHelper.getFakedataKey();
  if (keyError) {
    logger.info('scripts: addUsers exiting', { error: keyError });

    process.exit(1);
  }

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('scripts: addUsers exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const operations = [];
  for (let i = 0; i < numUsers; i += 1) {
    operations.push({ insertOne: { document: getUserData(key, i) } });
  }
  const options = { ordered: false };
  const bulkWrite = await mongodb.bulkWrite(dbJassbot.getUserCollection(), operations, options);
  logger.info('scripts: addUsers completed', getLogContext(bulkWrite));

  await dbJassbot.close();

  process.exit(0);
})();
