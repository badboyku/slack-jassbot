const config = {
  app: {
    logLevel: process.env.APP_LOG_LEVEL || 'info',
    port: Number(process.env.APP_PORT) || 3000,
  },
  db: {
    uri: process.env.DB_URI || '',
  },
  slack: {
    logLevel: process.env.SLACK_LOG_LEVEL || 'info',
    appToken: process.env.SLACK_APP_TOKEN || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  },
};

export default config;
