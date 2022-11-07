import mongoose, {Document, Model, Schema, Types} from 'mongoose';

export type UserDocType = {
  userId: string;
  birthMonth: number | null;
  birthDay: number | null;
  workAnniversaryDate: Date | null;
};
type UserDocument = Document<{}, {}, UserDocType>;
type UserMethods = {};
type UserModel = Model<UserDocType, {}, UserMethods>;
export type User = (UserDocument & UserDocType & { _id: Types.ObjectId }) | null;

const schema = new Schema<UserDocType, UserModel, UserMethods>(
  {
    userId: { type: String, index: true, unique: true },
    birthMonth: { type: Number, index: true, default: null },
    birthDay: { type: Number, index: true, default: null },
    workAnniversaryDate: { type: Date, index: true, default: null },
  },
  { collection: 'users', timestamps: true },
);

export default mongoose.model<UserDocType, UserModel>('User', schema);
