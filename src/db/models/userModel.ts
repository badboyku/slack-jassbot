/* istanbul ignore file */
import { model, Model, Schema } from 'mongoose';
import { crypto, dateTime } from '@utils';
import type { DateTime } from 'luxon';
import type { UserDocType, UserHydratedDocument, UserMethods } from '@types';

const { String } = Schema.Types;

type UserModel = Model<UserDocType, {}, UserMethods>;
const schema = new Schema<UserDocType, UserModel, UserMethods, {}, {}, {}, {}, UserHydratedDocument>(
  {
    userId: { type: String, index: true, required: true, unique: true },
    birthday: { type: String, required: false, default: '' },
    birthdayLookup: { type: String, index: true, required: false, default: '' },
    workAnniversary: { type: String, required: false, default: '' },
    workAnniversaryLookup: { type: String, index: true, required: false, default: '' },
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
