import { GeographicalFeatureTypeRegistry } from '../../geography/feature/GeographicalFeatureTypeRegistry';
import { loadGeographicalFeatures } from '../../data/geography/feature/loadGeographicalFeatures';

/**
 * GeographicalFeaturesFactory is responsible for creating and registering
 * various geographical feature types in the GeographicalFeatureTypeRegistry.
 *
 * This factory method initializes the registry with geographical features
 * loaded from JSON data files, allowing for easy access and management of these types
 * throughout the application.
 */
export class GeographicalFeaturesFactory {
    /**
     * Static factory method to create and register geographical feature types.
     * This method populates the GeographicalFeatureTypeRegistry with geographical
     * features loaded from JSON data, each identified by a unique key.
     */
    static create(): void {
        const features = loadGeographicalFeatures();        
        features.forEach(feature => {
            GeographicalFeatureTypeRegistry.register(feature.getKey(), feature.getDisplayName());
        });
    }
}
