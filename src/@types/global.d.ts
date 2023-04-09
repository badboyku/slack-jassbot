import type { DateTime } from 'luxon';
import type { Document, SortOrder, Types } from 'mongoose';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs, ViewStateValue } from '@slack/bolt';
import type { ConversationsListResponse, ConversationsMembersResponse } from '@slack/web-api';
import type { Channel as SlackChannel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type { SlackClientError } from '@errors';

/** Clients Types */
// slack
export type SlackClientGetConversationListResult = { response?: ConversationsListResponse; error?: SlackClientError };
export type SlackClientGetConversationsMembersResult = {
  response?: ConversationsMembersResponse;
  error?: SlackClientError;
};

/** Controllers Types */
// event
export type AppHomeOpenedArgs = SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs;
export type AppMentionArgs = SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs;
export type MemberJoinedChannelArgs = SlackEventMiddlewareArgs<'member_joined_channel'> & AllMiddlewareArgs;
export type MemberLeftChannelArgs = SlackEventMiddlewareArgs<'member_left_channel'> & AllMiddlewareArgs;

/** Db Types */
export type DocType = { createdAt: Date; updatedAt: Date };

// Channel
export type ChannelData = {
  channelId?: string;
  isMember?: boolean;
  isPrivate?: boolean;
  numMembers?: number;
  members?: string[];
};
export type ChannelDocType = ChannelData & DocType;
export type ChannelMethods = {};
export type Channel =
  | (ChannelDocType & Document<{}, {}, ChannelDocType> & ChannelMethods & { _id: Types.ObjectId })
  | null;

// User
export type UserData = {
  userId?: string;
  birthday?: string;
  birthdayLookup?: string;
  birthdayRaw?: string; // TODO: REMOVE THIS!!!
  birthdayRawLookup?: string; // TODO: REMOVE THIS!!!
  workAnniversary?: string;
  workAnniversaryLookup?: string;
  workAnniversaryRaw?: string; // TODO: REMOVE THIS!!!
  workAnniversaryRawLookup?: string; // TODO: REMOVE THIS!!!
};
export type UserDocType = UserData & DocType;
export type UserMethods = {
  getBirthdayDate: () => DateTime | undefined;
  getWorkAnniversaryDate: () => DateTime | undefined;
};
export type User = (UserDocType & Document<{}, {}, UserDocType> & UserMethods & { _id: Types.ObjectId }) | null;

/** Services Types */
export type BulkWriteResults =
  | { ok: number; nInserted: number; nUpserted: number; nMatched: number; nModified: number; nRemoved: number }
  | undefined;

export type Sort =
  | string
  | { [key: string]: SortOrder | { $meta: 'textScore' } }
  | [string, SortOrder][]
  | undefined
  | null;
export type FindOptions = { batchSize?: number; limit?: number; sort?: Sort };

// action
export type ManageUserDatesResult = { user: User };

// event
export type AppHomeOpenedResult = { user: User };
export type MemberJoinedChannelResult = { channel: Channel };

// job
export type UpdateChannelsResult = { results: BulkWriteResults | undefined };

// slack
export type GetChannelMembersResult = { channelId: string; members: string[]; error?: SlackClientError };
export type GetChannelsResult = { channels: SlackChannel[]; error?: SlackClientError };

// view
export type ViewStateValues = { [blockId: string]: { [actionId: string]: ViewStateValue } };
export type SaveUserDatesResult = { user: User; hasSaveError: boolean };

/** Utils Types */
// app
export type AppStartResult = { isStarted: boolean };

// config
export type Config = {
  app: { logLevel: string; logOutputFormat: string; nodeEnv: string; port: number; isTsNode: boolean };
  bree: { isDisabled: boolean; jobs: { updateChannelsCron: string } };
  crypto: { key: string };
  db: { uri: string };
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

declare global {}
