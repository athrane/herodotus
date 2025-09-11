import { ScrollStrategy } from '../../../src/gui/menu/ScrollStrategy';

describe('ScrollStrategy', () => {
  test('has VERTICAL strategy', () => {
    expect(ScrollStrategy.VERTICAL).toBe('vertical');
  });

  test('has HORIZONTAL strategy', () => {
    expect(ScrollStrategy.HORIZONTAL).toBe('horizontal');
  });

  test('enum values are correct', () => {
    const values = Object.values(ScrollStrategy);
    expect(values).toEqual(['vertical', 'horizontal']);
  });

  test('enum keys are correct', () => {
    const keys = Object.keys(ScrollStrategy);
    expect(keys).toEqual(['VERTICAL', 'HORIZONTAL']);
  });
});