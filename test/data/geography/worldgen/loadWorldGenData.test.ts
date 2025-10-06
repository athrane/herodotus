import { loadWorldGenData } from '../../../../src/data/geography/worldgen/loadWorldGenData';
import { WorldGenData } from '../../../../src/data/geography/worldgen/WorldGenData';

describe('loadWorldGenData', () => {
  it('should load world generation data from JSON file', () => {
    const worldGenData = loadWorldGenData();

    expect(worldGenData).toBeInstanceOf(WorldGenData);
  });

  it('should return valid configuration values', () => {
    const worldGenData = loadWorldGenData();

    // These values should match the JSON file
    expect(worldGenData.getNumContinents()).toBe(3);
    expect(worldGenData.getNumSectors()).toBe(3);
    expect(worldGenData.getPlanetsPerSector()).toBe(64);
    expect(worldGenData.getFeaturesPerContinent()).toBe(50);
    expect(worldGenData.getContinentsPerPlanet()).toBe(5);
    expect(worldGenData.getFeaturesPerPlanetContinent()).toBe(64);
  });

  it('should return a frozen (immutable) instance', () => {
    const worldGenData = loadWorldGenData();

    expect(Object.isFrozen(worldGenData)).toBe(true);
  });
});
