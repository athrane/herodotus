import { TerritoryClaimComponent } from '../../src/realm/TerritoryClaimComponent';
import { ClaimStatus } from '../../src/realm/ClaimStatus';

describe('TerritoryClaimComponent', () => {
    describe('constructor and factory', () => {
        it('should create empty component', () => {
            const component = TerritoryClaimComponent.create();
            
            expect(component.getClaimCount()).toBe(0);
            expect(component.hasContestingClaims()).toBe(false);
        });
    });

    describe('claim management', () => {
        let component: TerritoryClaimComponent;

        beforeEach(() => {
            component = TerritoryClaimComponent.create();
        });

        it('should add single claim', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            
            expect(component.hasClaim('realm-001')).toBe(true);
            expect(component.getClaimStatus('realm-001')).toBe(ClaimStatus.Core);
            expect(component.getClaimCount()).toBe(1);
        });

        it('should add multiple claims', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            component.addClaim('realm-002', ClaimStatus.Claimed);
            component.addClaim('realm-003', ClaimStatus.Contested);
            
            expect(component.getClaimCount()).toBe(3);
            expect(component.hasContestingClaims()).toBe(true);
        });

        it('should remove claim', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            component.removeClaim('realm-001');
            
            expect(component.hasClaim('realm-001')).toBe(false);
            expect(component.getClaimCount()).toBe(0);
        });

        it('should update existing claim', () => {
            component.addClaim('realm-001', ClaimStatus.Claimed);
            component.addClaim('realm-001', ClaimStatus.Core);
            
            expect(component.getClaimStatus('realm-001')).toBe(ClaimStatus.Core);
            expect(component.getClaimCount()).toBe(1);
        });

        it('should throw error for empty realm ID in addClaim', () => {
            expect(() => component.addClaim('', ClaimStatus.Core))
                .toThrow('Realm ID must be a non-empty string.');
        });

        it('should throw error for invalid claim status', () => {
            expect(() => component.addClaim('realm-001', 'InvalidStatus' as any))
                .toThrow('Status must be a valid ClaimStatus.');
        });
    });

    describe('contesting claims', () => {
        let component: TerritoryClaimComponent;

        beforeEach(() => {
            component = TerritoryClaimComponent.create();
        });

        it('should detect no contesting claims for single claim', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            expect(component.hasContestingClaims()).toBe(false);
        });

        it('should detect contesting claims for multiple claims', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            component.addClaim('realm-002', ClaimStatus.Claimed);
            expect(component.hasContestingClaims()).toBe(true);
        });

        it('should clear contesting claims when reduced to one', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            component.addClaim('realm-002', ClaimStatus.Claimed);
            component.removeClaim('realm-002');
            expect(component.hasContestingClaims()).toBe(false);
        });
    });

    describe('controlling realm', () => {
        let component: TerritoryClaimComponent;

        beforeEach(() => {
            component = TerritoryClaimComponent.create();
        });

        it('should return controlling realm for single core claim', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            expect(component.getControllingRealm()).toBe('realm-001');
        });

        it('should return null for no core claims', () => {
            component.addClaim('realm-001', ClaimStatus.Claimed);
            expect(component.getControllingRealm()).toBeNull();
        });

        it('should return null for multiple core claims', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            component.addClaim('realm-002', ClaimStatus.Core);
            expect(component.getControllingRealm()).toBeNull();
        });

        it('should return controlling realm even with other non-core claims', () => {
            component.addClaim('realm-001', ClaimStatus.Core);
            component.addClaim('realm-002', ClaimStatus.Claimed);
            component.addClaim('realm-003', ClaimStatus.Contested);
            expect(component.getControllingRealm()).toBe('realm-001');
        });
    });

    describe('getClaims', () => {
        it('should return defensive copy', () => {
            const component = TerritoryClaimComponent.create();
            component.addClaim('realm-001', ClaimStatus.Core);
            
            const claims = component.getClaims();
            expect(claims.get('realm-001')).toBe(ClaimStatus.Core);
            
            // Verify it's a defensive copy (readonly)
            expect(claims).toBeInstanceOf(Map);
            expect(claims.size).toBe(1);
        });
    });
});
