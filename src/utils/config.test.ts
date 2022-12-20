import config from './config';

describe('config.ts', () => {
  const expected = {
    app: { logLevel: 'info', port: 3000 },
    slack: {
      apiHost: '',
      appToken: '',
      botToken: '',
      clientId: '',
      clientSecret: '',
      logLevel: 'info',
      signingSecret: '',
    },
  };

  test('should return config', () => {
    expect(expected).toEqual(config);
  });
});
