import process from 'node:process';

export default {
  app: {
    logLevel: process.env.APP_LOG_LEVEL?.toUpperCase() || 'INFO',
    logOutputFormat: process.env.APP_LOG_OUTPUT_FORMAT?.toUpperCase() || 'ELK',
    nodeEnv: process.env.NODE_ENV?.toUpperCase() || '',
    port: Number(process.env.APP_PORT) || 3000,
    isTsNode: process.env.TS_NODE?.toLowerCase() === 'true' || false,
  },
  bree: {
    isDisabled: process.env.BREE_DISABLE?.toLowerCase() === 'true' || false,
    jobs: {
      updateMemberChannelsCron: process.env.BREE_JOBS_UPDATE_MEMBER_CHANNELS_CRON || '',
    },
  },
  db: {
    uri: process.env.DB_URI || '',
  },
  slack: {
    apiHost: process.env.SLACK_API_HOST || '',
    appToken: process.env.SLACK_APP_TOKEN || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    botUserId: process.env.SLACK_BOT_USER_ID || '',
    logLevel: process.env.SLACK_LOG_LEVEL?.toUpperCase() || 'INFO',
  },
};
