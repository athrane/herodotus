import { HistoricalFigure } from '../../src/historicalfigure/HistoricalFigure';
import { NameGenerator } from '../../src/naming/NameGenerator';

describe('HistoricalFigure', () => {
  describe('constructor', () => {
    it('should create a HistoricalFigure with a valid name', () => {
      const name = 'Herodotus';
      const figure = HistoricalFigure.create(name, -484, 59, 'Greek', 'Historian');
      expect(figure).toBeInstanceOf(HistoricalFigure);
      expect(figure.getName()).toBe(name);
      expect(figure.getBirthYear()).toBe(-484);
      expect(figure.getAverageLifeSpan()).toBe(59);
      expect(figure.getCulture()).toBe('Greek');
      expect(figure.getOccupation()).toBe('Historian');
    });

    it('should throw a TypeError if the name is not a string', () => {
      expect(() => HistoricalFigure.create(123, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigure.create({}, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigure.create(null, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigure.create(undefined, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigure.create([], -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
    });
  });

  describe('name getter', () => {
    it('should return the name provided in the constructor', () => {
      const name = 'Socrates';
      const figure = HistoricalFigure.create(name, -470, 71, 'Greek', 'Philosopher');
      expect(figure.getName()).toBe(name);
    });
  });

  describe('generate', () => {
    it('should generate a historical figure with a name', () => {
      const nameGenerator = NameGenerator.create();
      const figure = HistoricalFigure.generate('GENERIC', nameGenerator, -400, 60, 'Scholar');
      expect(figure).toBeInstanceOf(HistoricalFigure);
      expect(typeof figure.getName()).toBe('string');
      expect(figure.getName().length).toBeGreaterThan(0);
      expect(figure.getCulture()).toBe('GENERIC');
      expect(figure.getBirthYear()).toBe(-400);
      expect(figure.getAverageLifeSpan()).toBe(60);
      expect(figure.getOccupation()).toBe('Scholar');
    });
  });
});
