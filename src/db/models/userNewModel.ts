import {crypto, dateTime} from '@utils';
import {USER_TZ_DEFAULT} from '@utils/constants';
import type {DateTime} from 'luxon';
import type {UserData, UserModel, UserWithId} from '@types';

const collectionName = 'user';
const defaults: UserData = {
  teamId: '',
  name: '',
  realName: '',
  displayName: '',
  firstName: '',
  lastName: '',
  email: '',
  tz: USER_TZ_DEFAULT,
  isAdmin: false,
  isAppUser: false,
  isBot: false,
  isDeleted: false,
  isEmailConfirmed: false,
  isOwner: false,
  isPrimaryOwner: false,
  isRestricted: false,
  isUltraRestricted: false,
  birthday: '',
  birthdayLookup: '',
  workAnniversary: '',
  workAnniversaryLookup: '',
  channelIds: [],
};
const timestamps = true;
const validator = {
  $jsonSchema: {
    bsonType: 'object',
    properties: {
      userId: { bsonType: 'string' },
      teamId: { bsonType: 'string' },
      name: { bsonType: 'string' },
      realName: { bsonType: 'string' },
      displayName: { bsonType: 'string' },
      firstName: { bsonType: 'string' },
      lastName: { bsonType: 'string' },
      email: { bsonType: 'string' },
      tz: { bsonType: 'string' },
      isAdmin: { bsonType: 'bool' },
      isAppUser: { bsonType: 'bool' },
      isBot: { bsonType: 'bool' },
      isDeleted: { bsonType: 'bool' },
      isEmailConfirmed: { bsonType: 'bool' },
      isOwner: { bsonType: 'bool' },
      isPrimaryOwner: { bsonType: 'bool' },
      isRestricted: { bsonType: 'bool' },
      isUltraRestricted: { bsonType: 'bool' },
      birthday: { bsonType: 'string' },
      birthdayLookup: { bsonType: 'string' },
      workAnniversary: { bsonType: 'string' },
      workAnniversaryLookup: { bsonType: 'string' },
      channelIds: { bsonType: 'array' },
      createdAt: { bsonType: 'date' },
      updatedAt: { bsonType: 'date' },
    },
    required: ['userId'],
  },
};

const getMethods = (user: UserWithId) => ({
  getBirthdayDate(): DateTime | undefined {
    return user.birthday ? dateTime.getDateTimeFromIso(crypto.decrypt(user.birthday)) : undefined;
  },

  getWorkAnniversaryDate(): DateTime | undefined {
    return user.workAnniversary ? dateTime.getDateTimeFromIso(crypto.decrypt(user.workAnniversary)) : undefined;
  },
});

const getModel = (user: UserWithId): UserModel => {
  return { ...user, ...getMethods(user) };
};

export default { collectionName, defaults, timestamps, validator, getModel };
