/* istanbul ignore file */
import { model } from '@db/models/modelHelper';
import type { Channel } from '@types';

const ChannelModel = model<Channel>({
  addTimestamps: true,
  collectionName: 'channel',
  defaults: {
    name: '',
    isArchived: false,
    isMember: false,
    isPrivate: false,
    numMembers: 0,
    memberIds: [],
  },
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        channelId: { bsonType: 'string' },
        name: { bsonType: 'string' },
        isArchived: { bsonType: 'bool' },
        isMember: { bsonType: 'bool' },
        isPrivate: { bsonType: 'bool' },
        numMembers: { bsonType: 'number' },
        memberIds: { bsonType: 'array' },
        createdAt: { bsonType: 'date' },
        updatedAt: { bsonType: 'date' },
        deletedAt: { bsonType: ['date', 'null'] },
      },
      required: ['channelId'],
    },
  },
});

// Add custom methods.
ChannelModel.options.methods = {};

export default ChannelModel;
