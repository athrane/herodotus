import { loadHistoricalFigureBirthData } from '../../../src/data/historicalfigure/loadHistoricalFigureBirthData';
import { HistoricalFigureBirthData } from '../../../src/data/historicalfigure/HistoricalFigureBirthData';

describe('loadHistoricalFigureBirthData', () => {
    it('should load configuration from JSON file', () => {
        const config = loadHistoricalFigureBirthData();
        
        expect(config).toBeInstanceOf(HistoricalFigureBirthData);
    });

    it('should load correct values from JSON file', () => {
        const config = loadHistoricalFigureBirthData();
        
        // These values should match what's in data/historicalfigure/historical-figure-birth.json
        expect(config.getBirthChancePerYear()).toBe(0.05);
        expect(config.getNaturalLifespanMean()).toBe(70);
        expect(config.getNaturalLifespanStdDev()).toBe(15);
    });

    it('should return a frozen immutable instance', () => {
        const config = loadHistoricalFigureBirthData();
        
        expect(Object.isFrozen(config)).toBe(true);
    });
});
