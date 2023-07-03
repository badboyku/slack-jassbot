/* istanbul ignore file */
// import { faker } from '@faker-js/faker';
// import { UserModel } from '@db/models';
import { dbJassbot } from '@db/sources';
import { /* userService, */ jobService } from '@services';
import { /* crypto, dateTime, */ logger /* , mongodb */ } from '@utils';
import scriptsHelper from './scriptsHelper';
// import type { MongoError, MongoServerError } from 'mongodb';
// import type { UserModel as UserModelType } from '@types';

// const getUserData = (key: string) => {
//   const firstName = faker.person.firstName();
//   const lastName = faker.person.lastName();
//   const fullName = `${firstName} ${lastName}`;
//   const birthdayDate = dateTime.getDateTimeFromJSDate(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }));
//   const workAnniversaryDate = dateTime.getDateTimeFromJSDate(faker.date.past({ years: 20 }));
//
//   return {
//     userId: `${key}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}`,
//     teamId: faker.string.alphanumeric({ length: 11, casing: 'upper' }),
//     name: faker.internet.userName({ firstName, lastName }),
//     realName: fullName,
//     displayName: fullName,
//     firstName,
//     lastName,
//     email: faker.internet.email({ firstName, lastName }),
//     tz: faker.location.timeZone(),
//     isAdmin: faker.datatype.boolean({ probability: 0.01 }),
//     isAppUser: faker.datatype.boolean({ probability: 0.01 }),
//     isBot: faker.datatype.boolean({ probability: 0.01 }),
//     isDeleted: faker.datatype.boolean({ probability: 0.05 }),
//     isEmailConfirmed: faker.datatype.boolean({ probability: 0.95 }),
//     isOwner: faker.datatype.boolean({ probability: 0.01 }),
//     isPrimaryOwner: faker.datatype.boolean({ probability: 0.01 }),
//     isRestricted: faker.datatype.boolean({ probability: 0.01 }),
//     isUltraRestricted: faker.datatype.boolean({ probability: 0.01 }),
//     birthday: crypto.encrypt(birthdayDate?.toISODate() ?? ''),
//     birthdayLookup: crypto.createHmac(birthdayDate?.toFormat('LL-dd') ?? ''),
//     workAnniversary: crypto.encrypt(workAnniversaryDate?.toISODate() ?? ''),
//     workAnniversaryLookup: crypto.createHmac(workAnniversaryDate?.toFormat('LL-dd') ?? ''),
//     channelIds: [],
//   };
// };

(async () => {
  logger.info('scripts: zzz called');

  const { /* key, */ error: keyError } = scriptsHelper.getFakedataKey();
  if (keyError) {
    logger.info('scripts: zzz exiting', { error: keyError });

    process.exit(1);
  }

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('scripts: zzz exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }
  // await dbJassbot.syncValidations();

  // userService.findOneAndUpdateByUserId example
  // const { userId: foauUserId, ...foauUserData } = getUserData(key);
  // const updatedUser = await userService.findOneAndUpdateByUserId(foauUserId, foauUserData);
  // if (updatedUser) {
  //   const birthdayDate = updatedUser.getBirthdayDate();
  //   const workAnniversaryDate = updatedUser.getWorkAnniversaryDate();
  //   logger.debug('scripts: zzz userService.findOneAndUpdateByUserId', {
  //     updatedUser,
  //     birthdayDate,
  //     workAnniversaryDate,
  //   });
  // } else {
  //   logger.debug('scripts: zzz userService.findOneAndUpdateByUserId');
  // }

  // userService.findAll Example
  // const tomorrowsBirthday = dateTime.getDateTime().plus({ days: 1 }).toFormat('LL-dd');
  // const faFilter = { birthdayLookup: crypto.createHmac(tomorrowsBirthday), isDeleted: false };
  // const faUsers = await userService.findAll(faFilter);
  // const firstUser = faUsers.length ? (faUsers[0] as UserModelType) : undefined;
  // const birthdayDate = firstUser?.getBirthdayDate();
  // const workAnniversaryDate = firstUser?.getWorkAnniversaryDate();
  // logger.debug('scripts: zzz userService.findAll', {
  //   numUsers: faUsers.length,
  //   firstUser,
  //   birthdayDate,
  //   workAnniversaryDate,
  // });

  // const userColl = dbJassbot.getUserCollection();

  // mongodb.findOne example
  // const foFilter = { userId: 'JOEYTEST7YTBZP1' };
  // const fo = await mongodb.findOne(userColl, foFilter, {}, UserModel);
  // const { result: foUser, error: foError } = fo as { result?: UserModelType; error?: MongoError };
  // if (foUser) {
  //   const { userId } = foUser;
  //   const birthdayDate = foUser.getBirthdayDate();
  //   const workAnniversaryDate = foUser.getWorkAnniversaryDate();
  //   logger.debug('scripts: zzz mongodb.findOne', { userId, foUser, birthdayDate, workAnniversaryDate });
  // } else if (foError) {
  //   logger.debug('scripts: zzz mongodb.findOne', { foError });
  // } else {
  //   logger.debug('scripts: zzz mongodb.findOne');
  // }

  // mongodb.findOneAndUpdate Example
  // const foauFilter = { userId: 'JOEYTEST7YTBZP1' };
  // const foauUpdate = { $set: { realName: 'fff', displayName: 'aaaa' } };
  // const foau = await mongodb.findOneAndUpdate(userColl, foauFilter, foauUpdate, {}, UserModel);
  // const { doc: foauUser, error: foauError } = foau as { doc: UserModelType; error: MongoServerError };
  // if (foauUser) {
  //   const { userId } = foauUser;
  //   const birthdayDate = foauUser.getBirthdayDate();
  //   const workAnniversaryDate = foauUser.getWorkAnniversaryDate();
  //   logger.debug('scripts: zzz mongodb.findOneAndUpdate', { userId, foauUser, birthdayDate, workAnniversaryDate });
  // } else if (foauError) {
  //   logger.debug('scripts: zzz mongodb.findOneAndUpdate', { foauError });
  // } else {
  //   logger.debug('scripts: zzz mongodb.findOneAndUpdate');
  // }

  // mongodb.insertOne Example
  // const ioDoc = {
  //   userId: `${key}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}`,
  //   displayName: 'ffo',
  //   realName: 'ooo',
  // };
  // const ioResult = await mongodb.insertOne(userColl, ioDoc, {}, UserModel);
  // const { doc: ioUser, error: ioError } = ioResult as { doc?: UserModelType; error?: MongoServerError };
  // if (ioUser) {
  //   const { userId } = ioUser;
  //   const birthdayDate = ioUser.getBirthdayDate();
  //   const workAnniversaryDate = ioUser.getWorkAnniversaryDate();
  //   logger.debug('scripts: zzz mongodb.insertOne', { userId, ioUser, birthdayDate, workAnniversaryDate });
  // } else if (ioError) {
  //   logger.debug('scripts: zzz mongodb.insertOne', { ioError });
  // } else {
  //   logger.debug('scripts: zzz mongodb.insertOne');
  // }

  // mongodb.find Example
  // const findFilter = { isAdmin: true };
  // const fResult = await mongodb.find(userColl, findFilter, {}, {}, UserModel);
  // const { result, pageInfo } = fResult;
  // const firstUser = result.length ? (result[100] as UserModelType) : undefined;
  // const birthdayDate = firstUser?.getBirthdayDate();
  // const workAnniversaryDate = firstUser?.getWorkAnniversaryDate();
  // logger.debug('scripts: zzz mongodb.find', {
  //   numUsers: result.length,
  //   pageInfo,
  //   firstUser,
  //   birthdayDate,
  //   workAnniversaryDate,
  // });

  await jobService.findTomorrowsBirthdays();

  await dbJassbot.close();
  logger.info('scripts: zzz completed');

  process.exit(0);
})();
