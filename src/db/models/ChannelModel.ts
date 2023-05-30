/* istanbul ignore file */
import { model, Model, Schema } from 'mongoose';
import type { ChannelDocType, ChannelHydratedDocument, ChannelMethods } from '@types';

const { Boolean, Number, String } = Schema.Types;

type ChannelModel = Model<ChannelDocType, {}, ChannelMethods>;
const schema = new Schema<ChannelDocType, ChannelModel, ChannelMethods, {}, {}, {}, {}, ChannelHydratedDocument>(
  {
    channelId: { type: String, index: true, unique: true },
    name: { type: String, default: '' },
    isMember: { type: Boolean, index: true, required: true, default: true },
    isPrivate: { type: Boolean, required: true, default: false },
    numMembers: { type: Number, index: true, required: true, default: 0 },
    members: { type: [String], index: true, default: [] },
  },
  { collection: 'channels', timestamps: true },
);

export default model<ChannelDocType, ChannelModel>('Channel', schema);
