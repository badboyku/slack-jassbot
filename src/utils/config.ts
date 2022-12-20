export default {
  app: {
    logLevel: process.env.APP_LOG_LEVEL?.toUpperCase() || 'INFO',
    logOutputFormat: process.env.APP_LOG_OUTPUT_FORMAT?.toUpperCase() || 'ELK',
    nodeEnv: process.env.NODE_ENV?.toUpperCase() || /* istanbul ignore next */ '',
    port: Number(process.env.APP_PORT) || 3000,
  },
  db: {
    uri: process.env.DB_URI || '',
  },
  slack: {
    apiHost: process.env.SLACK_API_HOST || '',
    appToken: process.env.SLACK_APP_TOKEN || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    botUserId: process.env.SLACK_BOT_USER_ID || '',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    logLevel: process.env.SLACK_LOG_LEVEL?.toUpperCase() || 'INFO',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  },
};
