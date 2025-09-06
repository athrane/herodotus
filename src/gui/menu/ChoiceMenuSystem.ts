import { System } from '../../ecs/System';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { ScrollableMenuComponent } from './ScrollableMenuComponent';
import { MenuItem } from './MenuItem';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { DilemmaComponent } from '../../behaviour/DilemmaComponent';
import { PlayerComponent } from '../../ecs/PlayerComponent';
import { DataSetEvent } from '../../data/DataSetEvent';

/**
 * System that populates choice menu items from the player's DilemmaComponent.
 * Updates ScrollableMenuComponent with current available choices from the simulation.
 */
export class ChoiceMenuSystem extends System {
    private readonly simulationEntityManager: EntityManager;

    /**
     * Maximum description length for menu items.
     */
    private readonly MAX_DESC_LENGTH = 60;
    
    /**
     * Creates a new ChoiceMenuSystem.
     * @param guiEntityManager The GUI entity manager.
     * @param simulationEntityManager The simulation entity manager to read choices from.
     */
    constructor(guiEntityManager: EntityManager, simulationEntityManager: EntityManager) {
        super(guiEntityManager, [ScrollableMenuComponent, IsVisibleComponent]);
        this.simulationEntityManager = simulationEntityManager;
    }

    /**
     * Processes a single choice menu entity.
     * @param entity The entity to process.
     */
    processEntity(entity: Entity): void {
        const isVisibleComponent = entity.getComponent(IsVisibleComponent);
        const menuComponent = entity.getComponent(ScrollableMenuComponent);

        // Exit if visibility component is missing or not visible
        if (!isVisibleComponent) return;
        if (!isVisibleComponent.isVisible()) return;

        // Exit if menu component is missing
        if (!menuComponent) return;

        // Get choices from simulation
        const choices = this.getPlayerChoices();
        
        // Convert choices to menu items
        const menuItems = this.createMenuItemsFromChoices(choices);
        
        // Update menu with new items, preserving selection where possible
        this.updateMenuItems(menuComponent, menuItems);
    }

    /**
     * Gets the current player choices from the simulation.
     * @returns Array of DataSetEvent choices or empty array if none available.
     */
    private getPlayerChoices(): DataSetEvent[] {
        // Find player entity in simulation
        const playerEntities = this.simulationEntityManager.getEntitiesWithComponents(PlayerComponent);
        if (playerEntities.length === 0) return [];

        // Get the first player entity
        const playerEntity = playerEntities[0];
        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);

        // Exit if no dilemma component is found
        if (!dilemmaComponent) return [];

        return dilemmaComponent.getChoices() as DataSetEvent[];
    }

    /**
     * Creates menu items from DataSetEvent choices.
     * @param choices Array of DataSetEvent objects.
     * @returns Array of MenuItem objects.
     */
    private createMenuItemsFromChoices(choices: DataSetEvent[]): MenuItem[] {
        return choices.map((choice, index) => {
            const text = this.formatChoiceText(choice);
            const actionID = `CHOICE_SELECT_${index}`;
            const hotkey = (index + 1).toString(); // 1-based numbering for hotkeys
            
            return new MenuItem(text, actionID, hotkey);
        });
    }

    /**
     * Formats a DataSetEvent into display text for menu items.
     * @param choice The DataSetEvent to format.
     * @returns Formatted text string.
     */
    private formatChoiceText(choice: DataSetEvent): string {
        const name = choice.getEventName() || 'Unnamed Choice';
        const description = choice.getDescription();
        
        if (description && description.trim().length > 0) {
            // Truncate long descriptions for menu display
            const truncatedDesc = description.length > this.MAX_DESC_LENGTH
                ? description.substring(0, this.MAX_DESC_LENGTH) + '...'
                : description;
            return `${name} - ${truncatedDesc}`;
        }
        
        return name;
    }

    /**
     * Updates menu items while preserving selection state where possible.
     * @param menu The scrollable menu component to update.
     * @param newItems The new menu items.
     */
    private updateMenuItems(menu: ScrollableMenuComponent, newItems: MenuItem[]): void {
        const currentItems = menu.getItems();
        const currentSelectedIndex = menu.getSelectedItemIndex();
        
        // Check if items actually changed to avoid unnecessary updates
        if (this.areMenuItemsEqual(currentItems, newItems)) {
            return;
        }

        // Store currently selected item for restoration
        const currentSelectedItem = currentItems[currentSelectedIndex];
        
        // Update items (this will reset selection to 0)
        menu.getItems().length = 0; // Clear current items
        menu.getItems().push(...newItems);
        
        // Try to restore selection to same item or stay at same index
        if (currentSelectedItem && newItems.length > 0) {
            // Try to find same item by action ID
            const matchingIndex = newItems.findIndex(item => 
                item.getActionID() === currentSelectedItem.getActionID());
            
            if (matchingIndex >= 0) {
                menu.setSelectedItemIndex(matchingIndex);
            } else {
                // Fall back to same index if within bounds
                const safeBoundedIndex = Math.min(currentSelectedIndex, newItems.length - 1);
                menu.setSelectedItemIndex(Math.max(0, safeBoundedIndex));
            }
        }
    }

    /**
     * Checks if two arrays of menu items are equivalent.
     * @param items1 First array of menu items.
     * @param items2 Second array of menu items.
     * @returns True if the arrays are equivalent.
     */
    private areMenuItemsEqual(items1: MenuItem[], items2: MenuItem[]): boolean {
        if (items1.length !== items2.length) {
            return false;
        }

        for (let i = 0; i < items1.length; i++) {
            if (items1[i].getText() !== items2[i].getText() || 
                items1[i].getActionID() !== items2[i].getActionID()) {
                return false;
            }
        }

        return true;
    }

    /**
     * Creates a new ChoiceMenuSystem.
     * @param guiEntityManager The GUI entity manager.
     * @param simulationEntityManager The simulation entity manager.
     * @returns A new ChoiceMenuSystem instance.
     */
    static create(guiEntityManager: EntityManager, simulationEntityManager: EntityManager): ChoiceMenuSystem {
        return new ChoiceMenuSystem(guiEntityManager, simulationEntityManager);
    }
}
