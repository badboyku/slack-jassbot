/* istanbul ignore file */
export default class SaveError extends Error {
  constructor(message = '') {
    super(message);

    this.name = this.constructor.name;
  }
}
