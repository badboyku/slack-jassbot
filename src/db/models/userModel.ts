/* istanbul ignore file */
import { model, Model, Schema } from 'mongoose';
import { crypto, dateTime } from '@utils';
import { USER_TZ_DEFAULT } from '@utils/constants';
import type { DateTime } from 'luxon';
import type { UserDocType, UserHydratedDocument, UserMethods } from '@types';

const { Boolean, String } = Schema.Types;

type UserModel = Model<UserDocType, {}, UserMethods>;
const schema = new Schema<UserDocType, UserModel, UserMethods, {}, {}, {}, {}, UserHydratedDocument>(
  {
    userId: { type: String, unique: true, required: true },
    teamId: { type: String, index: true, required: false, default: '' },
    name: { type: String, required: false, default: '' },
    realName: { type: String, required: false, default: '' },
    displayName: { type: String, required: false, default: '' },
    firstName: { type: String, required: false, default: '' },
    lastName: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    tz: { type: String, required: false, default: USER_TZ_DEFAULT },
    isAdmin: { type: Boolean, required: false, default: false },
    isAppUser: { type: Boolean, required: false, default: false },
    isBot: { type: Boolean, index: true, required: false, default: false },
    isDeleted: { type: Boolean, index: true, required: false, default: false },
    isEmailConfirmed: { type: Boolean, required: false, default: false },
    isOwner: { type: Boolean, required: false, default: false },
    isPrimaryOwner: { type: Boolean, required: false, default: false },
    isRestricted: { type: Boolean, required: false, default: false },
    isUltraRestricted: { type: Boolean, required: false, default: false },
    birthday: { type: String, required: false, default: () => crypto.encrypt('') },
    birthdayLookup: { type: String, index: true, required: false, default: () => crypto.createHmac('') },
    workAnniversary: { type: String, required: false, default: () => crypto.encrypt('') },
    workAnniversaryLookup: { type: String, index: true, required: false, default: () => crypto.createHmac('') },
    channelIds: { type: [String], index: true, required: false, default: [] },
  },
  { collection: 'user', timestamps: true },
);
schema.method('getBirthdayDate', function getBirthdayDate(): DateTime | undefined {
  return dateTime.getDateTimeFromIso(crypto.decrypt(this.birthday));
});
schema.method('getWorkAnniversaryDate', function getWorkAnniversaryDate(): DateTime | undefined {
  return dateTime.getDateTimeFromIso(crypto.decrypt(this.workAnniversary));
});

export default model<UserDocType, UserModel>('User', schema);
