import { loadGeographicalFeatures } from '../../../../src/data/geography/feature/loadGeographicalFeatures';
import { GeographicalFeatureData } from '../../../../src/data/geography/feature/GeographicalFeatureData';

// Mock the JSON data to ensure predictable test results
jest.mock('../../../../data/geography/feature/geographical-features.json', () => ({
  MOUNTAIN: {
    key: 'MOUNTAIN',
    displayName: 'Mountain'
  },
  RIVER: {
    key: 'RIVER',
    displayName: 'River'
  },
  LAKE: {
    key: 'LAKE',
    displayName: 'Lake'
  }
}), { virtual: true });

describe('loadGeographicalFeatures', () => {
  it('should load and deserialize geographical features from JSON', () => {
    const features = loadGeographicalFeatures();
    
    expect(features.length).toBe(3);
    expect(features[0]).toBeInstanceOf(GeographicalFeatureData);
    
    // Features should be sorted alphabetically by key
    expect(features[0].getKey()).toBe('LAKE');
    expect(features[0].getDisplayName()).toBe('Lake');
    
    expect(features[1].getKey()).toBe('MOUNTAIN');
    expect(features[1].getDisplayName()).toBe('Mountain');
    
    expect(features[2].getKey()).toBe('RIVER');
    expect(features[2].getDisplayName()).toBe('River');
  });

  it('should return the same results on multiple calls', () => {
    const features1 = loadGeographicalFeatures();
    const features2 = loadGeographicalFeatures();
    
    expect(features1.length).toBe(features2.length);
    expect(features1.map(f => f.getKey())).toEqual(features2.map(f => f.getKey()));
    expect(features1.map(f => f.getDisplayName())).toEqual(features2.map(f => f.getDisplayName()));
  });
});