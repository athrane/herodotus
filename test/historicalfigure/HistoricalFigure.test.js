import { HistoricalFigure } from '../../src/historicalfigure/HistoricalFigure';
import { NameGenerator } from '../../src/naming/NameGenerator';

describe('HistoricalFigure', () => {
  describe('constructor', () => {
    it('should create a HistoricalFigure with a valid name', () => {
      const name = 'Herodotus';
      const figure = HistoricalFigure.create(name);
      expect(figure).toBeInstanceOf(HistoricalFigure);
      expect(figure.getName()).toBe(name);
    });

    it('should throw a TypeError if the name is not a string', () => {
      expect(() => HistoricalFigure.create(123)).toThrow(TypeError);
      expect(() => HistoricalFigure.create({})).toThrow(TypeError);
      expect(() => HistoricalFigure.create(null)).toThrow(TypeError);
      expect(() => HistoricalFigure.create(undefined)).toThrow(TypeError);
      expect(() => HistoricalFigure.create([])).toThrow(TypeError);
    });
  });

  describe('name getter', () => {
    it('should return the name provided in the constructor', () => {
      const name = 'Socrates';
      const figure = HistoricalFigure.create(name);
      expect(figure.getName()).toBe(name);
    });
  });

  describe('generate', () => {
    it('should generate a historical figure with a name', () => {
      const nameGenerator = NameGenerator.create();
      const figure = HistoricalFigure.generate('GENERIC', nameGenerator);
      expect(figure).toBeInstanceOf(HistoricalFigure);
      expect(typeof figure.getName()).toBe('string');
      expect(figure.getName().length).toBeGreaterThan(0);
    });
  });
});
