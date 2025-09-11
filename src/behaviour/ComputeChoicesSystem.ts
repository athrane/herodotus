import { System } from '../ecs/System';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { DataSetEventComponent } from '../data/DataSetEventComponent';
import { DataSetComponent } from '../data/DataSetComponent';
import { ChoiceComponent } from './ChoiceComponent';
import { TypeUtils } from '../util/TypeUtils';

/**
 * The ComputeChoicesSystem is the engine of the choice loop, responsible for generating 
 * choices based on the player's current state. It directly implements the 
 * read_state → find_triggers → generate_choices sequence.
 * 
 * This system reads the player's game state from their DataSetEventComponent,
 * queries the global DataSetComponent for valid choices, and creates a 
 * ChoiceComponent with the available options.
 */
export class ComputeChoicesSystem extends System {

    /**
     * Creates an instance of ComputeChoicesSystem.
     * The system is configured to run on entities that have a DataSetEventComponent.
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [DataSetEventComponent]);
    }

    /**
     * Processes a single entity (the player) to generate choice options.
     * 
     * Logic:
     * 1. Read State: Reads the current state from the EventConsequence field 
     *    of the DataSetEvent in the entity's DataSetEventComponent
     * 2. Find Triggers: Accesses the singleton DataSetComponent and filters 
     *    for events where EventTrigger matches the current state
     * 3. Generate Choices: Creates a ChoiceComponent with valid choices
     *    and attaches it to the entity
     * 
     * @param entity - The entity to process (should be the player entity).
     */
    processEntity(entity: Entity): void {
        TypeUtils.ensureInstanceOf(entity, Entity, 'entity must be an Entity instance.');

        // Get current state, the event consequence, from the DataSetEvent
        const dataSetEventComponent = entity.getComponent(DataSetEventComponent);
        if (!dataSetEventComponent) return;
        const currentDataSetEvent = dataSetEventComponent.getDataSetEvent();        
        const currentState = currentDataSetEvent.getEventConsequence();

        // Exit if current state isn't defined 
        if (!currentState || currentState.trim() === '') return;        

        // Find triggers in the global DataSetComponent and filter by trigger
        const globalDataSetComponent = this.getEntityManager().getSingletonComponent(DataSetComponent);
        if (!globalDataSetComponent) return; 

        // Find all events where EventTrigger matches the player's current state
        const validChoices = globalDataSetComponent.find(event => 
            event.getCause() === currentState
        );

        // Update ChoiceComponent with valid choices
        let choiceComponent = entity.getComponent(ChoiceComponent);
        
        // Create ChoiceComponent if it doesn't exist        
        if (!choiceComponent) {
            choiceComponent = ChoiceComponent.create([]);
            entity.addComponent(choiceComponent);
        }

        // Set the new choices (or empty array if no valid choices)
        choiceComponent.setChoices(validChoices);
    }

    /**
     * Static factory method to create a new instance of ComputeChoicesSystem.
     * @param entityManager The entity manager to use for accessing entities.
     * @returns A new ComputeChoicesSystem instance.
     */
    static create(entityManager: EntityManager): ComputeChoicesSystem {
        return new ComputeChoicesSystem(entityManager);
    }
}
