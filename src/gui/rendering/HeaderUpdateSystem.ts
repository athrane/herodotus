import { System } from '../../ecs/System';
import { EntityManager } from '../../ecs/EntityManager';
import { NameComponent } from '../../ecs/NameComponent';
import { TextComponent } from './TextComponent';
import { Entity } from '../../ecs/Entity';
import { Simulation } from '../../simulation/Simulation';
import { TimeComponent } from '../../time/TimeComponent';

/**
 * System responsible for updating the header text entity with current game status.
 */
export class HeaderUpdateSystem extends System {
    private simulation: Simulation;

    public static HEADER_ENTITY_NAME = 'Header';

    /**
     * Constructor for the HeaderUpdateSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @param simulation The simulation instance to get header info from.
     */
    constructor(entityManager: EntityManager, simulation: Simulation) {
        super(entityManager, [NameComponent, TextComponent]);
        this.simulation = simulation;
    }

    processEntity(entity: Entity): void {
        // Get the name component
        const nameComponent = entity.getComponent(NameComponent);
        if (!nameComponent || nameComponent.getText() !== HeaderUpdateSystem.HEADER_ENTITY_NAME) return;

        // Get the text component
        const textComponent = entity.getComponent(TextComponent);
        if (!textComponent) return;

        // Compute header string
        const headerString = this.computeHeaderString(this.simulation);

        // Update the text component (replace entity's text component)
        textComponent.setText(headerString);
    }

    /**
     * Computes the header string for the GUI.
     * @param simulation The simulation instance.
     * @returns The header string.
     */
    private computeHeaderString(simulation: Simulation): string {
        const currentYear = this.computeYear(simulation);
        const simulationState = simulation.getIsRunning() ? 'Running' : 'Stopped';
        return `Year: ${currentYear} | Simulation: ${simulationState} | Herodotus 1.0.0`;
    }

    /**
     * Computes the current year from the simulation's time component.
     * @param simulation The simulation instance.
     * @returns The current year as a string.
     */
    private computeYear(simulation: Simulation): string {
        const entityManager = simulation.getEntityManager();
        const timeComponent = entityManager.getSingletonComponent(TimeComponent);
        if (!timeComponent) {
            return '0000';
        }
        return timeComponent.getTime().getYear().toString().padStart(4, '0');
    }

    /**
     * Creates a new instance of the HeaderUpdateSystem.
     * @param entityManager The entity manager to use for querying entities.
     * @param simulation The simulation instance.
     * @returns A new instance of the HeaderUpdateSystem.
     */
    static create(entityManager: EntityManager, simulation: Simulation): HeaderUpdateSystem {
        return new HeaderUpdateSystem(entityManager, simulation);
    }
}
