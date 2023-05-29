/* istanbul ignore file */
import { model, Schema } from 'mongoose';
import type { ChannelData, ChannelMethods, ChannelModelType } from '@types';

const { Boolean, Date, Number, ObjectId, String } = Schema.Types;

const schema: Schema = new Schema<ChannelData, ChannelModelType, ChannelMethods>(
  {
    _id: { type: ObjectId, index: true, unique: true },
    channelId: { type: String, index: true, unique: true },
    name: { type: String, default: '' },
    isMember: { type: Boolean, index: true, required: true, default: true },
    isPrivate: { type: Boolean, required: true, default: false },
    numMembers: { type: Number, index: true, required: true, default: 0 },
    members: { type: [String], index: true, default: [] },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { collection: 'channels', timestamps: true },
);

export default model<ChannelData, ChannelModelType>('Channel', schema);
