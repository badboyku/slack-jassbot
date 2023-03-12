import logger from '../utils/logger';
import channelService from './channelService';
import slackService from './slackService';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { BulkWriteResults } from '../@types/global';
import type { ChannelDocType } from '../db/models/ChannelModel';

// import { MongoClient } from 'mongodb';
//
// /*
//  * Requires the MongoDB Node.js Driver
//  * https://mongodb.github.io/node-mongodb-native
//  */
//
// const agg = [
//   {
//     '$match': {
//       'birthMonth': 1,
//       'birthDay': 20
//     }
//   }, {
//     '$lookup': {
//       'from': 'channels',
//       'localField': 'userId',
//       'foreignField': 'members',
//       'as': 'channels'
//     }
//   }
// ];
//
// const client = await MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
// const coll = client.db('jassbot').collection('users');
// const cursor = coll.aggregate(agg);
// const result = await cursor.toArray();
// await client.close();

const findTomorrowsBirthdays = () => {
  logger.debug('breeService: findTomorrowsBirthdays called');

  // const
  //
  // const filters = { birthdayShort: crypto.encrypt('foo') };
  // const users = userService.findUsers(filters);

  /**
   * [
   *   {
   *     '$match': {
   *       'birthMonth': 1,
   *       'birthDay': 20
   *     }
   *   }, {
   *     '$lookup': {
   *       'from': 'channels',
   *       'localField': 'userId',
   *       'foreignField': 'members',
   *       'as': 'channels'
   *     }
   *   }
   * ]
   */
};

const updateChannels = async (): Promise<{ results: BulkWriteResults | undefined }> => {
  logger.debug('breeService: updateChannels called');

  const ops: AnyBulkWriteOperation<ChannelDocType>[] = [];
  const { channels, channelsMembers } = await slackService.getAllChannelsMembers();

  channels.forEach((channel) => {
    const { id, is_member: isMember, is_private: isPrivate, num_members: numMembers } = channel;
    const filter = { channelId: id };
    const update = { $set: { isMember, isPrivate, numMembers, members: channelsMembers[id as string] } };
    ops.push({ updateOne: { filter, update, upsert: true } });
  });

  const results = await channelService.bulkWrite(ops);

  return { results };
};

export default { findTomorrowsBirthdays, updateChannels };
