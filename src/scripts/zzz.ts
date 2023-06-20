/* istanbul ignore file */
import {faker} from '@faker-js/faker';
import {dbNewJassbot} from '@db/sources';
import {userService} from '@services';
import {crypto, dateTime, logger, scriptHelper} from '@utils';
import type {UserModel} from '@types';

const getUserData = (fakedataPrefix?: string) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;
  const birthdayDate = dateTime.getDateTimeFromJSDate(faker.date.birthdate({ min: 18, max: 65, mode: 'age' }));
  const workAnniversaryDate = dateTime.getDateTimeFromJSDate(faker.date.past({ years: 20 }));

  return {
    userId: `${fakedataPrefix}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}`,
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
  };
};

(async () => {
  logger.info('scripts: zzz called');

  const { isConnected: isDbConnected } = await dbNewJassbot.connect();
  if (!isDbConnected) {
    logger.info('scripts: zzz exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }
  await dbNewJassbot.syncValidations();

  const { fakedataPrefix, error: fakedataPrefixError } = scriptHelper.getFakedataPrefix();
  if (fakedataPrefixError) {
    logger.info('scripts: addUsers exiting', { error: fakedataPrefixError });

    process.exit(1);
  }

  // userService.createUser example
  // const newUserData = { userId: `${fakedataPrefix}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}` };
  // const newUser = await userService.createUser(newUserData);
  // if (newUser) {
  //   const birthdayDate = newUser.getBirthdayDate();
  //   const workAnniversaryDate = newUser.getWorkAnniversaryDate();
  //   logger.debug('scripts: zzz userService.createUser', { newUser, birthdayDate, workAnniversaryDate });
  // } else {
  //   logger.debug('scripts: zzz userService.createUser');
  // }

  // userService.findOneAndUpdateByUserIdNew example
  // const { userId: findOneAndUpdateUserId, ...userData } = getUserData(fakedataPrefix);
  // const updatedUser = await userService.findOneAndUpdateByUserId(findOneAndUpdateUserId, userData);
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

  const userColl = dbNewJassbot.getUserCollection();
  const options = {};
  const addTimestamps = true;
  let result;

  // mongodb.findOne example
  // const foFilter = { userId: 'JOEYTESTHTJD298' };
  // result = await mongodb.findOne(userColl, foFilter);
  // const { result: findOneUser, error: findOneError } = result;
  // if (findOneUser) {
  //   const { userId } = findOneUser as UserWithId;
  //   logger.debug('scripts: zzz mongodb.findOne', { userId, findOneUser });
  // } else if (findOneError) {
  //   logger.debug('scripts: zzz mongodb.findOne', { findOneError });
  // } else {
  //   logger.debug('scripts: zzz mongodb.findOne');
  // }

  // mongodb.findOneAndUpdate Example
  // const foauFilter = { userId: 'JOEYTESTF2ROD33XZ' };
  // const foauUpdate = { $set: { realName: 'fff', displayName: 'aaaa' } };
  // result = await mongodb.findOneAndUpdate(userColl, foauFilter, foauUpdate, options, addTimestamps);
  // logger.debug('scripts: zzz mongodb.findOneAndUpdate', { result });

  // mongodb.insertOne Example
  // const ioDoc = {
  //   userId: `${fakedataPrefix}${faker.string.alphanumeric({ length: 7, casing: 'upper' })}`,
  //   displayName: 'ffo',
  //   realName: 'ooo',
  // };
  // result = await mongodb.insertOne(userColl, ioDoc, options, addTimestamps);
  // const { doc: insertOneUser, result: insertOneResult, error: insertOneError } = result;
  // logger.debug('scripts: zzz mongodb.insertOne', { result });
  // if (insertOneResult) {
  //   const { userId } = insertOneUser as UserWithId;
  //   logger.debug('scripts: zzz mongodb.insertOne', { userId, insertOneUser, insertOneResult });
  // } else if (insertOneError) {
  //   logger.debug('scripts: zzz mongodb.insertOne', { insertOneError });
  // } else {
  //   logger.debug('scripts: zzz mongodb.insertOne');
  // }

  const findFilter = { isAdmin: true };
  const findOptions = {};
  const findParams = {};
  const findResult = await userService.find(findFilter, findOptions, findParams);
  const { data, metadata } = findResult;
  const firstUser = data.length ? (data[0] as UserModel) : undefined;
  const birthdayDate = firstUser?.getBirthdayDate();
  const workAnniversaryDate = firstUser?.getWorkAnniversaryDate();
  logger.debug('scripts: zzz mongodb.findUsers', {
    numUsers: data.length,
    metadata,
    firstUser,
    birthdayDate,
    workAnniversaryDate,
  });

  await dbNewJassbot.close();
  logger.info('scripts: zzz completed');

  process.exit(0);
})();
