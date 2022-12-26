import config from './config';

describe('config.ts', () => {
  describe('with no env vars set', () => {
    const expected = {
      app: { logLevel: 'INFO', logOutputFormat: 'ELK', nodeEnv: 'TEST', port: 3000, isTsNode: false },
      bree: { isDisabled: false, jobs: { updateMemberChannelsCron: '' } },
      db: { uri: '' },
      slack: { apiHost: '', appToken: '', botToken: '', botUserId: '', logLevel: 'INFO' },
    };

    it('should return config with defaults', () => {
      expect(config).toEqual(expected);
    });
  });
});
