import { crypto, dateTime } from '@utils';
import { USER_TZ_DEFAULT } from '@utils/constants';
import type { DateTime } from 'luxon';
import type { UserDoc, UserMongoModel } from '@types';

const model = (): UserMongoModel => ({
  addTimestamps() {
    return true;
  },

  getCollName() {
    return 'user';
  },

  getDefaults() {
    return {
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
  },

  getModel(d: UserDoc) {
    return {
      ...d,

      // Custom methods.
      getBirthdayDate(): DateTime | undefined {
        return this.birthday ? dateTime.getDateTimeFromIso(crypto.decrypt(this.birthday)) : undefined;
      },
      getWorkAnniversaryDate(): DateTime | undefined {
        return this.workAnniversary ? dateTime.getDateTimeFromIso(crypto.decrypt(this.workAnniversary)) : undefined;
      },
    };
  },

  getValidator() {
    return {
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
          deletedAt: { bsonType: ['null', 'date'] },
        },
        required: ['userId'],
      },
    };
  },
});

export default model();
