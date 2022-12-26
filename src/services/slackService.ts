import { slackClient } from '../clients';
import logger from '../utils/logger';
import type { ConversationsListArguments } from '@slack/web-api';
import type { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { SlackClientError } from '../errors';

type GetChannelsResult = { channels: Channel[]; error?: SlackClientError };
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
      const { channels: channelsData, response_metadata: responseMetadata } = response;
      const { next_cursor: nextCursor } = responseMetadata || {};

      channels = [...(channelsData?.length ? channelsData : []), ...channels];
      cursor = nextCursor || '';
      hasMore = Boolean(!error && cursor);
    }
  } while (hasMore);
  logger.debug('slackService: getChannels complete', { channelsCount: channels.length, error: clientError });

  return { channels, error: clientError };
};

const getPublicChannels = () => {
  logger.debug('slackService: getPublicChannels called');

  return getChannels({ types: 'public_channel' });
};

const getPrivateChannels = () => {
  logger.debug('slackService: getPrivateChannels called');

  return getChannels({ types: 'private_channel' });
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

  const results = await Promise.allSettled([getPublicChannels(), getPrivateChannels()]);
  const { channels: publicChannels, error: publicChannelsError } = processResult(results[0]);
  const { channels: privateChannels, error: privateChannelsError } = processResult(results[1]);

  return { publicChannels, publicChannelsError, privateChannels, privateChannelsError };
};

export default { getChannels, getPublicChannels, getPrivateChannels, getAllChannels };
