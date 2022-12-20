/* istanbul ignore file */
export default class DbFindOneError extends Error {
  constructor(message = '') {
    super(message);

    this.name = this.constructor.name;
  }
}
