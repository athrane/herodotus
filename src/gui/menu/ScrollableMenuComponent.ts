import { MenuComponent } from './MenuComponent';
import { MenuItem } from './MenuItem';
import { ScrollStrategy } from './ScrollStrategy';
import { TypeUtils } from '../../util/TypeUtils';

/**
 * A scrollable menu component that extends MenuComponent with viewport capabilities.
 * Only displays a fixed number of items at a time, allowing scrolling through larger lists.
 */
export class ScrollableMenuComponent extends MenuComponent {
    private readonly visibleItemCount: number;
    private scrollOffset: number = 0;

    /**
     * Constructs a ScrollableMenuComponent with the given menu items and visible item count.
     * @param items The menu items to include in the menu.
     * @param visibleItemCount The number of items to display at once (default: 3).
     * @param scrollStrategy The scroll strategy for navigation (defaults to HORIZONTAL).
     */
    constructor(items: MenuItem[], visibleItemCount: number = 3, scrollStrategy?: ScrollStrategy) {
        super(items, scrollStrategy);
        TypeUtils.ensureNumber(visibleItemCount, "visibleItemCount must be a number");
        if (visibleItemCount <= 0) {
            throw new Error("visibleItemCount must be greater than 0");
        }
        this.visibleItemCount = visibleItemCount;
    }

    /**
     * Gets the number of items visible at once.
     * @returns The visible item count.
     */
    getVisibleItemCount(): number {
        return this.visibleItemCount;
    }

    /**
     * Gets the current scroll offset.
     * @returns The scroll offset.
     */
    getScrollOffset(): number {
        return this.scrollOffset;
    }

    /**
     * Gets the currently visible menu items based on scroll offset.
     * @returns Array of visible menu items.
     */
    getVisibleItems(): MenuItem[] {
        const allItems = this.getItems();
        if (allItems.length === 0) return [];
        
        const startIndex = this.scrollOffset;
        const endIndex = Math.min(startIndex + this.visibleItemCount, allItems.length);
        return allItems.slice(startIndex, endIndex);
    }

    /**
     * Gets the visible indices (for numbering display).
     * @returns Array of indices for the visible items.
     */
    getVisibleIndices(): number[] {
        const allItems = this.getItems();
        if (allItems.length === 0) return [];
        
        const startIndex = this.scrollOffset;
        const endIndex = Math.min(startIndex + this.visibleItemCount, allItems.length);
        return Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);
    }

    /**
     * Sets the selected index, wrapping around the items array and updating scroll offset.
     * @param index The new selected index.
     */
    setSelectedItemIndex(index: number): void {
        // Call parent method to set the selection
        super.setSelectedItemIndex(index);
        
        // Update scroll offset to keep selected item visible
        this.updateScrollOffset();
    }

    /**
     * Select the next item with automatic scrolling.
     */
    selectNext(): void {
        const items = this.getItems();
        if (items.length === 0) return;

        const currentIndex = this.getSelectedItemIndex();
        const nextIndex = (currentIndex + 1) % items.length;
        this.setSelectedItemIndex(nextIndex);
        
        // Update scroll offset to keep selected item visible
        this.updateScrollOffset();
    }

    /**
     * Select the previous item with automatic scrolling.
     */
    selectPrevious(): void {
        const items = this.getItems();
        if (items.length === 0) return;

        const currentIndex = this.getSelectedItemIndex();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        this.setSelectedItemIndex(prevIndex);
        
        // Update scroll offset to keep selected item visible
        this.updateScrollOffset();
    }

    /**
     * Updates the scroll offset to ensure the selected item is visible.
     */
    private updateScrollOffset(): void {
        const selectedIndex = this.getSelectedItemIndex();
        const items = this.getItems();
        
        if (items.length === 0) {
            this.scrollOffset = 0;
            return;
        }

        // Calculate bounds
        const maxScrollOffset = Math.max(0, items.length - this.visibleItemCount);

        // If selected item is above visible area, scroll up
        if (selectedIndex < this.scrollOffset) {
            this.scrollOffset = selectedIndex;
        }
        // If selected item is below visible area, scroll down
        else if (selectedIndex >= this.scrollOffset + this.visibleItemCount) {
            this.scrollOffset = selectedIndex - this.visibleItemCount + 1;
        }

        // Ensure scroll offset stays within bounds
        this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, maxScrollOffset));
    }

    /**
     * Checks if there are more items above the current viewport.
     * @returns True if scrolling up would show more items.
     */
    canScrollUp(): boolean {
        return this.scrollOffset > 0;
    }

    /**
     * Checks if there are more items below the current viewport.
     * @returns True if scrolling down would show more items.
     */
    canScrollDown(): boolean {
        const items = this.getItems();
        return this.scrollOffset + this.visibleItemCount < items.length;
    }

    /**
     * Gets the total number of items.
     * @returns The total item count.
     */
    getTotalItemCount(): number {
        return this.getItems().length;
    }

    /**
     * Creates a new ScrollableMenuComponent.
     * @param items The menu items to include in the menu.
     * @param visibleItemCount The number of items to display at once.
     * @returns A new ScrollableMenuComponent instance.
     */
    static create(items: MenuItem[], visibleItemCount: number = 3): ScrollableMenuComponent {
        return new ScrollableMenuComponent(items, visibleItemCount);
    }
}
