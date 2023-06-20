import type { DateTime } from 'luxon';
import type { Document, HydratedDocument, SortOrder, Types } from 'mongoose';
import type {
  BSON,
  BulkWriteResult,
  DeleteResult,
  Document as MongoDbDocument,
  InsertOneResult,
  ModifyResult,
  MongoBulkWriteError,
  MongoError,
  MongoServerError,
} from 'mongodb';
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
// models
export type DocIdOld = { _id: Types.ObjectId };
export type DocId = { _id: BSON.ObjectId };
export type DocTimestamps = { createdAt: Date; updatedAt: Date };

// channel
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
export type ChannelDocType = ChannelData & ChannelMethods & DocIdOld & DocTimestamps;
export type ChannelDocument = Document<Types.ObjectId, {}, ChannelDocType>;
export type ChannelHydratedDocument = HydratedDocument<ChannelDocType>;
export type Channel = ChannelDocType & ChannelDocument & ChannelHydratedDocument;

// user
export type UserParamsOld = {
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
export type UserDataOld = { userId: string } & UserParamsOld;
export type UserMethods = {
  getBirthdayDate: () => DateTime | undefined;
  getWorkAnniversaryDate: () => DateTime | undefined;
};
export type UserDocType = UserDataOld & UserMethods & DocIdOld & DocTimestamps;
export type UserDocumentOld = Document<Types.ObjectId, {}, UserDocType>;
export type UserHydratedDocument = HydratedDocument<UserDocType>;
export type UserOld = UserDocType & UserDocumentOld & UserHydratedDocument;

export type UserData = {
  _id?: BSON.ObjectId;
  userId?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
};
export type UserWithId = { userId: string } & UserData & DocId & DocTimestamps;
export type UserModel = UserWithId & UserMethods;
export type UserModelDoc = MongoDbDocument<UserModel>;

// sources
export type DbConnectResult = { isConnected: boolean };
export type DbCloseResult = { isClosed: boolean };
export type DbDisconnectResult = { isDisconnected: boolean };

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
export type FindOptionsOld = { batchSize?: number; limit?: number; sort?: Sort };

// action
export type ManageUserDatesResult = { user?: UserModel };

// event
export type AppHomeOpenedResult = { user?: UserModel };
export type MemberJoinedChannelResult = { channel: Channel | null };

// job
export type UpdateChannelsResult = { results: BulkWriteResults | undefined };
export type UpdateUsersResult = { results: BulkWrite };

// slack
export type GetChannelMemberIdsResult = { channelId: string; memberIds: string[] } & SlackError;
export type GetChannelsResult = { channels: SlackChannel[] } & SlackError;
export type GetUsersResult = { users: SlackMember[] } & SlackError;
export type GetUsersConversationsResult = { userId: string; channels: SlackChannel[] } & SlackError;

// view
export type ViewStateValues = { [blockId: string]: { [actionId: string]: ViewStateValue } };
export type SaveUserDatesResult = { user?: UserModel; hasSaveError: boolean };

/** Utils Types */
// app
export type AppStartResult = { isStarted: boolean };

// config
export type Config = {
  app: {
    isTsNode: boolean;
    logLevel: string;
    logOutputFormat: string;
    name: string;
    nodeEnv: string;
    port: number;
    version: string;
  };
  bree: { isDisabled: boolean; jobs: { updateChannelsCron: string; updateUsersCron: string } };
  crypto: { key: string };
  db: { jassbot: { uri: string } };
  slack: { apiHost: string; appToken: string; botToken: string; botUserId: string; logLevel: string };
};

// mongodb
export type BulkWrite = { result?: BulkWriteResult; error?: MongoBulkWriteError };
export type DeleteMany = { result?: DeleteResult; error?: MongoError };
export type FindOne = { result?: MongoDbDocument | null; error?: MongoError };
export type FindOneAndUpdate = {
  doc?: MongoDbDocument<DocId>;
  result?: ModifyResult<MongoDbDocument>;
  error?: MongoServerError;
};
export type FindParams = { after?: string; before?: string; limit?: number; sort?: string };
export type InsertOne = {
  doc?: MongoDbDocument<DocId>;
  result?: InsertOneResult<MongoDbDocument>;
  error?: MongoServerError;
};

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
