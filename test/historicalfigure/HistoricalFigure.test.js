import { HistoricalFigure } from '../../src/historicalfigure/HistoricalFigure.js';

describe('HistoricalFigure', () => {
  describe('constructor', () => {
    it('should create a HistoricalFigure with a valid name', () => {
      const name = 'Herodotus';
      const figure = new HistoricalFigure(name);
      expect(figure).toBeInstanceOf(HistoricalFigure);
      expect(figure.getName()).toBe(name);
    });

    it('should throw a TypeError if the name is not a string', () => {
      expect(() => new HistoricalFigure(123)).toThrow(TypeError);
      expect(() => new HistoricalFigure({})).toThrow(TypeError);
      expect(() => new HistoricalFigure(null)).toThrow(TypeError);
      expect(() => new HistoricalFigure(undefined)).toThrow(TypeError);
      expect(() => new HistoricalFigure([])).toThrow(TypeError);
    });
  });

  describe('name getter', () => {
    it('should return the name provided in the constructor', () => {
      const name = 'Socrates';
      const figure = new HistoricalFigure(name);
      expect(figure.getName()).toBe(name);
    });
  });
});