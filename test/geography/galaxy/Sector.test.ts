import { Sector } from '../../../src/geography/galaxy/Sector';

describe('Sector', () => {
  it('initialises with unique planet identifiers', () => {
    const sector = Sector.create('sector-1', 'Core Worlds', ['p-1', 'p-2', 'p-2']);

    expect(sector.getId()).toBe('sector-1');
    expect(sector.getName()).toBe('Core Worlds');
    const planetIds = sector.getPlanetIds();
    expect(planetIds).toHaveLength(2);
    expect(new Set(planetIds)).toEqual(new Set(['p-1', 'p-2']));

    planetIds.push('p-3');
    expect(sector.getPlanetIds()).toHaveLength(2);
  });

  it('adds and deduplicates planets', () => {
    const sector = Sector.create('sector-2', 'Frontier');

    sector.addPlanet('p-5');
    sector.addPlanet('p-5');
    sector.addPlanet('p-6');

    expect(sector.getPlanetIds()).toEqual(['p-5', 'p-6']);
    expect(sector.hasPlanet('p-5')).toBe(true);
    expect(sector.hasPlanet('p-7')).toBe(false);
  });

  it('removes planets when requested', () => {
    const sector = Sector.create('sector-3', 'Outer Rim', ['p-8', 'p-9']);

    sector.removePlanet('p-8');
    sector.removePlanet('unknown');

    expect(sector.hasPlanet('p-8')).toBe(false);
    expect(sector.getPlanetIds()).toEqual(['p-9']);
  });
});
