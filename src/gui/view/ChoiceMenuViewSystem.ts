import { FilteredSystem } from '../../ecs/FilteredSystem';
import { EntityFilters } from '../../ecs/EntityFilters';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { Ecs } from '../../ecs/Ecs';
import { TypeUtils } from '../../util/TypeUtils';
import { ScrollableMenuComponent } from '../menu/ScrollableMenuComponent';
import { MenuItem } from '../menu/MenuItem';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { ChoiceComponent } from '../../behaviour/ChoiceComponent';
import { PlayerComponent } from '../../ecs/PlayerComponent';
import { DataSetEvent } from '../../data/DataSetEvent';
import { IsActiveScreenComponent } from '../../gui/rendering/IsActiveScreenComponent';
import { TimeComponent } from '../../time/TimeComponent';
import { GuiHelper } from '../../gui/GuiHelper';
import { NameComponent } from '../../ecs/NameComponent';

/**
 * System that populates choice menu items from the player's ChoiceComponent.
 * Updates ScrollableMenuComponent with current available choices from the simulation.
 */
export class ChoiceMenuViewSystem extends FilteredSystem {
    private readonly simulationEcs: Ecs;

    /**
     * Maximum line width for menu items (accounting for menu formatting).
     * Screen is 80 chars, menu format is "> [N] " which is 6 chars, leaving 74 for content.
     */
    private readonly MAX_LINE_WIDTH = 74;

    /**
    * Creates a new ChoiceMenuViewSystem.
     * @param guiEntityManager The GUI entity manager.
     * @param simulationEcs The simulation ECS instance to read choices from.
     */
    constructor(guiEntityManager: EntityManager, simulationEcs: Ecs) {
        super(guiEntityManager, [ScrollableMenuComponent, IsVisibleComponent, IsActiveScreenComponent], EntityFilters.byName('ChoicesScreen'));
        TypeUtils.ensureInstanceOf(simulationEcs, Ecs);
        this.simulationEcs = simulationEcs;
    }

    /**
     * Processes a single choice menu entity that has already passed the name filter.
     * @param entity The entity to process.
     */
    processFilteredEntity(entity: Entity): void {
        // Only process if this entity is visible
        const isVisibleComponent = entity.getComponent(IsVisibleComponent);
        if (!isVisibleComponent || !isVisibleComponent.isVisible()) return;

        // Debug: Display current year from simulation time component
        const timeComponent = this.simulationEcs.getEntityManager().getSingletonComponent(TimeComponent);
        const year = timeComponent ? timeComponent.getTime().getYear() : 0;
        const entityName = entity.getComponent(NameComponent)?.getText() || "Unnamed";
        GuiHelper.postDebugText(this.getEntityManager(), "D2", `ChoiceMenuViewSystem:Year: ${entityName} | ${year}`);

        // Get the menu component 
        const menuComponent = entity.getComponent(ScrollableMenuComponent);
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
        const playerEntities = this.simulationEcs.getEntityManager().getEntitiesWithComponents(PlayerComponent);
        if (playerEntities.length === 0) return [];

        // Get the first player entity
        const playerEntity = playerEntities[0];

        // Exit if no choice component is found
        const choiceComponent = playerEntity.getComponent(ChoiceComponent);
        if (!choiceComponent) return [];

        return choiceComponent.getChoices() as DataSetEvent[];
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
     * Supports multi-line text that wraps to fit within screen width.
     * @param choice The DataSetEvent to format.
     * @returns Formatted text string that may contain newlines for wrapping.
     */
    private formatChoiceText(choice: DataSetEvent): string {
        const name = choice.getEventName() || 'Unnamed Choice';
        const description = choice.getDescription();

        let fullText = name;
        if (description && description.trim().length > 0) {
            fullText = `${name} - ${description}`;
        }

        // Return text as-is, wrapping will be handled by ScrollableMenuTextUpdateSystem
        return fullText;
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
     * Creates a new ChoiceMenuViewSystem.
     * @param guiEntityManager The GUI entity manager.
     * @param simulationEcs The simulation ECS instance.
     * @returns A new ChoiceMenuViewSystem instance.
     */
    static create(guiEntityManager: EntityManager, simulationEcs: Ecs): ChoiceMenuViewSystem {
        return new ChoiceMenuViewSystem(guiEntityManager, simulationEcs);
    }
}
