/* istanbul ignore file */
import type { ChannelDoc, ChannelMongoModel } from '@types';

const model = (): ChannelMongoModel => ({
  addTimestamps() {
    return true;
  },

  getCollName() {
    return 'channel';
  },

  getDefaults() {
    return {
      name: '',
      isArchived: false,
      isMember: false,
      isPrivate: false,
      numMembers: 0,
      memberIds: [],
    };
  },

  getModel(d: ChannelDoc) {
    return {
      ...d,

      // Custom Methods.
    };
  },

  getValidator() {
    return {
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
          deletedAt: { bsonType: ['null', 'date'] },
        },
        required: ['channelId'],
      },
    };
  },
});

export default model();
