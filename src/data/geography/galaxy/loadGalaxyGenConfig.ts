import galaxyGenDataRaw from '../../../../data/geography/galaxy/galaxy.json';
import { GalaxyGenData } from './GalaxyGenData';

/**
 * Loads galaxy generation configuration from a JSON file.
 * @returns A GalaxyGenData instance containing the configuration.
 */
export function loadGalaxyGenConfig(): GalaxyGenData {
    return GalaxyGenData.create(galaxyGenDataRaw);
}
