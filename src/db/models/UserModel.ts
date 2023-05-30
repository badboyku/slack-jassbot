/* istanbul ignore file */
import { model, Model, Schema } from 'mongoose';
import { crypto, dateTime } from '@utils';
import type { DateTime } from 'luxon';
import type { UserDocType, UserHydratedDocument, UserMethods } from '@types';

const { String } = Schema.Types;

type UserModel = Model<UserDocType, {}, UserMethods>;
const schema = new Schema<UserDocType, UserModel, UserMethods, {}, {}, {}, {}, UserHydratedDocument>(
  {
    userId: { type: String, index: true, unique: true },
    birthday: { type: String, default: '' },
    birthdayLookup: { type: String, index: true, default: '' },
    workAnniversary: { type: String, default: '' },
    workAnniversaryLookup: { type: String, index: true, default: '' },
  },
  { collection: 'users', timestamps: true },
);
schema.method('getBirthdayDate', function getBirthdayDate(): DateTime | undefined {
  return dateTime.getDateTimeFromIso(crypto.decrypt(this.birthday));
});
schema.method('getWorkAnniversaryDate', function getWorkAnniversaryDate(): DateTime | undefined {
  return dateTime.getDateTimeFromIso(crypto.decrypt(this.workAnniversary));
});

export default model<UserDocType, UserModel>('User', schema);
