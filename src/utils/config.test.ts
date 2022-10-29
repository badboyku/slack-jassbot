import config from './config';

describe('config.ts', () => {
  const expected = {
    app: { logLevel: 'info', port: 3000 },
    slack: { logLevel: 'info', appToken: '', botToken: '', clientId: '', clientSecret: '', signingSecret: '' },
  };

  test('should return config', () => {
    expect(expected).toEqual(config);
  });
});
