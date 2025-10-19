import { ClaimStatus } from '../../src/realm/ClaimStatus';

describe('ClaimStatus', () => {
    it('should have Core status', () => {
        expect(ClaimStatus.Core).toBe('Core');
    });

    it('should have Claimed status', () => {
        expect(ClaimStatus.Claimed).toBe('Claimed');
    });

    it('should have Contested status', () => {
        expect(ClaimStatus.Contested).toBe('Contested');
    });

    it('should have exactly three statuses', () => {
        const statuses = Object.values(ClaimStatus);
        expect(statuses).toHaveLength(3);
        expect(statuses).toContain('Core');
        expect(statuses).toContain('Claimed');
        expect(statuses).toContain('Contested');
    });
});
