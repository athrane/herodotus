import { GalaxyGenData } from '../../../../src/data/geography/galaxy/GalaxyGenData';

describe('GalaxyGenData', () => {
    it('loads valid configuration successfully', () => {
        const data = {
            numberSectors: 100,
            galaxySize: 10
        };

        const config = GalaxyGenData.create(data);

        expect(config.getNumberSectors()).toBe(100);
        expect(config.getGalaxySize()).toBe(10);
    });

    it('validates numberSectors is a number', () => {
        const data = {
            numberSectors: 'invalid',
            galaxySize: 10
        };

        expect(() => {
            GalaxyGenData.create(data);
        }).toThrow(TypeError);
    });

    it('validates galaxySize is a number', () => {
        const data = {
            numberSectors: 100,
            galaxySize: 'invalid'
        };

        expect(() => {
            GalaxyGenData.create(data);
        }).toThrow(TypeError);
    });

    it('validates numberSectors is positive', () => {
        const data = {
            numberSectors: 0,
            galaxySize: 10
        };

        expect(() => {
            GalaxyGenData.create(data);
        }).toThrow(TypeError);
    });

    it('validates numberSectors is not negative', () => {
        const data = {
            numberSectors: -5,
            galaxySize: 10
        };

        expect(() => {
            GalaxyGenData.create(data);
        }).toThrow(TypeError);
    });

    it('validates galaxySize is positive', () => {
        const data = {
            numberSectors: 100,
            galaxySize: 0
        };

        expect(() => {
            GalaxyGenData.create(data);
        }).toThrow(TypeError);
    });

    it('validates galaxySize is not negative', () => {
        const data = {
            numberSectors: 100,
            galaxySize: -10
        };

        expect(() => {
            GalaxyGenData.create(data);
        }).toThrow(TypeError);
    });

    it('is immutable', () => {
        const data = {
            numberSectors: 100,
            galaxySize: 10
        };

        const config = GalaxyGenData.create(data);

        expect(Object.isFrozen(config)).toBe(true);
    });

    it('null object pattern returns singleton', () => {
        const config1 = GalaxyGenData.createNull();
        const config2 = GalaxyGenData.createNull();

        expect(config1).toBe(config2);
    });

    it('null object has default values', () => {
        const config = GalaxyGenData.createNull();

        expect(config.getNumberSectors()).toBe(1);
        expect(config.getGalaxySize()).toBe(1);
    });
});
