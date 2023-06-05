import { slackClient } from '@clients';
import { SLACK_GET_LIMIT_DEFAULT } from '@utils/constants';
import type {
  ConversationsListArguments,
  ConversationsMembersArguments,
  UsersConversationsArguments,
  UsersListArguments,
} from '@slack/web-api';
import type { Channel as SlackChannel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { Member as SlackMember } from '@slack/web-api/dist/response/UsersListResponse';
import type { SlackClientError } from '@errors';
import type { GetChannelMemberIdsResult, GetChannelsResult, GetUsersConversationsResult, GetUsersResult } from '@types';

const getChannelMembers = async (channelId: string): Promise<GetChannelMemberIdsResult> => {
  let memberIds: string[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: ConversationsMembersArguments = { channel: channelId, cursor, limit: SLACK_GET_LIMIT_DEFAULT };
    // eslint-disable-next-line no-await-in-loop
    const { response, error: clientError } = await slackClient.getConversationsMembers(options);

    if (clientError) {
      error = clientError;
    }

    if (response) {
      const { members: data, response_metadata: responseMetadata } = response;
      const { next_cursor: nextCursor } = responseMetadata || {};

      if (data?.length) {
        memberIds = [...memberIds, ...data];
      }

      cursor = nextCursor || '';
    }

    hasMore = error ? false : cursor.length > 0;
  } while (hasMore);

  return { channelId, memberIds, error };
};

const getChannels = async (args?: ConversationsListArguments): Promise<GetChannelsResult> => {
  let channels: SlackChannel[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: ConversationsListArguments = { ...args, cursor, limit: SLACK_GET_LIMIT_DEFAULT };
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

const getUsers = async (args?: UsersListArguments): Promise<GetUsersResult> => {
  let users: SlackMember[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: UsersListArguments = { ...args, cursor, limit: SLACK_GET_LIMIT_DEFAULT };
    // eslint-disable-next-line no-await-in-loop
    const { response, error: clientError } = await slackClient.getUsersList(options);

    if (clientError) {
      error = clientError;
    }

    if (response) {
      const { members: data, response_metadata: responseMetadata } = response;
      const { next_cursor: nextCursor } = responseMetadata || {};

      if (data?.length) {
        users = [...users, ...data];
      }

      cursor = nextCursor || '';
    }

    hasMore = error ? false : cursor.length > 0;
  } while (hasMore);

  return { users, error };
};

const getUsersConversations = async (args?: UsersConversationsArguments): Promise<GetUsersConversationsResult> => {
  let channels: SlackChannel[] = [];
  let error: SlackClientError | undefined;
  let cursor = '';
  let hasMore = false;

  do {
    const options: UsersConversationsArguments = { ...args, cursor, limit: SLACK_GET_LIMIT_DEFAULT };
    // eslint-disable-next-line no-await-in-loop
    const { response, error: clientError } = await slackClient.getUsersConversations(options);

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

  return { userId: args?.user || '', channels, error };
};

export default { getChannelMembers, getChannels, getUsers, getUsersConversations };
