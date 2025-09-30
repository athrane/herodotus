import geographicalFeaturesRaw from '../../../../data/geography/feature/geographical-features.json';
import { GeographicalFeatureData } from './GeographicalFeatureData';

/**
 * Loads geographical features from a JSON file.
 * @returns An array of GeographicalFeatureData instances.
 */
export function loadGeographicalFeatures(): GeographicalFeatureData[] {
  return GeographicalFeatureData.fromJsonObject(geographicalFeaturesRaw);
}