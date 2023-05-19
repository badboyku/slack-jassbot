import { slackClient } from '@clients';
import { SLACK_GET_LIMIT_DEFAULT } from '@utils/constants';
import type { ConversationsListArguments, ConversationsMembersArguments } from '@slack/web-api';
import type { Channel as SlackChannel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { SlackClientError } from '@errors';
import type { GetChannelMembersResult, GetChannelsResult } from '@types';

const getChannelMembers = async (channelId: string): Promise<GetChannelMembersResult> => {
  let members: string[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: ConversationsMembersArguments = { channel: channelId, limit: SLACK_GET_LIMIT_DEFAULT, cursor };
    // eslint-disable-next-line no-await-in-loop
    const { response, error: clientError } = await slackClient.getConversationsMembers(options);

    if (clientError) {
      error = clientError;
    }

    if (response) {
      const { members: data, response_metadata: responseMetadata } = response;
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

const getChannels = async (args?: ConversationsListArguments): Promise<GetChannelsResult> => {
  let channels: SlackChannel[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: ConversationsListArguments = {
      ...args,
      limit: SLACK_GET_LIMIT_DEFAULT,
      cursor,
      exclude_archived: false,
    };
    // eslint-disable-next-line no-await-in-loop
    const { response, error: clientError } = await slackClient.getConversationsList(options);

    if (clientError) {
      error = clientError;
    }

    if (response) {
      const { channels: data, response_metadata: responseMetadata } = response;
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
