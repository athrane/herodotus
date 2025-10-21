import { Sector } from '../../../src/geography/galaxy/Sector';
import { Position } from '../../../src/geography/galaxy/Position';

describe('Sector', () => {
  it('initialises with unique planet identifiers', () => {
    const position = Position.create(0, 0, 0);
    const sector = Sector.create('sector-1', 'Core Worlds', position, ['p-1', 'p-2', 'p-2']);

    expect(sector.getId()).toBe('sector-1');
    expect(sector.getName()).toBe('Core Worlds');
    const planetIds = sector.getPlanetIds();
    expect(planetIds).toHaveLength(2);
    expect(new Set(planetIds)).toEqual(new Set(['p-1', 'p-2']));

    planetIds.push('p-3');
    expect(sector.getPlanetIds()).toHaveLength(2);
  });

  it('adds and deduplicates planets', () => {
    const position = Position.create(1, 2, 3);
    const sector = Sector.create('sector-2', 'Frontier', position);

    sector.addPlanet('p-5');
    sector.addPlanet('p-5');
    sector.addPlanet('p-6');

    expect(sector.getPlanetIds()).toEqual(['p-5', 'p-6']);
    expect(sector.hasPlanet('p-5')).toBe(true);
    expect(sector.hasPlanet('p-7')).toBe(false);
  });

  it('removes planets when requested', () => {
    const position = Position.create(5, 5, 5);
    const sector = Sector.create('sector-3', 'Outer Rim', position, ['p-8', 'p-9']);

    sector.removePlanet('p-8');
    sector.removePlanet('unknown');

    expect(sector.hasPlanet('p-8')).toBe(false);
    expect(sector.getPlanetIds()).toEqual(['p-9']);
  });

  it('stores and returns position', () => {
    const position = Position.create(10, 20, 30);
    const sector = Sector.create('sector-4', 'Test Sector', position);
    
    const retrievedPosition = sector.getPosition();
    expect(retrievedPosition.getX()).toBe(10);
    expect(retrievedPosition.getY()).toBe(20);
    expect(retrievedPosition.getZ()).toBe(30);
  });

  it('serializes to JSON with position', () => {
    const position = Position.create(1.5, 2.5, 3.5);
    const sector = Sector.create('sector-5', 'JSON Sector', position, ['p-1']);
    
    const json = sector.toJSON();
    expect(json.id).toBe('sector-5');
    expect(json.name).toBe('JSON Sector');
    expect(json.position.x).toBe(1.5);
    expect(json.position.y).toBe(2.5);
    expect(json.position.z).toBe(3.5);
  });
});
