import worldGenDataRaw from '../../../../data/geography/world/world.js';
import { WorldGenData } from './WorldGenData';

/**
 * Loads world generation configuration from a JavaScript module.
 * @returns A WorldGenData instance containing the configuration.
 */
export function loadWorldGenData(): WorldGenData {
  return WorldGenData.create(worldGenDataRaw);
}
