import { FilteredSystem } from '../../ecs/FilteredSystem';
import { EntityFilters } from '../../ecs/EntityFilters';
import { EntityManager } from '../../ecs/EntityManager';
import { Entity } from '../../ecs/Entity';
import { TypeUtils } from '../../util/TypeUtils';
import { ScrollableMenuComponent } from '../menu/ScrollableMenuComponent';
import { IsVisibleComponent } from '../rendering/IsVisibleComponent';
import { IsActiveScreenComponent } from '../rendering/IsActiveScreenComponent';
import { MenuItem } from '../menu/MenuItem';
import { ScrollStrategy } from '../menu/ScrollStrategy';
import { ChronicleComponent } from '../../chronicle/ChronicleComponent';
import { Ecs } from '../../ecs/Ecs';

/**
 * System responsible for updating ScrollableMenuComponent with chronicle content from simulation.
 * Copies chronicle events into a scrollable menu for GUI display.
 */
export class ChronicleViewSystem extends FilteredSystem {
  private readonly simulationEcs: Ecs;
  private readonly maxEvents: number;

  /**
   * Constructor for the ChronicleViewSystem.
   * @param entityManager The GUI entity manager instance.
   * @param simulationEcs The simulation ECS instance to read chronicle data from.
   * @param maxEvents Maximum number of events to display (default: 200).
   */
  constructor(entityManager: EntityManager, simulationEcs: Ecs, maxEvents = 200) {
    TypeUtils.ensureInstanceOf(entityManager, EntityManager);
    TypeUtils.ensureInstanceOf(simulationEcs, Ecs);
    TypeUtils.ensureNumber(maxEvents, 'maxEvents must be a number');
    
    // Create filter for ChronicleScreen entities
    const chronicleScreenFilter = EntityFilters.byName('ChronicleScreen');
    
    super(entityManager, [ScrollableMenuComponent, IsVisibleComponent, IsActiveScreenComponent], chronicleScreenFilter);
    this.simulationEcs = simulationEcs;
    this.maxEvents = maxEvents;
  }

  /**
   * Processes a GUI entity that should display chronicle content.
   * Updates the entity's ScrollableMenuComponent with chronicle events from simulation.
   * The FilteredSystem base class already filtered for ChronicleScreen entities.
   * @param entity The GUI entity to process.
   */
  processFilteredEntity(entity: Entity): void {
    // Only process if this entity is visible
    const isVisibleComponent = entity.getComponent(IsVisibleComponent);
    if (!isVisibleComponent || !isVisibleComponent.isVisible()) return;

    // Get the menu component 
    const menuComponent = entity.getComponent(ScrollableMenuComponent);
    if (!menuComponent) return;

    // Get chronicle component from simulation ECS
    const chronicleComponent = this.getChronicleComponent();
    if (!chronicleComponent) return;

    // Get events from chronicle component (empty array if no chronicle)
    const events = chronicleComponent.getEvents();

    // Limit to last N events for performance
    const lastEvents = events.slice(-this.maxEvents);

    // Convert chronicle events to menu items
    const menuItems = lastEvents.map((event, idx) => {
      // Try multiple methods to get event text, falling back to string representation
      let label: string;
      try {
        // Try getHeading() first as it's typically shorter and more suitable for menus
        label = event.getHeading?.() ?? event.getDescription?.() ?? event.toString?.() ?? `Event ${idx}`;
      } catch {
        // Fallback if any method fails
        label = `Event ${idx}`;
      }

      return new MenuItem(label, `CHRONICLE_SELECT_${idx}`);
    });

    // Update menu items using available API
    this.updateMenuItems(entity, menuComponent, menuItems);
  }

  /**
   * Gets the chronicle component from the simulation ECS.
   * Tries singleton pattern first, then searches entities.
   * @returns The chronicle component or undefined if not found.
   */
  private getChronicleComponent(): ChronicleComponent | undefined {
    const simEm = this.simulationEcs.getEntityManager();

    // Try singleton pattern first
    try {
      const chronicleComponent = simEm.getSingletonComponent(ChronicleComponent);
      if (chronicleComponent) {
        return chronicleComponent;
      }
    } catch {
      // Singleton method might throw if multiple entities have the component
      // Fall through to entity search
    }

    // Fall back to searching entities
    const chronicleEntities = simEm.getEntitiesWithComponents(ChronicleComponent);
    if (chronicleEntities.length > 0) {
      return chronicleEntities[0].getComponent(ChronicleComponent);
    }

    return undefined;
  }

  /**
   * Updates the menu items in the scrollable component using available API methods.
   * @param entity The entity containing the scrollable component.
   * @param scrollable The scrollable menu component to update.
   * @param menuItems The new menu items to set.
   */
  private updateMenuItems(entity: Entity, scrollable: ScrollableMenuComponent, menuItems: MenuItem[]): void {
    // Try setItems method first
    if (typeof (scrollable as any).setItems === 'function') {
      (scrollable as any).setItems(menuItems);
      return;
    }

    // Try setMenuItems method
    if (typeof (scrollable as any).setMenuItems === 'function') {
      (scrollable as any).setMenuItems(menuItems);
      return;
    }

    // Fallback: replace component with new one using factory method
    if (typeof (ScrollableMenuComponent as any).createWithItemCount === 'function') {
      const visibleCount = scrollable.getVisibleItemCount?.() ?? 10;
      const newComponent = (ScrollableMenuComponent as any).createWithItemCount(
        menuItems,
        visibleCount,
        ScrollStrategy.VERTICAL
      );

      entity.removeComponent(ScrollableMenuComponent);
      entity.addComponent(newComponent);
    }
  }

  /**
   * Static factory method to create a new ChronicleViewSystem instance.
   * @param entityManager The GUI entity manager instance.
   * @param simulationEcs The simulation ECS instance.
   * @param maxEvents Maximum number of events to display (optional).
   * @returns A new ChronicleViewSystem instance.
   */
  static create(entityManager: EntityManager, simulationEcs: Ecs, maxEvents?: number): ChronicleViewSystem {
    return new ChronicleViewSystem(entityManager, simulationEcs, maxEvents);
  }
}