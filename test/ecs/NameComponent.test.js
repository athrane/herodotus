import { NameComponent } from '../../src/ecs/NameComponent.js';

describe('NameComponent', () => {
  describe('constructor', () => {
    it('should create a NameComponent with a valid string', () => {
      const component = new NameComponent('Test Entity');
      expect(component).toBeInstanceOf(NameComponent);
      expect(component.getText()).toBe('Test Entity');
    });

    it('should throw a TypeError if the argument is not a string', () => {
      expect(() => new NameComponent(123)).toThrow(TypeError);
      expect(() => new NameComponent(null)).toThrow(TypeError);
      expect(() => new NameComponent(undefined)).toThrow(TypeError);
      expect(() => new NameComponent({})).toThrow(TypeError);
    });
  });

  describe('getText', () => {
    it('should return the text it was constructed with', () => {
      const component = new NameComponent('Another Entity');
      expect(component.getText()).toBe('Another Entity');
    });
  });

  describe('static create', () => {
    it('should create a new instance of NameComponent', () => {
      const component = NameComponent.create('Created via factory');
      expect(component).toBeInstanceOf(NameComponent);
      expect(component.getText()).toBe('Created via factory');
    });

    it('should throw a TypeError for non-string arguments', () => {
      expect(() => NameComponent.create(123)).toThrow(TypeError);
    });
  });
});