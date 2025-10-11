import { loadRandomSeed, validateRandomSeed } from '../../../src/data/random/loadRandomSeed';
import { RandomSeed } from '../../../src/data/random/RandomSeed';
import path from 'path';

describe('loadRandomSeed', () => {
    describe('loading', () => {
        it('should load valid seed.json file', async () => {
            const filePath = path.join(process.cwd(), 'test', 'data', 'random', 'test-seed.json');
            const seed = await loadRandomSeed(filePath);
            
            expect(seed).toBeDefined();
            expect(seed.version).toBe('1.0');
            expect(seed.seed).toBe('test-seed-12345');
            expect(seed.description).toBe('Test seed for unit tests');
        });

        it('should throw for non-existent file', async () => {
            const filePath = path.join(process.cwd(), 'test', 'data', 'random', 'does-not-exist.json');
            await expect(loadRandomSeed(filePath)).rejects.toThrow();
        });

        it('should throw for invalid JSON syntax', async () => {
            const filePath = path.join(process.cwd(), 'test', 'data', 'random', 'invalid-syntax.json');
            await expect(loadRandomSeed(filePath)).rejects.toThrow(Error);
            await expect(loadRandomSeed(filePath)).rejects.toThrow(/Invalid JSON/);
        });

        it('should throw for missing seed field', async () => {
            const filePath = path.join(process.cwd(), 'test', 'data', 'random', 'invalid-missing-seed.json');
            await expect(loadRandomSeed(filePath)).rejects.toThrow(TypeError);
        });

        it('should throw for empty seed string', async () => {
            const filePath = path.join(process.cwd(), 'test', 'data', 'random', 'invalid-empty-seed.json');
            await expect(loadRandomSeed(filePath)).rejects.toThrow(TypeError);
        });

        it('should throw for missing version field', async () => {
            const filePath = path.join(process.cwd(), 'test', 'data', 'random', 'invalid-missing-version.json');
            await expect(loadRandomSeed(filePath)).rejects.toThrow(TypeError);
        });

        it('should throw for empty file path', async () => {
            await expect(loadRandomSeed('')).rejects.toThrow(TypeError);
        });
    });

    describe('validation', () => {
        it('should validate correct RandomSeed structure', () => {
            const validSeed = {
                version: '1.0',
                seed: 'test-seed',
                description: 'Test description'
            };
            
            expect(() => validateRandomSeed(validSeed)).not.toThrow();
        });

        it('should throw for missing version', () => {
            const invalidSeed = {
                seed: 'test-seed'
            };
            
            expect(() => validateRandomSeed(invalidSeed)).toThrow(TypeError);
            expect(() => validateRandomSeed(invalidSeed)).toThrow(/version/);
        });

        it('should throw for empty seed string', () => {
            const invalidSeed = {
                version: '1.0',
                seed: ''
            };
            
            expect(() => validateRandomSeed(invalidSeed)).toThrow(TypeError);
        });

        it('should throw for non-string seed', () => {
            const invalidSeed = {
                version: '1.0',
                seed: 12345
            };
            
            expect(() => validateRandomSeed(invalidSeed)).toThrow(TypeError);
        });

        it('should throw for non-string version', () => {
            const invalidSeed = {
                version: 1.0,
                seed: 'test-seed'
            };
            
            expect(() => validateRandomSeed(invalidSeed)).toThrow(TypeError);
        });

        it('should accept missing description', () => {
            const validSeed = {
                version: '1.0',
                seed: 'test-seed'
            };
            
            expect(() => validateRandomSeed(validSeed)).not.toThrow();
        });

        it('should accept undefined description', () => {
            const validSeed = {
                version: '1.0',
                seed: 'test-seed',
                description: undefined
            };
            
            expect(() => validateRandomSeed(validSeed)).not.toThrow();
        });

        it('should throw for non-string description', () => {
            const invalidSeed = {
                version: '1.0',
                seed: 'test-seed',
                description: 123
            };
            
            expect(() => validateRandomSeed(invalidSeed)).toThrow(TypeError);
        });

        it('should throw for null input', () => {
            expect(() => validateRandomSeed(null)).toThrow(TypeError);
        });

        it('should throw for non-object input', () => {
            expect(() => validateRandomSeed('not an object')).toThrow(TypeError);
            expect(() => validateRandomSeed(123)).toThrow(TypeError);
            expect(() => validateRandomSeed([])).toThrow(TypeError);
        });
    });
});
