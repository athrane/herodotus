import { ScrollableMenuComponent } from '../../../src/gui/menu/ScrollableMenuComponent';
import { MenuItem } from '../../../src/gui/menu/MenuItem';

describe('ScrollableMenuComponent', () => {
    test('creates with valid parameters', () => {
        const items = [
            new MenuItem('Item 1', 'action1'),
            new MenuItem('Item 2', 'action2'),
            new MenuItem('Item 3', 'action3')
        ];
        const menu = new ScrollableMenuComponent(items, 2);
        
        expect(menu.getItems()).toHaveLength(3);
        expect(menu.getVisibleItemCount()).toBe(2);
        expect(menu.getScrollOffset()).toBe(0);
        expect(menu.getSelectedItemIndex()).toBe(0);
    });

    test('uses default visible item count of 3', () => {
        const items = [new MenuItem('Item 1', 'action1')];
        const menu = new ScrollableMenuComponent(items);
        
        expect(menu.getVisibleItemCount()).toBe(3);
    });

    test('throws error for invalid visible item count', () => {
        const items = [new MenuItem('Item 1', 'action1')];
        
        expect(() => new ScrollableMenuComponent(items, 0)).toThrow('visibleItemCount must be greater than 0');
        expect(() => new ScrollableMenuComponent(items, -1)).toThrow('visibleItemCount must be greater than 0');
    });

    test('returns correct visible items with no scrolling needed', () => {
        const items = [
            new MenuItem('Item 1', 'action1'),
            new MenuItem('Item 2', 'action2')
        ];
        const menu = new ScrollableMenuComponent(items, 3);
        
        const visibleItems = menu.getVisibleItems();
        const visibleIndices = menu.getVisibleIndices();
        
        expect(visibleItems).toHaveLength(2);
        expect(visibleItems[0].getText()).toBe('Item 1');
        expect(visibleItems[1].getText()).toBe('Item 2');
        expect(visibleIndices).toEqual([0, 1]);
    });

    test('returns correct visible items with scrolling', () => {
        const items = [
            new MenuItem('Item 1', 'action1'),
            new MenuItem('Item 2', 'action2'),
            new MenuItem('Item 3', 'action3'),
            new MenuItem('Item 4', 'action4'),
            new MenuItem('Item 5', 'action5')
        ];
        const menu = new ScrollableMenuComponent(items, 3);
        
        // Initially shows first 3 items
        let visibleItems = menu.getVisibleItems();
        let visibleIndices = menu.getVisibleIndices();
        expect(visibleItems).toHaveLength(3);
        expect(visibleItems.map(item => item.getText())).toEqual(['Item 1', 'Item 2', 'Item 3']);
        expect(visibleIndices).toEqual([0, 1, 2]);
        
        // Navigate to force scrolling
        menu.setSelectedItemIndex(4); // Select last item
        
        // Should now show last 3 items
        visibleItems = menu.getVisibleItems();
        visibleIndices = menu.getVisibleIndices();
        expect(visibleItems).toHaveLength(3);
        expect(visibleItems.map(item => item.getText())).toEqual(['Item 3', 'Item 4', 'Item 5']);
        expect(visibleIndices).toEqual([2, 3, 4]);
    });

    test('handles empty menu gracefully', () => {
        const menu = new ScrollableMenuComponent([], 3);
        
        expect(menu.getVisibleItems()).toHaveLength(0);
        expect(menu.getVisibleIndices()).toHaveLength(0);
        expect(menu.canScrollUp()).toBe(false);
        expect(menu.canScrollDown()).toBe(false);
        expect(menu.getTotalItemCount()).toBe(0);
    });

    test('selectNext with auto-scrolling', () => {
        const items = [
            new MenuItem('Item 1', 'action1'),
            new MenuItem('Item 2', 'action2'),
            new MenuItem('Item 3', 'action3'),
            new MenuItem('Item 4', 'action4'),
            new MenuItem('Item 5', 'action5')
        ];
        const menu = new ScrollableMenuComponent(items, 3);
        
        // Start at index 0, scroll offset 0
        expect(menu.getSelectedItemIndex()).toBe(0);
        expect(menu.getScrollOffset()).toBe(0);
        
        // Move to index 2 (still visible)
        menu.selectNext();
        menu.selectNext();
        expect(menu.getSelectedItemIndex()).toBe(2);
        expect(menu.getScrollOffset()).toBe(0); // No scrolling needed yet
        
        // Move to index 3 (forces scroll)
        menu.selectNext();
        expect(menu.getSelectedItemIndex()).toBe(3);
        expect(menu.getScrollOffset()).toBe(1); // Scrolled to keep item visible
        
        // Move to index 4 (forces more scroll)
        menu.selectNext();
        expect(menu.getSelectedItemIndex()).toBe(4);
        expect(menu.getScrollOffset()).toBe(2); // Scrolled to show last 3 items
        
        // Wrap around to index 0 (forces scroll back)
        menu.selectNext();
        expect(menu.getSelectedItemIndex()).toBe(0);
        expect(menu.getScrollOffset()).toBe(0); // Scrolled back to start
    });

    test('selectPrevious with auto-scrolling', () => {
        const items = [
            new MenuItem('Item 1', 'action1'),
            new MenuItem('Item 2', 'action2'),
            new MenuItem('Item 3', 'action3'),
            new MenuItem('Item 4', 'action4'),
            new MenuItem('Item 5', 'action5')
        ];
        const menu = new ScrollableMenuComponent(items, 3);
        
        // Start at index 0, go to last item
        menu.selectPrevious();
        expect(menu.getSelectedItemIndex()).toBe(4);
        expect(menu.getScrollOffset()).toBe(2); // Scrolled to show last 3 items (2,3,4)
        
        // Move backwards - item 3 should still be visible at scroll offset 2
        menu.selectPrevious();
        expect(menu.getSelectedItemIndex()).toBe(3);
        expect(menu.getScrollOffset()).toBe(2); // Still showing items 2,3,4
        
        // Move backwards - item 2 should still be visible at scroll offset 2  
        menu.selectPrevious();
        expect(menu.getSelectedItemIndex()).toBe(2);
        expect(menu.getScrollOffset()).toBe(2); // Still showing items 2,3,4
        
        // Move backwards - item 1 is not visible, must scroll up
        menu.selectPrevious();
        expect(menu.getSelectedItemIndex()).toBe(1);
        expect(menu.getScrollOffset()).toBe(1); // Scrolled up to show items 1,2,3
    });

    test('scroll indicators work correctly', () => {
        const items = [
            new MenuItem('Item 1', 'action1'),
            new MenuItem('Item 2', 'action2'),
            new MenuItem('Item 3', 'action3'),
            new MenuItem('Item 4', 'action4'),
            new MenuItem('Item 5', 'action5')
        ];
        const menu = new ScrollableMenuComponent(items, 3);
        
        // At start - can only scroll down
        expect(menu.canScrollUp()).toBe(false);
        expect(menu.canScrollDown()).toBe(true);
        
        // Move to middle - can scroll both ways
        menu.setSelectedItemIndex(2);
        expect(menu.getScrollOffset()).toBe(0);
        menu.selectNext(); // Forces scroll
        expect(menu.canScrollUp()).toBe(true);
        expect(menu.canScrollDown()).toBe(true);
        
        // Move to end - can only scroll up
        menu.setSelectedItemIndex(4);
        expect(menu.canScrollUp()).toBe(true);
        expect(menu.canScrollDown()).toBe(false);
    });

    test('static create method works', () => {
        const items = [new MenuItem('Test', 'action')];
        const menu = ScrollableMenuComponent.create(items, 2);
        
        expect(menu).toBeInstanceOf(ScrollableMenuComponent);
        expect(menu.getVisibleItemCount()).toBe(2);
        expect(menu.getItems()).toHaveLength(1);
    });

    test('handles single item menu', () => {
        const items = [new MenuItem('Only Item', 'action1')];
        const menu = new ScrollableMenuComponent(items, 3);
        
        expect(menu.getVisibleItems()).toHaveLength(1);
        expect(menu.canScrollUp()).toBe(false);
        expect(menu.canScrollDown()).toBe(false);
        
        // Navigation should still work (wrapping)
        menu.selectNext();
        expect(menu.getSelectedItemIndex()).toBe(0);
        
        menu.selectPrevious();
        expect(menu.getSelectedItemIndex()).toBe(0);
    });

    test('visible item count larger than total items', () => {
        const items = [
            new MenuItem('Item 1', 'action1'),
            new MenuItem('Item 2', 'action2')
        ];
        const menu = new ScrollableMenuComponent(items, 5);
        
        expect(menu.getVisibleItems()).toHaveLength(2);
        expect(menu.getVisibleIndices()).toEqual([0, 1]);
        expect(menu.canScrollUp()).toBe(false);
        expect(menu.canScrollDown()).toBe(false);
    });
});
