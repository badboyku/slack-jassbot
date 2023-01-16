import mongoose, { Schema } from 'mongoose';
import type { Document, Model, Types } from 'mongoose';

export type ChannelDocType = {
  channelId: string;
  inviterId: string | null;
  isMember: boolean;
  isPrivate: boolean;
  numMembers: number;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
};
export type ChannelMethods = {};
export type Channel =
  | (ChannelDocType & Document<{}, {}, ChannelDocType> & ChannelMethods & { _id: Types.ObjectId })
  | null;

const schema = new Schema<ChannelDocType, Model<ChannelDocType, {}, ChannelMethods>, ChannelMethods>(
  {
    channelId: { type: String, index: true, unique: true },
    inviterId: { type: String, default: null },
    isMember: { type: Boolean, required: true, default: true },
    isPrivate: { type: Boolean, required: true, default: false },
    numMembers: { type: Number, required: true, default: 0 },
    members: { type: [String], default: [] },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { collection: 'channels', timestamps: true },
);

export default mongoose.model<ChannelDocType, Model<ChannelDocType, {}, ChannelMethods>>('Channel', schema);
