import { TypeUtils } from '../../src/util/TypeUtils.js';

describe('TypeUtils', () => {
  let errorSpy;
  let traceSpy;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    traceSpy = jest.spyOn(console, 'trace').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ensureInstanceOf', () => {
    class TestClass {}
    class AnotherClass {}

    it('should not throw when the value is an instance of the correct class', () => {
      const instance = new TestClass();
      expect(() => TypeUtils.ensureInstanceOf(instance, TestClass)).not.toThrow();
    });

    it('should throw a TypeError when the value is not an instance of the correct class', () => {
      const instance = new AnotherClass();
      const expectedMessage = 'Expected instance of TestClass, but got object';
      expect(() => TypeUtils.ensureInstanceOf(instance, TestClass)).toThrow(new TypeError(expectedMessage));
    });

    it('should throw a TypeError for primitive values', () => {
      expect(() => TypeUtils.ensureInstanceOf('string', TestClass)).toThrow(new TypeError('Expected instance of TestClass, but got string'));
      expect(() => TypeUtils.ensureInstanceOf(123, TestClass)).toThrow(new TypeError('Expected instance of TestClass, but got number'));
      expect(() => TypeUtils.ensureInstanceOf(null, TestClass)).toThrow(new TypeError('Expected instance of TestClass, but got object'));
      expect(() => TypeUtils.ensureInstanceOf(undefined, TestClass)).toThrow(new TypeError('Expected instance of TestClass, but got undefined'));
    });

    it('should log an error and trace on failure', () => {
      const value = {};
      const expectedMessage = 'Expected instance of TestClass, but got object';
      expect(() => TypeUtils.ensureInstanceOf(value, TestClass)).toThrow();
      expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
      expect(traceSpy).toHaveBeenCalledWith('Instance check failed');
    });
  });

  describe('ensureString', () => {
    it('should not throw for a string value', () => {
      expect(() => TypeUtils.ensureString('a string')).not.toThrow();
      expect(() => TypeUtils.ensureString('')).not.toThrow();
    });

    it('should throw a TypeError for a non-string value', () => {
      const expectedMessage = 'Expected type string, but got number';
      expect(() => TypeUtils.ensureString(123)).toThrow(new TypeError(expectedMessage));
    });

    it('should throw a TypeError for other non-string types', () => {
      expect(() => TypeUtils.ensureString(null)).toThrow(new TypeError('Expected type string, but got object'));
      expect(() => TypeUtils.ensureString(undefined)).toThrow(new TypeError('Expected type string, but got undefined'));
      expect(() => TypeUtils.ensureString({})).toThrow(new TypeError('Expected type string, but got object'));
      expect(() => TypeUtils.ensureString([])).toThrow(new TypeError('Expected type string, but got object'));
      expect(() => TypeUtils.ensureString(() => {})).toThrow(new TypeError('Expected type string, but got function'));
    });

    it('should log an error and trace on failure', () => {
      const value = 123;
      const expectedMessage = 'Expected type string, but got number';
      expect(() => TypeUtils.ensureString(value)).toThrow();
      expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
      expect(traceSpy).toHaveBeenCalledWith('String check failed');
    });
  });

  describe('ensureNumber', () => {
    it('should not throw for a number value', () => {
      expect(() => TypeUtils.ensureNumber(123)).not.toThrow();
      expect(() => TypeUtils.ensureNumber(0)).not.toThrow();
      expect(() => TypeUtils.ensureNumber(-45.6)).not.toThrow();
      expect(() => TypeUtils.ensureNumber(NaN)).not.toThrow(); // NaN is a number
    });

    it('should throw a TypeError for a non-number value', () => {
      const expectedMessage = 'Expected type number, but got string';
      expect(() => TypeUtils.ensureNumber('123')).toThrow(new TypeError(expectedMessage));
    });

    it('should throw a TypeError for other non-number types', () => {
      expect(() => TypeUtils.ensureNumber(null)).toThrow(new TypeError('Expected type number, but got object'));
      expect(() => TypeUtils.ensureNumber(undefined)).toThrow(new TypeError('Expected type number, but got undefined'));
      expect(() => TypeUtils.ensureNumber({})).toThrow(new TypeError('Expected type number, but got object'));
      expect(() => TypeUtils.ensureNumber([])).toThrow(new TypeError('Expected type number, but got object'));
      expect(() => TypeUtils.ensureNumber(() => {})).toThrow(new TypeError('Expected type number, but got function'));
      expect(() => TypeUtils.ensureNumber('')).toThrow(new TypeError('Expected type number, but got string'));
      expect(() => TypeUtils.ensureNumber(true)).toThrow(new TypeError('Expected type number, but got boolean'));
    });

    it('should log an error and trace on failure', () => {
      const value = 'not a number';
      const expectedMessage = 'Expected type number, but got string';
      expect(() => TypeUtils.ensureNumber(value)).toThrow();
      expect(errorSpy).toHaveBeenCalledWith(expectedMessage);
      expect(traceSpy).toHaveBeenCalledWith('Number check failed');
    });
  });

  describe('ensureFunction', () => {
    it('should not throw for a function', () => {
      expect(() => TypeUtils.ensureFunction(() => {})).not.toThrow();
      expect(() => TypeUtils.ensureFunction(function() {})).not.toThrow();
    });

    it('should throw a TypeError for non-function values', () => {
      expect(() => TypeUtils.ensureFunction(123)).toThrow(new TypeError('Expected a function'));
      expect(() => TypeUtils.ensureFunction('str')).toThrow(new TypeError('Expected a function'));
      expect(() => TypeUtils.ensureFunction({})).toThrow(new TypeError('Expected a function'));
      expect(() => TypeUtils.ensureFunction([])).toThrow(new TypeError('Expected a function'));
      expect(() => TypeUtils.ensureFunction(null)).toThrow(new TypeError('Expected a function'));
      expect(() => TypeUtils.ensureFunction(undefined)).toThrow(new TypeError('Expected a function'));
    });

    it('should throw with custom message', () => {
      expect(() => TypeUtils.ensureFunction(123, 'Custom error')).toThrow(new TypeError('Custom error'));
    });
  });

  describe('ensureArray', () => {
    it('should not throw for an array', () => {
      expect(() => TypeUtils.ensureArray([])).not.toThrow();
      expect(() => TypeUtils.ensureArray([1, 2, 3])).not.toThrow();
      expect(() => TypeUtils.ensureArray(new Array())).not.toThrow();
    });

    it('should throw a TypeError for non-array values', () => {
      expect(() => TypeUtils.ensureArray(123)).toThrow(new TypeError('Expected an array'));
      expect(() => TypeUtils.ensureArray('str')).toThrow(new TypeError('Expected an array'));
      expect(() => TypeUtils.ensureArray({})).toThrow(new TypeError('Expected an array'));
      expect(() => TypeUtils.ensureArray(null)).toThrow(new TypeError('Expected an array'));
      expect(() => TypeUtils.ensureArray(undefined)).toThrow(new TypeError('Expected an array'));
      expect(() => TypeUtils.ensureArray(() => {})).toThrow(new TypeError('Expected an array'));
    });

    it('should throw with custom message', () => {
      expect(() => TypeUtils.ensureArray(123, 'Custom array error')).toThrow(new TypeError('Custom array error'));
    });
  });

  describe('ensureNonEmptyString', () => {
    it('should not throw for a non-empty string', () => {
      expect(() => TypeUtils.ensureNonEmptyString('hello')).not.toThrow();
      expect(() => TypeUtils.ensureNonEmptyString(' ')).not.toThrow(); // space is not empty  
    });

    it('should throw a TypeError for an empty string', () => {
      expect(() => TypeUtils.ensureNonEmptyString('')).toThrow(new TypeError('Expected type non-empty string, but got string'));
      expect(() => TypeUtils.ensureNonEmptyString('   ')).not.toThrow(); // spaces are not considered empty 
    });

    it('should throw a TypeError for non-string values', () => {
      expect(() => TypeUtils.ensureNonEmptyString(123)).toThrow(new TypeError('Expected type non-empty string, but got number'));
      expect(() => TypeUtils.ensureNonEmptyString(null)).toThrow(new TypeError('Expected type non-empty string, but got object'));
      expect(() => TypeUtils.ensureNonEmptyString(undefined)).toThrow(new TypeError('Expected type non-empty string, but got undefined'));
      expect(() => TypeUtils.ensureNonEmptyString({})).toThrow(new TypeError('Expected type non-empty string, but got object'));
      expect(() => TypeUtils.ensureNonEmptyString([])).toThrow(new TypeError('Expected type non-empty string, but got object'));
      expect(() => TypeUtils.ensureNonEmptyString(() => {})).toThrow(new TypeError('Expected type non-empty string, but got function'));
    });
  });

});
