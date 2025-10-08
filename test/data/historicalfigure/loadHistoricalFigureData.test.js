import { loadHistoricalFigureData } from '../../../src/data/historicalfigure/loadHistoricalFigureData';
import { HistoricalFigureData } from '../../../src/data/historicalfigure/HistoricalFigureData';

describe('loadHistoricalFigureData', () => {
    it('should load configuration from JSON file', () => {
        const config = loadHistoricalFigureData();
        
        expect(config).toBeInstanceOf(HistoricalFigureData);
    });

    it('should load correct values from JSON file', () => {
        const config = loadHistoricalFigureData();
        
        // These values should match what's in data/historicalfigure/historical-figure.json
        expect(config.getBirthChancePerYear()).toBe(0.05);
        expect(config.getNaturalLifespanMean()).toBe(70);
        expect(config.getNaturalLifespanStdDev()).toBe(15);
    });

    it('should return a frozen immutable instance', () => {
        const config = loadHistoricalFigureData();
        
        expect(Object.isFrozen(config)).toBe(true);
    });
});
