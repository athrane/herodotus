import { readFile } from 'fs/promises';
import { TypeUtils } from '../../util/TypeUtils.js';
import { RandomSeed } from './RandomSeed.js';

/**
 * Loads random seed configuration from JSON file.
 * 
 * @param filePath - Path to seed.json file
 * @returns Promise resolving to RandomSeed object
 * @throws Error if file not found or invalid JSON structure
 */
export async function loadRandomSeed(filePath: string): Promise<RandomSeed> {
    TypeUtils.ensureNonEmptyString(filePath, 'filePath');

    try {
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        validateRandomSeed(data);
        return data;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in random seed file: ${filePath}`);
        }
        throw error;
    }
}

/**
 * Validates RandomSeed structure and content.
 * 
 * @param data - Parsed JSON object to validate
 * @throws TypeError if validation fails
 */
export function validateRandomSeed(data: unknown): asserts data is RandomSeed {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError('Random seed data must be an object');
    }

    const record = data as Record<string, unknown>;

    // Validate version field
    if (!('version' in record)) {
        throw new TypeError('Random seed data must have "version" field');
    }
    TypeUtils.ensureNonEmptyString(record.version, 'version');

    // Validate seed field
    if (!('seed' in record)) {
        throw new TypeError('Random seed data must have "seed" field');
    }
    TypeUtils.ensureNonEmptyString(record.seed, 'seed');

    // Validate optional description field
    if ('description' in record && record.description !== undefined) {
        TypeUtils.ensureString(record.description, 'description');
    }
}
