import worldGenDataRaw from '../worldgen.json';
import { WorldGenData } from './WorldGenData';

/**
 * Loads world generation configuration from a JSON file.
 * @returns A WorldGenData instance containing the configuration.
 */
export function loadWorldGenData(): WorldGenData {
  return WorldGenData.create(worldGenDataRaw);
}
