/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import process from 'node:process';
import type { Config } from '@types';

describe('utils config', () => {
  const ENV_BACKUP = process.env;
  let config: Config;

  describe('calling var app.logLevel', () => {
    const testCases = [
      { val: 'foo', expected: 'FOO' },
      { val: '', expected: 'INFO' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.APP_LOG_LEVEL ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.APP_LOG_LEVEL = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.app.logLevel).toEqual(expected);
        });
      });
    });
  });

  describe('calling var app.logOutputFormat', () => {
    const testCases = [
      { val: 'foo', expected: 'FOO' },
      { val: '', expected: 'ELK' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.APP_LOG_OUTPUT_FORMAT ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.APP_LOG_OUTPUT_FORMAT = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.app.logOutputFormat).toEqual(expected);
        });
      });
    });
  });

  describe('calling var app.nodeEnv', () => {
    const testCases = [
      { val: 'foo', expected: 'FOO' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.NODE_ENV ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.NODE_ENV = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.app.nodeEnv).toEqual(expected);
        });
      });
    });
  });

  describe('calling var app.port', () => {
    const testCases = [
      { val: '1234', expected: 1234 },
      { val: '', expected: 3000 },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.APP_PORT ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.APP_PORT = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.app.port).toEqual(expected);
        });
      });
    });
  });

  describe('calling var app.isTsNode', () => {
    const testCases = [
      { val: 'TRUE', expected: true },
      { val: '', expected: false },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.TS_NODE ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.TS_NODE = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.app.isTsNode).toEqual(expected);
        });
      });
    });
  });

  describe('calling var bree.isDisabled', () => {
    const testCases = [
      { val: 'TRUE', expected: true },
      { val: '', expected: false },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.BREE_DISABLE ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.BREE_DISABLE = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.bree.isDisabled).toEqual(expected);
        });
      });
    });
  });

  describe('calling var bree.jobs.updateChannelsCron', () => {
    const testCases = [
      { val: 'foo', expected: 'foo' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.BREE_JOBS_UPDATE_CHANNELS_CRON ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.BREE_JOBS_UPDATE_CHANNELS_CRON = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.bree.jobs.updateChannelsCron).toEqual(expected);
        });
      });
    });
  });

  describe('calling var crypto.key', () => {
    const testCases = [
      { val: 'foo', expected: 'foo' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.CRYPTO_KEY ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.CRYPTO_KEY = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.crypto.key).toEqual(expected);
        });
      });
    });
  });

  describe('calling var db.uri', () => {
    const testCases = [
      { val: 'foo', expected: 'foo' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.DB_URI ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.DB_URI = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.db.uri).toEqual(expected);
        });
      });
    });
  });

  describe('calling var slack.apiHost', () => {
    const testCases = [
      { val: 'foo', expected: 'foo' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.SLACK_API_HOST ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.SLACK_API_HOST = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.slack.apiHost).toEqual(expected);
        });
      });
    });
  });

  describe('calling var slack.appToken', () => {
    const testCases = [
      { val: 'foo', expected: 'foo' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.SLACK_APP_TOKEN ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.SLACK_APP_TOKEN = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.slack.appToken).toEqual(expected);
        });
      });
    });
  });

  describe('calling var slack.botToken', () => {
    const testCases = [
      { val: 'foo', expected: 'foo' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.SLACK_BOT_TOKEN ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.SLACK_BOT_TOKEN = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.slack.botToken).toEqual(expected);
        });
      });
    });
  });

  describe('calling var slack.botUserId', () => {
    const testCases = [
      { val: 'foo', expected: 'foo' },
      { val: '', expected: '' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.SLACK_BOT_USER_ID ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.SLACK_BOT_USER_ID = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.slack.botUserId).toEqual(expected);
        });
      });
    });
  });

  describe('calling var slack.logLevel', () => {
    const testCases = [
      { val: 'foo', expected: 'FOO' },
      { val: '', expected: 'INFO' },
    ];
    testCases.forEach(({ val, expected }) => {
      describe(`when process.env.SLACK_LOG_LEVEL ${val ? 'set' : 'not set'}`, () => {
        beforeEach(() => {
          jest.resetModules();
          process.env.SLACK_LOG_LEVEL = val;

          config = require('./config').default;
        });

        afterAll(() => {
          process.env = ENV_BACKUP;
        });

        it(`returns ${val ? 'value' : 'default'}`, () => {
          expect(config.slack.logLevel).toEqual(expected);
        });
      });
    });
  });
});
