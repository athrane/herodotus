import { System } from '../../ecs/System';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { ScrollableMenuComponent } from './ScrollableMenuComponent';
import { TextComponent } from '../rendering/TextComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';

/**
 * Processes a ScrollableMenuComponent into a TextComponent for display.
 * The menu shows only visible items with numbered shortcuts and scroll indicators.
 * Selected items are highlighted with a prefix.
 */
export class ScrollableMenuTextUpdateSystem extends System {

    /**
     * Screen width for text wrapping calculations.
     */
    private readonly SCREEN_WIDTH = 80;

    /**
     * Creates a new ScrollableMenuTextUpdateSystem.
     * @param entityManager The entity manager for managing entities.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [ScrollableMenuComponent, TextComponent, IsVisibleComponent]);
    }

    /**
     * Processes a single entity.
     * @param entity The entity to process.
     */
    processEntity(entity: Entity): void {
        
        // Get the text component
        const textComponent = entity.getComponent(TextComponent);
        if (!textComponent) return;

        // Only process if this entity is visible
        const isVisibleComponent = entity.getComponent(IsVisibleComponent);
        if (!isVisibleComponent || !isVisibleComponent.isVisible()) {
            textComponent.setText('');
            return;
        }

        // Get the menu component
        const menuComponent = entity.getComponent(ScrollableMenuComponent);
        if (!menuComponent) {
            textComponent.setText('');
            return;
        }

        // Build the menu display
        const menuText = this.buildMenuText(menuComponent);
        textComponent.setTexts(menuText);
    }

    /**
     * Builds the display text for a scrollable menu.
     * @param menu The scrollable menu component.
     * @returns The formatted menu text.
     */
    private buildMenuText(menu: ScrollableMenuComponent): string[] {
        const visibleItems = menu.getVisibleItems();
        const visibleIndices = menu.getVisibleIndices();
        const selectedIndex = menu.getSelectedItemIndex();
        
        if (visibleItems.length === 0) {
            return ['No choices available'];
        }

        const lines: string[] = [];
        
        // Add header with scroll indicators
        const header = this.buildHeader(menu);
        if (header) {
            lines.push(header);
            lines.push(''); // Empty line for spacing
        }

        // Add visible menu items with numbers and selection indicators
        visibleItems.forEach((item, viewportIndex) => {
            const globalIndex = visibleIndices[viewportIndex];
            const isSelected = globalIndex === selectedIndex;
            const prefix = isSelected ? '> ' : '  ';
            const number = globalIndex + 1; // 1-based numbering for user display
            
            // Format and wrap the menu item text
            const menuItemLines = this.formatMenuItem(prefix, number, item.getText());
            lines.push(...menuItemLines);
        });

        // Add footer with scroll hints if needed
        const footer = this.buildFooter(menu);
        if (footer) {
            lines.push(''); // Empty line for spacing
            lines.push(footer);
        }

        return lines;
    }

    /**
     * Formats a single menu item with proper text wrapping.
     * @param prefix The selection prefix (">" or "  ").
     * @param number The menu item number.
     * @param text The menu item text.
     * @returns Array of formatted lines for this menu item.
     */
    private formatMenuItem(prefix: string, number: number, text: string): string[] {
        const firstLinePrefix = `${prefix}[${number}] `;
        const continuationPrefix = ' '.repeat(firstLinePrefix.length);
        
        // Calculate available width for text content
        const availableWidth = this.SCREEN_WIDTH - firstLinePrefix.length;
        
        // Wrap the text
        const wrappedLines = this.wrapText(text, availableWidth);
        
        // Format the lines with appropriate prefixes
        const formattedLines: string[] = [];
        wrappedLines.forEach((line, index) => {
            if (index === 0) {
                formattedLines.push(firstLinePrefix + line);
            } else {
                formattedLines.push(continuationPrefix + line);
            }
        });
        
        return formattedLines;
    }

    /**
     * Wraps text to fit within the specified width.
     * @param text The text to wrap.
     * @param maxWidth The maximum width per line.
     * @returns Array of wrapped lines.
     */
    private wrapText(text: string, maxWidth: number): string[] {
        if (!text || maxWidth <= 0) {
            return [''];
        }

        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            // Check if adding this word would exceed the line width
            const potentialLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (potentialLine.length <= maxWidth) {
                currentLine = potentialLine;
            } else {
                // If current line has content, save it and start a new line
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // Single word is too long, we need to break it
                    if (word.length > maxWidth) {
                        // Break the word across multiple lines
                        let remainingWord = word;
                        while (remainingWord.length > maxWidth) {
                            lines.push(remainingWord.substring(0, maxWidth));
                            remainingWord = remainingWord.substring(maxWidth);
                        }
                        currentLine = remainingWord;
                    } else {
                        currentLine = word;
                    }
                }
            }
        }

        // Add the last line if it has content
        if (currentLine) {
            lines.push(currentLine);
        }

        // Return at least one line (even if empty)
        return lines.length > 0 ? lines : [''];
    }

    /**
     * Builds the header with scroll indicators.
     * @param menu The scrollable menu component.
     * @returns The header text or empty string if not needed.
     */
    private buildHeader(menu: ScrollableMenuComponent): string {
        const totalItems = menu.getTotalItemCount();
        const visibleCount = menu.getVisibleItemCount();
        
        if (totalItems <= visibleCount) {
            return `*** CHOOSE YOUR ACTION ( ${totalItems} available) ***`;
        }

        const scrollOffset = menu.getScrollOffset();
        const startNum = scrollOffset + 1;
        const endNum = Math.min(scrollOffset + visibleCount, totalItems);
        
        return `*** CHOOSE YOUR ACTION *** (Showing ${startNum}-${endNum} of ${totalItems})`;
    }

    /**
     * Builds the footer with navigation hints.
     * @param menu The scrollable menu component.
     * @returns The footer text or empty string if not needed.
     */
    private buildFooter(menu: ScrollableMenuComponent): string {
        const canScrollUp = menu.canScrollUp();
        const canScrollDown = menu.canScrollDown();
        
        if (!canScrollUp && !canScrollDown) {
            return 'Navigate: W/S keys, Select: Enter';
        }

        const scrollHints: string[] = [];
        if (canScrollUp) scrollHints.push('↑ More above');
        if (canScrollDown) scrollHints.push('↓ More below');

        return `Navigate: W/S keys, Select: Enter | ${scrollHints.join(' | ')}`;
    }

    /**
     * Creates a new ScrollableMenuTextUpdateSystem.
     * @param entityManager The entity manager for managing entities.
     * @returns A new instance of ScrollableMenuTextUpdateSystem.
     */
    static create(entityManager: EntityManager): ScrollableMenuTextUpdateSystem {
        return new ScrollableMenuTextUpdateSystem(entityManager);
    }
}
