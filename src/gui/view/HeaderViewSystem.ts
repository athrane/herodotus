import { FilteredSystem } from '../../ecs/FilteredSystem';
import { EntityManager } from '../../ecs/EntityManager';
import { NameComponent } from '../../ecs/NameComponent';
import { TextComponent } from '../rendering/TextComponent';
import { Entity } from '../../ecs/Entity';
import { Ecs } from '../../ecs/Ecs';
import { TimeComponent } from '../../time/TimeComponent';
import { EntityFilters } from '../../ecs/EntityFilters';
import { TypeUtils } from '../../util/TypeUtils';

/**
 * System responsible for updating the header text entity with current game status.
 */
export class HeaderViewSystem extends FilteredSystem {
    private simulationEcs: Ecs;

    /**
     * Name of the header entity.
     */
    public static HEADER_ENTITY_NAME = 'Header';

    /**
     * Constructor for the HeaderViewSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @param simulationEcs The simulation ECS instance to get header info from.
     */
    constructor(entityManager: EntityManager, simulationEcs: Ecs) {
        TypeUtils.ensureInstanceOf(entityManager, EntityManager);
        TypeUtils.ensureInstanceOf(simulationEcs, Ecs);
        const filter = EntityFilters.byName(HeaderViewSystem.HEADER_ENTITY_NAME);
        super(entityManager, [NameComponent, TextComponent], filter);
        this.simulationEcs = simulationEcs;
    }
    processFilteredEntity(entity: Entity): void {
        // Get the text component (NameComponent presence is enforced by the filter)
        const textComponent = entity.getComponent(TextComponent);
        if (!textComponent) return;

        // Compute header string and update the text
        const headerString = this.computeHeaderString(this.simulationEcs);
        textComponent.setText(headerString);
    }

    /**
     * Computes the header string for the GUI.
     * @param simulationEcs The simulation ECS instance.
     * @returns The header string.
     */
    private computeHeaderString(simulationEcs: Ecs): string {
        const currentYear = this.computeYear(simulationEcs);
        const simulationState = 'Running'; // Default value since we don't have direct access to simulation state
        return `Year: ${currentYear} | Simulation: ${simulationState} | Herodotus 1.0.0`;
    }

    /**
     * Computes the current year from the simulation's time component.
     * @param simulationEcs The simulation ECS instance.
     * @returns The current year as a string.
     */
    private computeYear(simulationEcs: Ecs): string {
        const entityManager = simulationEcs.getEntityManager();
        const timeComponent = entityManager.getSingletonComponent(TimeComponent);
        if (!timeComponent) {
            return '0000';
        }
        return timeComponent.getTime().getYear().toString().padStart(4, '0');
    }

    /**
     * Creates a new instance of the HeaderViewSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @param simulationEcs The simulation ECS instance.
     * @returns A new instance of the HeaderViewSystem.
     */
    static create(entityManager: EntityManager, simulationEcs: Ecs): HeaderViewSystem {
        return new HeaderViewSystem(entityManager, simulationEcs);
    }
}
