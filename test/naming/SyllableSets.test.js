import { SyllableSets } from '../../src/naming/SyllableSets.js';

describe('SyllableSets', () => {
    it('should have a GENERIC syllable set', () => {
        expect(SyllableSets.GENERIC).toBeDefined();
        expect(SyllableSets.GENERIC.initial).toBeInstanceOf(Array);
        expect(SyllableSets.GENERIC.middle).toBeInstanceOf(Array);
        expect(SyllableSets.GENERIC.final).toBeInstanceOf(Array);
    });

    it('should have a GUTTURAL syllable set', () => {
        expect(SyllableSets.GUTTURAL).toBeDefined();
        expect(SyllableSets.GUTTURAL.initial).toBeInstanceOf(Array);
        expect(SyllableSets.GUTTURAL.middle).toBeInstanceOf(Array);
        expect(SyllableSets.GUTTURAL.final).toBeInstanceOf(Array);
    });

    it('should have a MELODIC syllable set', () => {
        expect(SyllableSets.MELODIC).toBeDefined();
        expect(SyllableSets.MELODIC.initial).toBeInstanceOf(Array);
        expect(SyllableSets.MELODIC.middle).toBeInstanceOf(Array);
        expect(SyllableSets.MELODIC.final).toBeInstanceOf(Array);
    });
});
