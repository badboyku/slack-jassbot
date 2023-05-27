/* istanbul ignore file */
import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';
import type { ChannelDocType, ChannelMethods } from '@types';

const schema: Schema = new Schema<ChannelDocType, Model<ChannelDocType, {}, ChannelMethods>, ChannelMethods>(
  {
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

export default mongoose.model<ChannelDocType, Model<ChannelDocType, {}, ChannelMethods>>('Channel', schema);
