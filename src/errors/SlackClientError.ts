import type { WebAPICallResult } from '@slack/web-api';

export default class SlackClientError extends Error {
  public response: WebAPICallResult | undefined;

  constructor(message = '', response: WebAPICallResult | undefined = undefined) {
    super(message);

    this.name = this.constructor.name;
    this.response = response;
  }
}
