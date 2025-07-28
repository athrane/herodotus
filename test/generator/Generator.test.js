import { Generator } from '../../src/generator/Generator.js';

describe('Generator', () => {
  it('should log "Generator is running!" when run() is called', () => {
    const generator = new Generator();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    generator.run();
    expect(consoleSpy).toHaveBeenCalledWith('Generator is running!');