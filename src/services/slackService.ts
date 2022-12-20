import { slackClient } from '../clients';
import logger from '../utils/logger';
import channelService from './channelService';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { ConversationsListArguments } from '@slack/web-api';
import type { ChannelDocType } from '../db/models/ChannelModel';
import type { SlackClientError } from '../errors';

type GetChannelsResult = { channels: Channel[]; error?: SlackClientError };
const getChannels = async (args?: ConversationsListArguments): Promise<GetChannelsResult> => {
  logger.debug('slackService: getChannels called', { args });
  let channelsList: Channel[] = [];
  let clientError: SlackClientError | undefined;
  let hasMore = false;
  let nextCursor;

  do {
    const options: ConversationsListArguments = { ...args, limit: 200, cursor: nextCursor, exclude_archived: false };
    const { response, error } = await slackClient.getConversationsList(options);

    if (error) {
      clientError = error;
      hasMore = false;
    }

    if (response) {
      const { channels: channelsData, response_metadata: responseMetadata } = response;

      const channels = channelsData || [];
      channelsList = channels.length ? [...channelsList, ...channels] : channelsList;

      const { next_cursor: cursor } = responseMetadata || {};
      nextCursor = cursor || '';

      hasMore = Boolean(!error && nextCursor);
    }
  } while (hasMore);

  return { channels: channelsList, error: clientError };
};

type GetAllChannelsResult = {
  publicChannels: Channel[];
  publicChannelsError?: SlackClientError;
  privateChannels: Channel[];
  privateChannelsError?: SlackClientError;
};
const getAllChannels = async (): Promise<GetAllChannelsResult> => {
  logger.debug('slackService: getAllChannels called');

  const processResult = (result: PromiseSettledResult<GetChannelsResult>) => {
    let channels: Channel[] = [];
    let error: SlackClientError | undefined;

    const { status } = result;
    if (status === 'fulfilled') {
      const { value } = result as PromiseFulfilledResult<GetChannelsResult>;
      const { channels: channelsValue, error: errorValue } = value;
      channels = channelsValue;
      error = errorValue;
    } else if (status === 'rejected') {
      const { reason } = result as PromiseRejectedResult;
      error = reason;
    }

    return { channels, error };
  };

  const results = await Promise.allSettled([
    getChannels({ types: 'public_channel' }),
    getChannels({ types: 'private_channel' }),
  ]);

  const { channels: publicChannels, error: publicChannelsError } = processResult(results[0]);
  const { channels: privateChannels, error: privateChannelsError } = processResult(results[1]);

  return { publicChannels, publicChannelsError, privateChannels, privateChannelsError };
};

type CheckChannelsResult = { complete: true };
const checkChannels = async (): Promise<CheckChannelsResult> => {
  logger.debug('slackService: checkChannels called');

  const { publicChannels, privateChannels } = await getAllChannels();
  logger.debug('slackService: getAllChannels complete', {
    publicChannelsCount: publicChannels.length,
    privateChannelsCount: privateChannels.length,
  });

  const ops: AnyBulkWriteOperation<ChannelDocType>[] = [];
  [publicChannels, privateChannels].forEach((channels) => {
    channels.forEach((channel) => {
      const { id, is_member: isMember, is_private: isPrivate } = channel;
      const filter = { channelId: id };
      const update = { $set: { isPrivate, isMember } };

      ops.push({ updateOne: { filter, update, upsert: true } });
    });
  });

  const results = await channelService.bulkWriteChannels(ops);
  logger.debug('bulkWriteChannels', { results });

  return { complete: true };
};

export default { checkChannels, getAllChannels, getChannels };
