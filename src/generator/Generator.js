export class Generator {

  run() {
    console.log('Generator is running!');
  }

  /**
   * This method is a factory method that creates and returns a new instance of the Generator class
   * @returns {Generator} A new instance of the Generator class.
   */
  static create() {
    return new Generator();
  }

}