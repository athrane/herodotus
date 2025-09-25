import { GalaxyMapComponent } from '../../../src/geography/galaxy/GalaxyMapComponent';
import { Sector } from '../../../src/geography/galaxy/Sector';
import { PlanetComponent, PlanetStatus, PlanetResourceSpecialization } from '../../../src/geography/planet/PlanetComponent';
import { Continent } from '../../../src/geography/planet/Continent';

describe('GalaxyMapComponent', () => {
  const galaxy = GalaxyMapComponent.create();

  const createPlanet = (id: string, sectorId = 'sector-1'): PlanetComponent =>
    PlanetComponent.create(
      id,
      `Planet-${id}`,
      sectorId,
      'Faction',
      PlanetStatus.NORMAL,
      5,
      2,
      PlanetResourceSpecialization.AGRICULTURE,
      [Continent.create('Alpha')]
    );

  beforeEach(() => {
    galaxy.reset();
  });

  it('returns a singleton instance', () => {
    expect(GalaxyMapComponent.create()).toBe(galaxy);
  });

  it('registers sectors and planets and associates them correctly', () => {
    const sector = Sector.create('sector-1', 'Core Worlds');
    galaxy.addSector(sector);

    const planet = createPlanet('planet-a');
    galaxy.registerPlanet(planet);

    expect(galaxy.getSectorCount()).toBe(1);
    expect(galaxy.getPlanetCount()).toBe(1);
    expect(galaxy.getSectorById('sector-1')).toBe(sector);
    expect(galaxy.getPlanetById('planet-a')).toBe(planet);
    expect(galaxy.getPlanetsInSector('sector-1')).toEqual([planet]);
    expect(sector.hasPlanet('planet-a')).toBe(true);
  });

  it('connects planets bidirectionally', () => {
    const sector = Sector.create('sector-1', 'Core Worlds');
    galaxy.addSector(sector);
    const planetA = createPlanet('planet-a');
    const planetB = createPlanet('planet-b');
    galaxy.registerPlanet(planetA);
    galaxy.registerPlanet(planetB);

    galaxy.connectPlanets('planet-a', 'planet-b');

    expect(galaxy.getConnectedPlanets('planet-a')).toEqual(['planet-b']);
    expect(galaxy.getConnectedPlanets('planet-b')).toEqual(['planet-a']);
  });

  it('returns an empty array when no connections exist', () => {
    const sector = Sector.create('sector-1', 'Core Worlds');
    galaxy.addSector(sector);
    const planet = createPlanet('planet-a');
    galaxy.registerPlanet(planet);

    expect(galaxy.getConnectedPlanets('planet-a')).toEqual([]);
    expect(galaxy.getConnectedPlanets('unknown')).toEqual([]);
  });

  it('throws when registering a planet with an unknown sector', () => {
    const planet = createPlanet('planet-x', 'missing-sector');
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const traceSpy = jest.spyOn(console, 'trace').mockImplementation(() => {});

    expect(() => galaxy.registerPlanet(planet)).toThrow(
      'Planet planet-x references unknown sector missing-sector.'
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Planet planet-x references unknown sector missing-sector.'
    );
    expect(traceSpy).toHaveBeenCalledWith('registerPlanet');

    errorSpy.mockRestore();
    traceSpy.mockRestore();
  });

  it('throws when connecting unknown planets', () => {
    const sector = Sector.create('sector-1', 'Core Worlds');
    galaxy.addSector(sector);
    galaxy.registerPlanet(createPlanet('planet-a'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const traceSpy = jest.spyOn(console, 'trace').mockImplementation(() => {});

    expect(() => galaxy.connectPlanets('planet-a', 'planet-missing')).toThrow(
      'Cannot connect unknown planets planet-a and planet-missing.'
    );
    expect(errorSpy).toHaveBeenCalledWith(
      'Cannot connect unknown planets planet-a and planet-missing.'
    );
    expect(traceSpy).toHaveBeenCalledWith('connectPlanets');

    errorSpy.mockRestore();
    traceSpy.mockRestore();
  });

  it('clears all data when reset is called', () => {
    const sector = Sector.create('sector-1', 'Core Worlds');
    galaxy.addSector(sector);
    galaxy.registerPlanet(createPlanet('planet-a'));

    galaxy.reset();

    expect(galaxy.getSectorCount()).toBe(0);
    expect(galaxy.getPlanetCount()).toBe(0);
    expect(galaxy.getSectors()).toEqual([]);
    expect(galaxy.getPlanetById('planet-a')).toBeUndefined();
  });
});
