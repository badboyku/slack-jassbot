/* istanbul ignore file */
import {faker} from '@faker-js/faker';
import {dbNewJassbot} from '@db/sources';
import {userService} from '@services';
import {crypto, dateTime, logger, scriptHelper} from '@utils';
import type {DateTime} from 'luxon';
import type {WriteError} from 'mongodb';
import type {BulkWrite} from '@types';

const getUserData = (i: number) => {
  const now = new Date();
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
    teamId: faker.string.alphanumeric({ length: 11, casing: 'upper' }),
    name: faker.internet.userName({ firstName, lastName }),
    realName: i === 0 ? undefined : fullName,
    displayName: i === 1 ? undefined : fullName,
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    tz: faker.location.timeZone(),
    isAdmin: i === 2 ? 'foo' : faker.datatype.boolean({ probability: 0.01 }),
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
    createdAt: now,
    updatedAt: now,
  };
};

const getLogContext = (bulkWrite: BulkWrite) => {
  const { result, error } = bulkWrite;

  if (error) {
    const { code, writeErrors, result: errResult } = error;
    const errors: WriteError[] = writeErrors as WriteError[];
    const { upsertedCount } = errResult;

    return { result: { upsertedCount }, error: { code, numWriteErrors: errors.length } };
  }

  if (result) {
    const { upsertedCount } = result;

    return { result: { upsertedCount } };
  }

  return undefined;
};

(async () => {
  const numUsersArg = Number(process.argv[2]) || undefined;
  const numUsers = Math.min(numUsersArg ?? 1000, 5000);
  logger.info('scripts: addUsers called', { numUsersArg, numUsers });

  const { isConnected: isDbConnected } = await dbNewJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: addUsers exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { fakedataPrefix, error: fakedataPrefixError } = scriptHelper.getFakedataPrefix();
  if (fakedataPrefixError) {
    logger.info('scripts: addUsers exiting', { error: fakedataPrefixError });

    process.exit(1);
  }

  const operations = [];
  for (let i = 0; i < numUsers; i += 1) {
    operations.push({
      updateOne: {
        filter: { userId: `${fakedataPrefix}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}` },
        update: { $set: getUserData(i) },
        upsert: true,
      },
    });
  }
  const options = { ordered: false };
  const bulkWrite = await userService.bulkWrite(operations, options);
  logger.info('scripts: addUsers completed', getLogContext(bulkWrite));

  await dbNewJassbot.close();

  process.exit(0);
})();
