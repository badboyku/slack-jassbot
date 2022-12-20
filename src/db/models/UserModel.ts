import mongoose, { Schema } from 'mongoose';
import datetime from '../../utils/datetime';
import type { Document, Model, Types } from 'mongoose';
import type { DateTime } from 'luxon';

export type UserDocType = {
  userId: string;
  birthMonth: number | null;
  birthDay: number | null;
  workAnniversaryMonth: number | null;
  workAnniversaryDay: number | null;
  workAnniversaryYear: number | null;
  createdAt: Date;
  updatedAt: Date;
};
export type UserMethods = {
  getNextBirthDate: () => DateTime | undefined;
  getWorkAnniversaryDate: () => DateTime | undefined;
};
export type User = (UserDocType & Document<{}, {}, UserDocType> & UserMethods & { _id: Types.ObjectId }) | null;

const schema = new Schema<UserDocType, Model<UserDocType, {}, UserMethods>, UserMethods>(
  {
    userId: { type: String, index: true, unique: true },
    birthMonth: { type: Number, index: true, default: null },
    birthDay: { type: Number, index: true, default: null },
    workAnniversaryMonth: { type: Number, index: true, default: null },
    workAnniversaryDay: { type: Number, index: true, default: null },
    workAnniversaryYear: { type: Number, index: true, default: null },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { collection: 'users', timestamps: true },
);

schema.method('getNextBirthDate', function getNextBirthDate(): DateTime | undefined {
  return datetime.getNextBirthDate(this.birthMonth, this.birthDay);
});
schema.method('getWorkAnniversaryDate', function getWorkAnniversaryDate(): DateTime | undefined {
  return datetime.getWorkAnniversaryDate(this.workAnniversaryMonth, this.workAnniversaryDay, this.workAnniversaryYear);
});

export default mongoose.model<UserDocType, Model<UserDocType, {}, UserMethods>>('User', schema);
