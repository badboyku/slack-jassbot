const config = {
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
    logLevel: process.env.SLACK_LOG_LEVEL?.toUpperCase() || 'INFO',
    appToken: process.env.SLACK_APP_TOKEN || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  },
};

export default config;
