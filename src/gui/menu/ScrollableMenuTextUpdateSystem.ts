import { System } from '../../ecs/System';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { ScrollableMenuComponent } from './ScrollableMenuComponent';
import { TextComponent } from '../rendering/TextComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { GuiHelper } from 'gui/GuiHelper';

/**
 * Updates a ScrollableMenuComponent into a TextComponent for display.
 * The menu shows only visible items with numbered shortcuts and scroll indicators.
 * Selected items are highlighted with a prefix.
 */
export class ScrollableMenuTextUpdateSystem extends System {

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
        const isVisibibleComponent = entity.getComponent(IsVisibleComponent);
        const textComponent = entity.getComponent(TextComponent);
        const menuComponent = entity.getComponent(ScrollableMenuComponent);

        // Exit if text component is missing
        if (!textComponent) return;

        // Exit if visibility component is missing or not visible
        if (!isVisibibleComponent || !isVisibibleComponent.isVisible()) {
            textComponent.setText('');
            return;
        }

        // Exit if menu component is missing
        if (!menuComponent) {
            textComponent.setText('');
            return;
        }

        // Build the menu display
        const menuText = this.buildMenuText(menuComponent);
        textComponent.setText(menuText);
    }

    /**
     * Builds the display text for a scrollable menu.
     * @param menu The scrollable menu component.
     * @returns The formatted menu text.
     */
    private buildMenuText(menu: ScrollableMenuComponent): string {
        const visibleItems = menu.getVisibleItems();
        const visibleIndices = menu.getVisibleIndices();
        const selectedIndex = menu.getSelectedItemIndex();
        
        if (visibleItems.length === 0) {
            return 'No choices available';
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
            
            // Format: "  [1] Choice Name - Description"
            const formattedLine = `${prefix}[${number}] ${item.getText()}`;
            lines.push(formattedLine);
        });

        // Add footer with scroll hints if needed
        const footer = this.buildFooter(menu);
        if (footer) {
            lines.push(''); // Empty line for spacing
            lines.push(footer);
        }

        const l = lines.length;
        const t1 = (l > 0) ? lines[0] : 'No menu items';
        const t2 = (l > 1) ? lines[1] : 'No menu items';
        const t3 = (l > 2) ? lines[2] : 'No menu items';
        const t4 = (l > 3) ? lines[3] : 'No menu items';
        const t5 = (l > 4) ? lines[4] : 'No menu items';
        GuiHelper.postDebugText(this.getEntityManager(),"D1", `l: ${l}`);
        GuiHelper.postDebugText(this.getEntityManager(),"D2", `t1: ${t1}`);
        GuiHelper.postDebugText(this.getEntityManager(),"D3", `t2: ${t2}`);
        GuiHelper.postDebugText(this.getEntityManager(),"D4", `t3: ${t3}`);
        GuiHelper.postDebugText(this.getEntityManager(),"D5", `t4: ${t4}`);
        GuiHelper.postDebugText(this.getEntityManager(),"D6", `t5: ${t5}`);

        return lines.join('\n');
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
            return 'Navigate: A/D keys, Select: Enter';
        }

        const scrollHints: string[] = [];
        if (canScrollUp) scrollHints.push('↑ More above');
        if (canScrollDown) scrollHints.push('↓ More below');
        
        return `Navigate: A/D keys, Select: Enter | ${scrollHints.join(' | ')}`;
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
