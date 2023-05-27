/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { userService } from '@services';
import { crypto, dateTime, db, logger } from '@utils';
import type { DateTime } from 'luxon';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { UserDocType } from '@types';

(async () => {
  const numUsersArg = Number(process.argv[2]) || undefined;
  const numUsers = Math.min(numUsersArg || 1000, 5000);
  logger.info('scripts: addUsers called', { numUsersArg, numUsers });

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('scripts: addUsers exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  let birthdayDate: DateTime | undefined;
  let workAnniversaryDate: DateTime | undefined;
  const ops: AnyBulkWriteOperation<UserDocType>[] = [];

  for (let i = 0; i < numUsers; i += 1) {
    if (i % 10 !== 0) {
      birthdayDate = dateTime.getDateTimeFromJSDate(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }));
      workAnniversaryDate = dateTime.getDateTimeFromJSDate(faker.date.past({ years: 20 }));
    } else {
      birthdayDate = undefined;
      workAnniversaryDate = undefined;
    }
    const birthday = birthdayDate?.toISODate() || '';
    const birthdayLookup = birthdayDate?.toFormat('LL-dd') || '';
    const workAnniversary = workAnniversaryDate?.toISODate() || '';
    const workAnniversaryLookup = workAnniversaryDate?.toFormat('LL-dd') || '';

    const filter = { userId: `TEST${faker.string.alphanumeric({ length: 7, casing: 'upper' })}` };
    const update = {
      $set: {
        birthday: crypto.encrypt(birthday),
        birthdayLookup: crypto.createHmac(birthdayLookup),
        birthdayRaw: birthday, // TODO: Remove this!!!
        birthdayRawLookup: birthdayLookup, // TODO: Remove this!!!
        workAnniversary: crypto.encrypt(workAnniversary),
        workAnniversaryLookup: crypto.createHmac(workAnniversaryLookup),
        workAnniversaryRaw: workAnniversary, // TODO: Remove this!!!
        workAnniversaryRawLookup: workAnniversaryLookup, // TODO: Remove this!!!
        __v: 0,
      },
    };

    ops.push({ updateOne: { filter, update, upsert: true } });
  }

  const results = await userService.bulkWrite(ops);
  logger.info('scripts: addUsers completed', { results });

  await db.disconnect();

  process.exit(0);
})();
