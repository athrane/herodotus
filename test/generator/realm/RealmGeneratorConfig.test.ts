import { RealmGeneratorConfig } from '../../../src/generator/realm/RealmGeneratorConfig';

describe('RealmGeneratorConfig', () => {
    it('should accept valid configuration', () => {
        const config: RealmGeneratorConfig = {
            numberOfRealms: 5,
            minPlanetsPerRealm: 3,
            maxPlanetsPerRealm: 5,
            ensurePlayerRealm: true,
            spatialDistribution: 'random'
        };

        expect(config.numberOfRealms).toBe(5);
        expect(config.minPlanetsPerRealm).toBe(3);
        expect(config.maxPlanetsPerRealm).toBe(5);
        expect(config.ensurePlayerRealm).toBe(true);
        expect(config.spatialDistribution).toBe('random');
    });

    it('should accept distributed spatial distribution', () => {
        const config: RealmGeneratorConfig = {
            numberOfRealms: 7,
            minPlanetsPerRealm: 3,
            maxPlanetsPerRealm: 4,
            ensurePlayerRealm: false,
            spatialDistribution: 'distributed'
        };

        expect(config.spatialDistribution).toBe('distributed');
    });

    it('should accept sectored spatial distribution', () => {
        const config: RealmGeneratorConfig = {
            numberOfRealms: 6,
            minPlanetsPerRealm: 4,
            maxPlanetsPerRealm: 5,
            ensurePlayerRealm: true,
            spatialDistribution: 'sectored'
        };

        expect(config.spatialDistribution).toBe('sectored');
    });
});
