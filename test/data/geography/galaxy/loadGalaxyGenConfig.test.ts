import { loadGalaxyGenConfig } from '../../../../src/data/geography/galaxy/loadGalaxyGenConfig';
import { GalaxyGenData } from '../../../../src/data/geography/galaxy/GalaxyGenData';

describe('loadGalaxyGenConfig', () => {
    it('loads configuration from JSON successfully', () => {
        const config = loadGalaxyGenConfig();

        expect(config).toBeInstanceOf(GalaxyGenData);
        expect(config.getNumberSectors()).toBeDefined();
        expect(config.getGalaxySize()).toBeDefined();
    });

    it('returns valid configuration data', () => {
        const config = loadGalaxyGenConfig();

        expect(config.getNumberSectors()).toBeGreaterThan(0);
        expect(config.getGalaxySize()).toBeGreaterThan(0);
    });

    it('loads expected default values', () => {
        const config = loadGalaxyGenConfig();

        // Based on galaxy-gen.json
        expect(config.getNumberSectors()).toBe(100);
        expect(config.getGalaxySize()).toBe(10);
    });
});
