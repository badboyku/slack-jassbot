import { slackClient } from '../clients';
import logger from '../utils/logger';
import type {
  ConversationsListArguments,
  ConversationsListResponse,
  ConversationsMembersArguments,
  ConversationsMembersResponse,
} from '@slack/web-api';
import type { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { SlackClientError } from '../errors';

export type GetChannelsResult = { channels: Channel[]; error?: SlackClientError };
const getChannels = async (args?: ConversationsListArguments): Promise<GetChannelsResult> => {
  logger.debug('slackService: getChannels called', { args });
  let channels: Channel[] = [];
  let clientError: SlackClientError | undefined;
  let hasMore = false;
  let cursor;

  do {
    const options: ConversationsListArguments = { ...args, limit: 200, cursor, exclude_archived: false };
    // eslint-disable-next-line no-await-in-loop
    const { response, error } = await slackClient.getConversationsList(options);

    if (error) {
      clientError = error;
      hasMore = false;
    }

    if (response) {
      const { channels: channelsData, response_metadata: responseMetadata } = response as ConversationsListResponse;
      const { next_cursor: nextCursor } = responseMetadata || {};

      channels = [...(channelsData?.length ? channelsData : []), ...channels];
      cursor = nextCursor || '';
      hasMore = Boolean(!error && cursor);
    }
  } while (hasMore);
  logger.debug('slackService: getChannels complete', { args, channelsCount: channels.length, error: clientError });

  return { channels, error: clientError };
};

const getPublicChannels = () => getChannels({ types: 'public_channel' });
const getPrivateChannels = () => getChannels({ types: 'private_channel' });

export type GetAllChannelsResult = {
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

  const results = await Promise.allSettled([getPublicChannels(), getPrivateChannels()]);
  const { channels: publicChannels, error: publicChannelsError } = processResult(results[0]);
  const { channels: privateChannels, error: privateChannelsError } = processResult(results[1]);

  return { publicChannels, publicChannelsError, privateChannels, privateChannelsError };
};

export type GetChannelMembersResult = { channel: string; members: string[]; error?: SlackClientError };
const getChannelMembers = async (channel: string): Promise<GetChannelMembersResult> => {
  logger.debug('slackService: getChannelMembers called', { channel });
  let members: string[] = [];
  let clientError: SlackClientError | undefined;
  let hasMore = false;
  let cursor;

  do {
    const options: ConversationsMembersArguments = { channel, limit: 200, cursor };
    // eslint-disable-next-line no-await-in-loop
    const { response, error } = await slackClient.getConversationsMembers(options);

    if (error) {
      clientError = error;
      hasMore = false;
    }

    if (response) {
      const { members: membersData, response_metadata: responseMetadata } = response as ConversationsMembersResponse;
      const { next_cursor: nextCursor } = responseMetadata || {};

      members = [...(membersData?.length ? membersData : []), ...members];
      cursor = nextCursor || '';
      hasMore = Boolean(!error && cursor);
    }
  } while (hasMore);
  logger.debug('slackService: getChannelMembers complete', {
    channel,
    membersCount: members.length,
    error: clientError,
  });

  return { channel, members, error: clientError };
};

export type GetAllChannelMembersResult = {
  channels: Channel[];
  channelsMembers: { [id: string]: string[] };
  errors?: SlackClientError[];
};
const getAllChannelsMembers = async (): Promise<GetAllChannelMembersResult> => {
  logger.debug('slackService: getAllChannelsMembers called');
  const channelsMembers: { [id: string]: string[] } = {};
  const errors: SlackClientError[] = [];

  const { publicChannels, publicChannelsError, privateChannels, privateChannelsError } = await getAllChannels();
  const channels = [...publicChannels, ...privateChannels];
  if (publicChannelsError) {
    errors.push(publicChannelsError);
  }
  if (privateChannelsError) {
    errors.push(privateChannelsError);
  }

  const processResult = (result: PromiseSettledResult<GetChannelMembersResult>) => {
    let channel = '';
    let members: string[] = [];
    let error: SlackClientError | undefined;

    const { status } = result;
    if (status === 'fulfilled') {
      const { value } = result as PromiseFulfilledResult<GetChannelMembersResult>;
      const { channel: channelValue, members: membersValue, error: errorValue } = value;

      channel = channelValue;
      members = membersValue;
      error = errorValue;
    } else if (status === 'rejected') {
      const { reason } = result as PromiseRejectedResult;

      error = reason;
    }

    return { channel, members, error };
  };

  const channelMembersPromises: Promise<GetChannelMembersResult>[] = [];
  channels.forEach((channel) => {
    const { id = '', num_members: numMembers = 0 } = channel;
    channelsMembers[id] = [];

    if (numMembers > 0) {
      channelMembersPromises.push(getChannelMembers(id));
    }
  });

  const results = await Promise.allSettled(channelMembersPromises);
  results.forEach((result) => {
    const { channel, members, error } = processResult(result);

    if (channel) {
      channelsMembers[channel] = members;
    }
    if (error) {
      errors.push(error);
    }
  });

  return { channels, channelsMembers, errors };
};

export default {
  getChannels,
  getPublicChannels,
  getPrivateChannels,
  getAllChannels,
  getChannelMembers,
  getAllChannelsMembers,
};
