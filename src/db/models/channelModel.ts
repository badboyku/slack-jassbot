/* istanbul ignore file */
import { model, Model, Schema } from 'mongoose';
import type { ChannelDocType, ChannelHydratedDocument, ChannelMethods } from '@types';

const { Boolean, Number, String } = Schema.Types;

type ChannelModel = Model<ChannelDocType, {}, ChannelMethods>;
const schema = new Schema<ChannelDocType, ChannelModel, ChannelMethods, {}, {}, {}, {}, ChannelHydratedDocument>(
  {
    channelId: { type: String, unique: true, required: true },
    name: { type: String, required: false, default: '' },
    isArchived: { type: Boolean, index: true, required: false, default: false },
    isMember: { type: Boolean, index: true, required: false, default: false },
    isPrivate: { type: Boolean, required: false, default: false },
    numMembers: { type: Number, index: true, required: false, default: 0 },
    memberIds: { type: [String], index: true, required: false, default: [] },
  },
  { collection: 'channel', timestamps: true },
);

export default model<ChannelDocType, ChannelModel>('Channel', schema);
