/* istanbul ignore file */
export default class FindOneError extends Error {
  constructor(message = '') {
    super(message);

    this.name = this.constructor.name;
  }
}
