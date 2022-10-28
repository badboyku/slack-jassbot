const config = {
  app: {
    logLevel: process.env.APP_LOG_LEVEL || 'info',
    port: Number(process.env.APP_PORT) || Number(process.env.PORT) || 3000,
  },
  slack: {
    appToken: process.env.SLACK_APP_TOKEN || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  },
};

export default config;
