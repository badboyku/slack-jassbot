import process from 'node:process';
import { LOG_FORMATS, LOG_LEVELS } from '@utils/constants';
import type { Config } from '@types';

const config: Config = {
  app: {
    logLevel: process.env.APP_LOG_LEVEL?.toUpperCase() || LOG_LEVELS.INFO,
    logOutputFormat: process.env.APP_LOG_OUTPUT_FORMAT?.toUpperCase() || LOG_FORMATS.ELK,
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
    jassbot: { uri: process.env.DB_JASSBOT_URI || '' },
  },
  slack: {
    apiHost: process.env.SLACK_API_HOST || '',
    appToken: process.env.SLACK_APP_TOKEN || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    botUserId: process.env.SLACK_BOT_USER_ID || '',
    logLevel: process.env.SLACK_LOG_LEVEL?.toUpperCase() || LOG_LEVELS.INFO,
  },
};

export default config;
