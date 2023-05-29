import { Model } from 'mongoose';
import type { Document, SortOrder, Types } from 'mongoose';
import type { DateTime } from 'luxon';
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

// Channel
export type ChannelData = {
  _id?: Types.ObjectId;
  channelId?: string;
  name?: string;
  isMember?: boolean;
  isPrivate?: boolean;
  numMembers?: number;
  members?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type ChannelMethods = {};
export type ChannelModelType = Model<ChannelData, {}, ChannelMethods>;
export type ChannelDocType = ChannelData & ChannelMethods;
export type ChannelDocument = Document<Types.ObjectId, {}, ChannelDocType>;
export type Channel = (ChannelDocType & ChannelDocument) | null;

// User
export type UserData = {
  _id?: Types.ObjectId;
  userId?: string;
  birthday?: string;
  birthdayLookup?: string;
  workAnniversary?: string;
  workAnniversaryLookup?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
export type UserMethods = {
  getBirthdayDate: () => DateTime | undefined;
  getWorkAnniversaryDate: () => DateTime | undefined;
};
export type UserModelType = Model<UserData, {}, UserMethods>;
export type UserDocType = UserData & UserMethods;
export type UserDocument = Document<Types.ObjectId, {}, UserDocType>;
export type User = (UserDocType & UserDocument) | null;

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
