import process from 'node:process';
import { LOG_FORMAT_ELK, LOG_LEVEL_INFO } from '@utils/constants';

export type Config = {
  app: { logLevel: string; logOutputFormat: string; nodeEnv: string; port: number; isTsNode: boolean };
  bree: { isDisabled: boolean; jobs: { updateChannelsCron: string } };
  crypto: { key: string };
  db: { uri: string };
  slack: { apiHost: string; appToken: string; botToken: string; botUserId: string; logLevel: string };
};

const config: Config = {
  app: {
    logLevel: process.env.APP_LOG_LEVEL?.toUpperCase() || LOG_LEVEL_INFO,
    logOutputFormat: process.env.APP_LOG_OUTPUT_FORMAT?.toUpperCase() || LOG_FORMAT_ELK,
    nodeEnv: process.env.NODE_ENV?.toUpperCase() || '',
    port: Number(process.env.APP_PORT) || 3000,
    isTsNode: process.env.TS_NODE?.toLowerCase() === 'true' || false,
  },
  bree: {
    isDisabled: process.env.BREE_DISABLE?.toLowerCase() === 'true' || false,
    jobs: {
      updateChannelsCron: process.env.BREE_JOBS_UPDATE_CHANNELS_CRON || '',
    },
  },
  crypto: {
    key: process.env.CRYPTO_KEY || '',
  },
  db: {
    uri: process.env.DB_URI || '',
  },
  slack: {
    apiHost: process.env.SLACK_API_HOST || '',
    appToken: process.env.SLACK_APP_TOKEN || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    botUserId: process.env.SLACK_BOT_USER_ID || '',
    logLevel: process.env.SLACK_LOG_LEVEL?.toUpperCase() || LOG_LEVEL_INFO,
  },
};

export default config;
