import { System } from '../ecs/System';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { DilemmaComponent } from './DilemmaComponent';
import { DataSetEventComponent } from './DataSetEventComponent';
import { DataSetEvent } from './DataSetEvent';
import { TypeUtils } from '../util/TypeUtils';

/**
 * The DilemmaResolutionSystem processes entities with DilemmaComponents to resolve
 * player choices. It selects one of the available choices, updates the entity's
 * DataSetEventComponent with the chosen event, and removes the DilemmaComponent
 * to prepare for the next dilemma generation cycle.
 */
export class DilemmaResolutionSystem extends System {

    /**
     * Creates a new DilemmaResolutionSystem.
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [DilemmaComponent, DataSetEventComponent]);
    }

    /**
     * Processes an entity with a DilemmaComponent by making a choice and updating
     * the entity's DataSetEventComponent with the chosen event.
     * @param entity - The entity to process.
     */
    processEntity(entity: Entity): void {
        TypeUtils.ensureInstanceOf(entity, Entity, 'Entity must be a valid Entity instance.');

        const dilemmaComponent = entity.getComponent(DilemmaComponent);
        const dataSetEventComponent = entity.getComponent(DataSetEventComponent);

        if (!dilemmaComponent || !dataSetEventComponent) {
            // Skip entities that don't have both required components
            return;
        }

        // Get available choices from the dilemma
        const choices = dilemmaComponent.getChoices();
        if (choices.length === 0) {
            // No choices available, remove the dilemma component
            entity.removeComponent(DilemmaComponent);
            return;
        }

        // Make a choice (for now, we'll use simple logic - first choice)
        // In a real game, this could be based on AI decision-making,
        // player input, or other game mechanics
        const chosenEvent = this.makeChoice(choices);

        // Update the entity's DataSetEventComponent with the chosen event
        dataSetEventComponent.setDataSetEvent(chosenEvent);

        // Remove the DilemmaComponent to prepare for the next cycle
        entity.removeComponent(DilemmaComponent);
    }

    /**
     * Makes a choice from the available DataSetEvents.
     * This is where the decision-making logic would be implemented.
     * Currently uses simple logic (first choice), but can be extended
     * for more sophisticated decision-making.
     * 
     * @param choices - Array of available DataSetEvent choices.
     * @returns The chosen DataSetEvent.
     */
    private makeChoice(choices: readonly DataSetEvent[]): DataSetEvent {
        // Simple choice logic: select the first choice
        // This can be extended to include:
        // - Random selection
        // - Weighted selection based on game state
        // - AI decision-making algorithms
        // - Player preference patterns
        return choices[0];
    }
}
