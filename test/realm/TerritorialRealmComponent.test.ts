import { TerritorialRealmComponent } from '../../src/realm/TerritorialRealmComponent';
import { ClaimStatus } from '../../src/realm/ClaimStatus';

describe('TerritorialRealmComponent', () => {
    describe('constructor and factory', () => {
        it('should create with valid parameters', () => {
            const component = TerritorialRealmComponent.create('Terran Dominion', 2500);
            
            expect(component.getName()).toBe('Terran Dominion');
            expect(component.getFoundingYear()).toBe(2500);
            expect(component.getPlanetCount()).toBe(0);
        });

        it('should throw error for empty name', () => {
            expect(() => TerritorialRealmComponent.create('', 2500))
                .toThrow('TerritorialRealmComponent name must be a non-empty string.');
        });

        it('should throw error for non-string name', () => {
            expect(() => TerritorialRealmComponent.create(123 as any, 2500))
                .toThrow('TerritorialRealmComponent name must be a non-empty string.');
        });

        it('should throw error for non-number founding year', () => {
            expect(() => TerritorialRealmComponent.create('Test Realm', '2500' as any))
                .toThrow('TerritorialRealmComponent foundingYear must be a number.');
        });
    });

    describe('planet management', () => {
        let component: TerritorialRealmComponent;

        beforeEach(() => {
            component = TerritorialRealmComponent.create('Test Realm', 2500);
        });

        it('should add planet with Core status', () => {
            component.addPlanet('planet-001', ClaimStatus.Core);
            
            expect(component.hasPlanet('planet-001')).toBe(true);
            expect(component.getClaimStatus('planet-001')).toBe(ClaimStatus.Core);
            expect(component.getPlanetCount()).toBe(1);
        });

        it('should add planet with Claimed status', () => {
            component.addPlanet('planet-002', ClaimStatus.Claimed);
            
            expect(component.hasPlanet('planet-002')).toBe(true);
            expect(component.getClaimStatus('planet-002')).toBe(ClaimStatus.Claimed);
        });

        it('should add planet with Contested status', () => {
            component.addPlanet('planet-003', ClaimStatus.Contested);
            
            expect(component.hasPlanet('planet-003')).toBe(true);
            expect(component.getClaimStatus('planet-003')).toBe(ClaimStatus.Contested);
        });

        it('should add multiple planets', () => {
            component.addPlanet('planet-001', ClaimStatus.Core);
            component.addPlanet('planet-002', ClaimStatus.Core);
            component.addPlanet('planet-003', ClaimStatus.Claimed);
            
            expect(component.getPlanetCount()).toBe(3);
            expect(component.getPlanets()).toEqual(['planet-001', 'planet-002', 'planet-003']);
        });

        it('should remove planet', () => {
            component.addPlanet('planet-001', ClaimStatus.Core);
            component.removePlanet('planet-001');
            
            expect(component.hasPlanet('planet-001')).toBe(false);
            expect(component.getPlanetCount()).toBe(0);
        });

        it('should get core planets only', () => {
            component.addPlanet('planet-001', ClaimStatus.Core);
            component.addPlanet('planet-002', ClaimStatus.Claimed);
            component.addPlanet('planet-003', ClaimStatus.Core);
            component.addPlanet('planet-004', ClaimStatus.Contested);
            
            const corePlanets = component.getCorePlanets();
            expect(corePlanets).toHaveLength(2);
            expect(corePlanets).toContain('planet-001');
            expect(corePlanets).toContain('planet-003');
        });

        it('should return null for non-existent planet claim status', () => {
            expect(component.getClaimStatus('non-existent')).toBeNull();
        });

        it('should throw error for empty planet ID in addPlanet', () => {
            expect(() => component.addPlanet('', ClaimStatus.Core))
                .toThrow('Planet ID must be a non-empty string.');
        });

        it('should throw error for invalid claim status', () => {
            expect(() => component.addPlanet('planet-001', 'InvalidStatus' as any))
                .toThrow('Status must be a valid ClaimStatus.');
        });
    });
});
