import { Generator } from '../../src/generator/Generator.js';

describe('Generator', () => {
  let generator;

  beforeEach(() => {
    generator = new Generator();
  });

    describe('constructor', () => {
      it('should create a Generator instance', () => {
        expect(generator).toBeInstanceOf(Generator);
      });
    });

});