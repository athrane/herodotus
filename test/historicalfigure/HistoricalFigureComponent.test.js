import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent';

describe('HistoricalFigureComponent', () => {
  describe('create', () => {
    it('creates a component when provided valid data', () => {
      const name = 'Herodotus';
      const component = HistoricalFigureComponent.create(name, -484, 59, 'Greek', 'Historian');
      expect(component).toBeInstanceOf(HistoricalFigureComponent);
      expect(component.name).toBe(name);
      expect(component.birthYear).toBe(-484);
      expect(component.averageLifeSpan).toBe(59);
      expect(component.culture).toBe('Greek');
      expect(component.occupation).toBe('Historian');
    });

    it('throws a TypeError when provided a non-string name', () => {
      expect(() => HistoricalFigureComponent.create(123, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create({}, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create(null, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create(undefined, -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create([], -400, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
    });

    it('throws a TypeError when provided a non-number birthYear', () => {
      expect(() => HistoricalFigureComponent.create('Plato', 'not-a-number', 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Plato', null, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Plato', undefined, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Plato', {}, 50, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Plato', [], 50, 'Greek', 'Philosopher')).toThrow(TypeError);
    });

    it('throws a TypeError when provided a non-number averageLifeSpan', () => {
      expect(() => HistoricalFigureComponent.create('Aristotle', -384, 'not-a-number', 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Aristotle', -384, null, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Aristotle', -384, undefined, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Aristotle', -384, {}, 'Greek', 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Aristotle', -384, [], 'Greek', 'Philosopher')).toThrow(TypeError);
    });

    it('throws a TypeError when provided a non-string culture', () => {
      expect(() => HistoricalFigureComponent.create('Socrates', -470, 70, 123, 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Socrates', -470, 70, null, 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Socrates', -470, 70, undefined, 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Socrates', -470, 70, {}, 'Philosopher')).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Socrates', -470, 70, [], 'Philosopher')).toThrow(TypeError);
    });

    it('throws a TypeError when provided a non-string occupation', () => {
      expect(() => HistoricalFigureComponent.create('Pythagoras', -570, 75, 'Greek', 123)).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Pythagoras', -570, 75, 'Greek', null)).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Pythagoras', -570, 75, 'Greek', undefined)).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Pythagoras', -570, 75, 'Greek', {})).toThrow(TypeError);
      expect(() => HistoricalFigureComponent.create('Pythagoras', -570, 75, 'Greek', [])).toThrow(TypeError);
    });
  });

  describe('generate', () => {
    it('creates a component using the provided generator', () => {
      // Create a function that also has the generateHistoricalFigureName method
      // to satisfy both the ensureFunction check and the method call
      const mockGeneratorFn = jest.fn(() => 'Generated Name');
      const generator = Object.assign(mockGeneratorFn, {
        generateHistoricalFigureName: mockGeneratorFn
      });

      const component = HistoricalFigureComponent.generate('GENERIC', generator, -400, 60, 'Scholar');

      expect(generator.generateHistoricalFigureName).toHaveBeenCalledWith('GENERIC', 4, 8);
      expect(component).toBeInstanceOf(HistoricalFigureComponent);
      expect(component.name).toBe('Generated Name');
      expect(component.birthYear).toBe(-400);
      expect(component.averageLifeSpan).toBe(60);
      expect(component.culture).toBe('GENERIC');
      expect(component.occupation).toBe('Scholar');
    });
  });
});
