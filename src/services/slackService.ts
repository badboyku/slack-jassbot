import { slackClient } from '../clients';
import type {
  ConversationsListArguments,
  ConversationsListResponse,
  ConversationsMembersArguments,
  ConversationsMembersResponse,
} from '@slack/web-api';
import type { Channel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { SlackClientError } from '../errors';

const defaultLimit = 1000;

export type GetChannelMembersResult = { channelId: string; members: string[]; error?: SlackClientError };
const getChannelMembers = async (channelId: string): Promise<GetChannelMembersResult> => {
  let members: string[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: ConversationsMembersArguments = { channel: channelId, limit: defaultLimit, cursor };
    // eslint-disable-next-line no-await-in-loop
    const { response, error: clientError } = await slackClient.getConversationsMembers(options);

    if (clientError) {
      error = clientError;
    }

    if (response) {
      const { members: data, response_metadata: responseMetadata } = response as ConversationsMembersResponse;
      const { next_cursor: nextCursor } = responseMetadata || {};

      if (data?.length) {
        members = [...members, ...data];
      }

      cursor = nextCursor || '';
    }

    hasMore = error ? false : cursor.length > 0;
  } while (hasMore);

  return { channelId, members, error };
};

export type GetChannelsResult = { channels: Channel[]; error?: SlackClientError };
const getChannels = async (args?: ConversationsListArguments): Promise<GetChannelsResult> => {
  let channels: Channel[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: ConversationsListArguments = { ...args, limit: defaultLimit, cursor, exclude_archived: false };
    // eslint-disable-next-line no-await-in-loop
    const { response, error: clientError } = await slackClient.getConversationsList(options);

    if (clientError) {
      error = clientError;
    }

    if (response) {
      const { channels: data, response_metadata: responseMetadata } = response as ConversationsListResponse;
      const { next_cursor: nextCursor } = responseMetadata || {};

      if (data?.length) {
        channels = [...channels, ...data];
      }

      cursor = nextCursor || '';
    }

    hasMore = error ? false : cursor.length > 0;
  } while (hasMore);

  return { channels, error };
};

export default { getChannelMembers, getChannels };
