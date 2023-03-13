import logger from '../utils/logger';
import channelService from './channelService';
import slackService from './slackService';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { BulkWriteResults } from '../@types/global';
import type { ChannelDocType } from '../db/models/ChannelModel';
import type { GetChannelMembersResult } from './slackService';

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
  logger.debug('jobService: findTomorrowsBirthdays called');

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

type UpdateChannelsResult = { results: BulkWriteResults | undefined };
const updateChannels = async (): Promise<UpdateChannelsResult> => {
  const { channels } = await slackService.getChannels({ types: 'public_channel,private_channel' });

  const channelsMembers: { [channelId: string]: string[] } = {};
  const channelMembersPromises: Promise<GetChannelMembersResult>[] = [];
  channels.forEach((channel) => {
    const { id: channelId = '', num_members: numMembers = 0 } = channel;
    channelsMembers[channelId] = [];

    if (numMembers > 0) {
      channelMembersPromises.push(slackService.getChannelMembers(channelId));
    }
  });

  const processChannelMembersResult = (result: PromiseSettledResult<GetChannelMembersResult>) => {
    let channelId = '';
    let members: string[] = [];

    const { status } = result;
    if (status === 'fulfilled') {
      const { value } = result as PromiseFulfilledResult<GetChannelMembersResult>;
      const { channelId: channelIdValue, members: membersValue } = value;

      channelId = channelIdValue;
      members = membersValue;
    }

    return { channelId, members };
  };

  const channelMembersResult = await Promise.allSettled(channelMembersPromises);
  channelMembersResult.forEach((result) => {
    const { channelId, members } = processChannelMembersResult(result);

    if (channelId) {
      channelsMembers[channelId] = members;
    }
  });

  const ops: AnyBulkWriteOperation<ChannelDocType>[] = [];
  channels.forEach((channel) => {
    const { id: channelId, is_member: isMember, is_private: isPrivate, num_members: numMembers } = channel;
    const filter = { channelId };
    const update = { $set: { isMember, isPrivate, numMembers, members: channelsMembers[channelId as string] } };
    ops.push({ updateOne: { filter, update, upsert: true } });
  });

  const results = await channelService.bulkWrite(ops);

  return { results };
};

export default { findTomorrowsBirthdays, updateChannels };
