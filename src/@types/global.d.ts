import type { DateTime } from 'luxon';
import type { Document, HydratedDocument, SortOrder, Types } from 'mongoose';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs, ViewStateValue } from '@slack/bolt';
import type {
  ConversationsListResponse,
  ConversationsMembersResponse,
  UsersConversationsResponse,
  UsersListResponse,
} from '@slack/web-api';
import type { Channel as SlackChannel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { Member as SlackMember } from '@slack/web-api/dist/response/UsersListResponse';
import type { SlackClientError } from '@errors';

/** Clients Types */
// slack
export type SlackError = { error?: SlackClientError };
export type SlackClientGetConversationsListResult = { response?: ConversationsListResponse } & SlackError;
export type SlackClientGetConversationsMembersResult = { response?: ConversationsMembersResponse } & SlackError;
export type SlackClientGetUsersConversationsResult = { response?: UsersConversationsResponse } & SlackError;
export type SlackClientGetUsersListResult = { response?: UsersListResponse } & SlackError;

/** Controllers Types */
// event
export type AppHomeOpenedArgs = SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs;
export type AppMentionArgs = SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs;
export type MemberJoinedChannelArgs = SlackEventMiddlewareArgs<'member_joined_channel'> & AllMiddlewareArgs;
export type MemberLeftChannelArgs = SlackEventMiddlewareArgs<'member_left_channel'> & AllMiddlewareArgs;

/** Db Types */
export type DocId = { _id: Types.ObjectId };
export type DocTimestamps = { createdAt: Date; updatedAt: Date };

// Channel
export type ChannelData = {
  channelId: string;
  name?: string;
  isArchived?: boolean;
  isMember?: boolean;
  isPrivate?: boolean;
  numMembers?: number;
  memberIds?: string[];
};
export type ChannelMethods = {};
export type ChannelDocType = ChannelData & ChannelMethods & DocId & DocTimestamps;
export type ChannelDocument = Document<Types.ObjectId, {}, ChannelDocType>;
export type ChannelHydratedDocument = HydratedDocument<ChannelDocType>;
export type Channel = ChannelDocType & ChannelDocument & ChannelHydratedDocument;

// User
export type UserData = {
  userId: string;
  teamId?: string;
  name?: string;
  realName?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  tz?: string;
  isAdmin?: boolean;
  isAppUser?: boolean;
  isBot?: boolean;
  isDeleted?: boolean;
  isEmailConfirmed?: boolean;
  isOwner?: boolean;
  isPrimaryOwner?: boolean;
  isRestricted?: boolean;
  isUltraRestricted?: boolean;
  birthday?: string;
  birthdayLookup?: string;
  workAnniversary?: string;
  workAnniversaryLookup?: string;
  channelIds?: string[];
};
export type UserMethods = {
  getBirthdayDate: () => DateTime | undefined;
  getWorkAnniversaryDate: () => DateTime | undefined;
};
export type UserDocType = UserData & UserMethods & DocId & DocTimestamps;
export type UserDocument = Document<Types.ObjectId, {}, UserDocType>;
export type UserHydratedDocument = HydratedDocument<UserDocType>;
export type User = UserDocType & UserDocument & UserHydratedDocument;

/** Services Types */
export type BulkWriteResults =
  | {
      ok: number;
      insertedCount: number;
      upsertedCount: number;
      matchedCount: number;
      modifiedCount: number;
      deletedCount: number;
    }
  | undefined;

export type Sort =
  | string
  | { [key: string]: SortOrder | { $meta: 'textScore' } }
  | [string, SortOrder][]
  | undefined
  | null;
export type FindOptions = { batchSize?: number; limit?: number; sort?: Sort };

// action
export type ManageUserDatesResult = { user: User | null };

// event
export type AppHomeOpenedResult = { user: User | null };
export type MemberJoinedChannelResult = { channel: Channel | null };

// job
export type UpdateChannelsResult = { results: BulkWriteResults | undefined };
export type UpdateUsersResult = { results: BulkWriteResults | undefined };

// slack
export type GetChannelMemberIdsResult = { channelId: string; memberIds: string[] } & SlackError;
export type GetChannelsResult = { channels: SlackChannel[] } & SlackError;
export type GetUsersResult = { users: SlackMember[] } & SlackError;
export type GetUsersConversationsResult = { userId: string; channels: SlackChannel[] } & SlackError;

// view
export type ViewStateValues = { [blockId: string]: { [actionId: string]: ViewStateValue } };
export type SaveUserDatesResult = { user: User | null; hasSaveError: boolean };

/** Utils Types */
// app
export type AppStartResult = { isStarted: boolean };

// config
export type Config = {
  app: { logLevel: string; logOutputFormat: string; nodeEnv: string; port: number; isTsNode: boolean };
  bree: { isDisabled: boolean; jobs: { updateChannelsCron: string; updateUsersCron: string } };
  crypto: { key: string };
  db: { jassbot: { uri: string } };
  slack: { apiHost: string; appToken: string; botToken: string; botUserId: string; logLevel: string };
};

// db
export type DbConnectResult = { isConnected: boolean };
export type DbDisconnectResult = { isDisconnected: boolean };

// logger
export type LogContext = Record<string, unknown>;
export type Logger = {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
};

// scriptHelper
export type GetFakedataPrefixResult = { fakedataPrefix?: string; error?: string };

declare global {}
