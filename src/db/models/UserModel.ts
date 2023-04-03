/* istanbul ignore file */
import mongoose, { Schema } from 'mongoose';
import { crypto, dateTime } from '@utils';
import type { DateTime } from 'luxon';
import type { Document, Model, Types } from 'mongoose';

export type UserDocType = {
  userId: string;
  birthday: string;
  birthdayLookup: string;
  birthdayRaw: string; // TODO: REMOVE THIS!!!
  birthdayRawLookup: string; // TODO: REMOVE THIS!!!
  workAnniversary: string;
  workAnniversaryLookup: string;
  workAnniversaryRaw: string; // TODO: REMOVE THIS!!!
  workAnniversaryRawLookup: string; // TODO: REMOVE THIS!!!
  createdAt: Date;
  updatedAt: Date;
};
export type UserMethods = {
  getBirthdayDate: () => DateTime | undefined;
  getWorkAnniversaryDate: () => DateTime | undefined;
};
export type User = (UserDocType & Document<{}, {}, UserDocType> & UserMethods & { _id: Types.ObjectId }) | null;

const schema = new Schema<UserDocType, Model<UserDocType, {}, UserMethods>, UserMethods>(
  {
    userId: { type: String, index: true, unique: true },
    birthday: { type: String, default: '' },
    birthdayLookup: { type: String, index: true, default: '' },
    birthdayRaw: { type: String, default: '' }, // TODO: REMOVE THIS!!!
    birthdayRawLookup: { type: String, index: true, default: '' }, // TODO: REMOVE THIS!!!
    workAnniversary: { type: String, default: '' },
    workAnniversaryLookup: { type: String, index: true, default: '' },
    workAnniversaryRaw: { type: String, default: '' }, // TODO: REMOVE THIS!!!
    workAnniversaryRawLookup: { type: String, index: true, default: '' }, // TODO: REMOVE THIS!!!
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { collection: 'users', timestamps: true },
);

schema.method('getBirthdayDate', function getBirthdayDate(): DateTime | undefined {
  return dateTime.getDateTimeFromIso(crypto.decrypt(this.birthday));
});
schema.method('getWorkAnniversaryDate', function getWorkAnniversaryDate(): DateTime | undefined {
  return dateTime.getDateTimeFromIso(crypto.decrypt(this.workAnniversary));
});

export default mongoose.model<UserDocType, Model<UserDocType, {}, UserMethods>>('User', schema);
