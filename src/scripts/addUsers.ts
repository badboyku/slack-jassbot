/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { dbJassbot } from '@db/sources';
import { userService } from '@services';
import { crypto, dateTime, logger, scriptHelper } from '@utils';
import type { DateTime } from 'luxon';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { UserData } from '@types';

(async () => {
  const numUsersArg = Number(process.argv[2]) || undefined;
  const numUsers = Math.min(numUsersArg || 1000, 5000);
  logger.info('scripts: addUsers called', { numUsersArg, numUsers });

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: addUsers exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { fakedataPrefix, error: fakedataPrefixError } = scriptHelper.getFakedataPrefix();
  if (fakedataPrefixError) {
    logger.info('scripts: addUsers exiting', { error: fakedataPrefixError });

    process.exit(1);
  }

  let birthdayDate: DateTime | undefined;
  let workAnniversaryDate: DateTime | undefined;
  const ops: AnyBulkWriteOperation<UserData>[] = [];
  for (let i = 0; i < numUsers; i += 1) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;

    if (i % 10 !== 0) {
      birthdayDate = dateTime.getDateTimeFromJSDate(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }));
      workAnniversaryDate = dateTime.getDateTimeFromJSDate(faker.date.past({ years: 20 }));
    } else {
      birthdayDate = undefined;
      workAnniversaryDate = undefined;
    }

    ops.push({
      updateOne: {
        filter: { userId: `${fakedataPrefix}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}` },
        update: {
          $set: {
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
            birthday: crypto.encrypt(birthdayDate?.toISODate() || ''),
            birthdayLookup: crypto.createHmac(birthdayDate?.toFormat('LL-dd') || ''),
            workAnniversary: crypto.encrypt(workAnniversaryDate?.toISODate() || ''),
            workAnniversaryLookup: crypto.createHmac(workAnniversaryDate?.toFormat('LL-dd') || ''),
            __v: 0,
          },
        },
        upsert: true,
      },
    });
  }

  const results = await userService.bulkWrite(ops);
  logger.info('scripts: addUsers completed', { results });

  await dbJassbot.disconnect();

  process.exit(0);
})();
