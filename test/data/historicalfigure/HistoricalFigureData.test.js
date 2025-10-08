import { HistoricalFigureData } from '../../../src/data/historicalfigure/HistoricalFigureData';

describe('HistoricalFigureData', () => {
    describe('constructor and create', () => {
        it('should create a valid instance with correct data', () => {
            const data = {
                birthChancePerYear: 0.05,
                naturalLifespanMean: 70,
                naturalLifespanStdDev: 15
            };
            const config = HistoricalFigureData.create(data);
            
            expect(config).toBeInstanceOf(HistoricalFigureData);
            expect(config.getBirthChancePerYear()).toBe(0.05);
            expect(config.getNaturalLifespanMean()).toBe(70);
            expect(config.getNaturalLifespanStdDev()).toBe(15);
        });

        it('should freeze the instance to make it immutable', () => {
            const data = {
                birthChancePerYear: 0.05,
                naturalLifespanMean: 70,
                naturalLifespanStdDev: 15
            };
            const config = HistoricalFigureData.create(data);
            
            expect(Object.isFrozen(config)).toBe(true);
        });

        it('should throw error if birthChancePerYear is not a number', () => {
            expect.assertions(1);
            const data = {
                birthChancePerYear: 'invalid',
                naturalLifespanMean: 70,
                naturalLifespanStdDev: 15
            };
            
            expect(() => HistoricalFigureData.create(data)).toThrow(TypeError);
        });

        it('should throw error if naturalLifespanMean is not a number', () => {
            expect.assertions(1);
            const data = {
                birthChancePerYear: 0.05,
                naturalLifespanMean: 'invalid',
                naturalLifespanStdDev: 15
            };
            
            expect(() => HistoricalFigureData.create(data)).toThrow(TypeError);
        });

        it('should throw error if naturalLifespanStdDev is not a number', () => {
            expect.assertions(1);
            const data = {
                birthChancePerYear: 0.05,
                naturalLifespanMean: 70,
                naturalLifespanStdDev: 'invalid'
            };
            
            expect(() => HistoricalFigureData.create(data)).toThrow(TypeError);
        });

        it('should throw error if birthChancePerYear is missing', () => {
            expect.assertions(1);
            const data = {
                naturalLifespanMean: 70,
                naturalLifespanStdDev: 15
            };
            
            expect(() => HistoricalFigureData.create(data)).toThrow(TypeError);
        });

        it('should throw error if naturalLifespanMean is missing', () => {
            expect.assertions(1);
            const data = {
                birthChancePerYear: 0.05,
                naturalLifespanStdDev: 15
            };
            
            expect(() => HistoricalFigureData.create(data)).toThrow(TypeError);
        });

        it('should throw error if naturalLifespanStdDev is missing', () => {
            expect.assertions(1);
            const data = {
                birthChancePerYear: 0.05,
                naturalLifespanMean: 70
            };
            
            expect(() => HistoricalFigureData.create(data)).toThrow(TypeError);
        });

        it('should accept zero values', () => {
            const data = {
                birthChancePerYear: 0,
                naturalLifespanMean: 0,
                naturalLifespanStdDev: 0
            };
            const config = HistoricalFigureData.create(data);
            
            expect(config.getBirthChancePerYear()).toBe(0);
            expect(config.getNaturalLifespanMean()).toBe(0);
            expect(config.getNaturalLifespanStdDev()).toBe(0);
        });

        it('should accept large values', () => {
            const data = {
                birthChancePerYear: 1.0,
                naturalLifespanMean: 150,
                naturalLifespanStdDev: 50
            };
            const config = HistoricalFigureData.create(data);
            
            expect(config.getBirthChancePerYear()).toBe(1.0);
            expect(config.getNaturalLifespanMean()).toBe(150);
            expect(config.getNaturalLifespanStdDev()).toBe(50);
        });
    });

    describe('createNull', () => {
        it('should create a null instance with zero values', () => {
            const nullConfig = HistoricalFigureData.createNull();
            
            expect(nullConfig).toBeInstanceOf(HistoricalFigureData);
            expect(nullConfig.getBirthChancePerYear()).toBe(0);
            expect(nullConfig.getNaturalLifespanMean()).toBe(0);
            expect(nullConfig.getNaturalLifespanStdDev()).toBe(0);
        });

        it('should return the same singleton instance on multiple calls', () => {
            const nullConfig1 = HistoricalFigureData.createNull();
            const nullConfig2 = HistoricalFigureData.createNull();
            
            expect(nullConfig1).toBe(nullConfig2);
        });
    });

    describe('getter methods', () => {
        it('should return correct birthChancePerYear', () => {
            const config = HistoricalFigureData.create({
                birthChancePerYear: 0.123,
                naturalLifespanMean: 70,
                naturalLifespanStdDev: 15
            });
            
            expect(config.getBirthChancePerYear()).toBe(0.123);
        });

        it('should return correct naturalLifespanMean', () => {
            const config = HistoricalFigureData.create({
                birthChancePerYear: 0.05,
                naturalLifespanMean: 85,
                naturalLifespanStdDev: 15
            });
            
            expect(config.getNaturalLifespanMean()).toBe(85);
        });

        it('should return correct naturalLifespanStdDev', () => {
            const config = HistoricalFigureData.create({
                birthChancePerYear: 0.05,
                naturalLifespanMean: 70,
                naturalLifespanStdDev: 20
            });
            
            expect(config.getNaturalLifespanStdDev()).toBe(20);
        });
    });
});
