import type {
  BSON,
  BulkWriteResult,
  DeleteResult,
  Document,
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
// Models
export type MongoModelOptions<T extends Document> = {
  addTimestamps?: boolean;
  collectionName: string;
  defaults?: Partial<T>;
  methods?: Document;
  validateBeforeSave?: boolean;
  validator?: Document;
};
export type MongoModel<T extends Document> = {
  addTimestamps: () => boolean;
  getCollectionName: () => string;
  getDefaults: () => Partial<T> | undefined;
  getModel: (d: Partial<T>) => T & MongoModelOptions<T>['methods'];
  getValidator: () => Document | undefined;
  options: MongoModelOptions<T>;
};
export type MongoId = { _id: BSON.ObjectId };
export type MongoTimestamps = { createdAt: Date; updatedAt: Date; deletedAt?: Date | null };

// Channel
export type Channel = {
  channelId: string;
  name?: string;
  isArchived?: boolean;
  isMember?: boolean;
  isPrivate?: boolean;
  numMembers?: number;
  memberIds?: string[];
} & MongoId &
  MongoTimestamps;
// export type ChannelData = Partial<Channel>;
// export type ChannelDoc = Document<Channel>;
// export type ChannelMethods = {};
// export type ChannelModel = Channel & ChannelMethods;
// export type ChannelMongoModel = {
//   getDefaults: () => ChannelData;
//   getModel: (d: ChannelDoc) => ChannelModel;
// } & MongoModel;

// User
export type User = {
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
} & MongoId &
  MongoTimestamps;
// export type UserData = Partial<User>;
// export type UserDoc = Document<User>;
// export type UserMethods = {
//   getBirthdayDate: () => DateTime | undefined;
//   getWorkAnniversaryDate: () => DateTime | undefined;
// };
// export type UserModel = User & UserMethods;
// export type UserMongoModel = {
//   getDefaults: () => UserData;
//   getModel: (d: UserDoc) => UserModel;
// } & MongoModel;

// sources
export type DbConnectResult = { isConnected: boolean };
export type DbCloseResult = { isClosed: boolean };

/** Services Types */
// action
export type ManageUserDatesResult = { user?: User };

// event
export type AppHomeOpenedResult = { user?: User };
export type MemberJoinedChannelResult = { channel: ChannelModel | undefined };

// job
export type UpdateChannelsResult = { results: BulkWriteResults | undefined };
export type UpdateUsersResult = { results: BulkWrite };

// slack
export type GetChannelMemberIdsResult = { channelId: string; memberIds: string[] } & SlackError;
export type GetChannelsResult = { channels: SlackChannel[] } & SlackError;
export type GetUsersResult = { users: SlackMember[] } & SlackError;
export type GetUsersConversationsResult = { userId: string; channels: SlackChannel[] } & SlackError;

// view
export type SaveUserDatesResult = { user?: User; hasSaveError: boolean };
export type ViewStateValues = { [blockId: string]: { [actionId: string]: ViewStateValue } };

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
  db: { mongo: { countDocsLimit: number }; jassbot: { uri: string } };
  slack: { apiHost: string; appToken: string; botToken: string; botUserId: string; logLevel: string };
};

// logger
export type LogContext = Record<string, unknown>;
export type Logger = {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
};

// mongodb
export type BulkWrite = { result?: BulkWriteResult; error?: MongoBulkWriteError };
export type DeleteMany = { result?: DeleteResult; error?: MongoError };
export type PageInfo = { endCursor?: string; hasNextPage?: boolean };
export type Find<T extends Document> = { result: T[]; totalCount: number; pageInfo?: PageInfo };
export type FindOne<T extends Document> = { result?: T | null; error?: MongoError };
export type FindOneAndUpdate<T extends Document> = {
  doc?: T;
  result?: ModifyResult<T>;
  error?: MongoServerError;
};
export type FindParams = { after?: string; limit?: number; sortDirection?: string; skip?: number };
export type InsertOne<T extends Document> = { doc?: T; result?: InsertOneResult<T>; error?: MongoServerError };

declare global {}
