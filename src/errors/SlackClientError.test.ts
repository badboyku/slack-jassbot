import { SlackClientError } from '@errors';

describe('errors SlackClientError', () => {
  const message = 'message';
  const response = { ok: true };
  let error: SlackClientError;

  describe('when called with no args', () => {
    beforeEach(() => {
      error = new SlackClientError();
    });

    it('has message attribute with default empty string', () => {
      expect(error.message).toEqual('');
    });

    it('has response attribute with default undefined', () => {
      expect(error.response).toEqual(undefined);
    });
  });

  describe('when called with args', () => {
    beforeEach(() => {
      error = new SlackClientError(message, response);
    });

    it('has message attribute', () => {
      expect(error.message).toEqual(message);
    });

    it('has response attribute', () => {
      expect(error.response).toEqual(response);
    });
  });
});
