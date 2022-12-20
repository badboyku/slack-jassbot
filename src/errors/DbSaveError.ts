/* istanbul ignore file */
export default class DbSaveError extends Error {
  constructor(message = '') {
    super(message);

    this.name = this.constructor.name;
  }
}
