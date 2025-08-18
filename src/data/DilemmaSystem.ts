import { System } from '../ecs/System';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { DataSetEventComponent } from '../data/DataSetEventComponent';
import { DataSetComponent } from '../data/DataSetComponent';
import { DilemmaComponent } from '../data/DilemmaComponent';
import { TypeUtils } from '../util/TypeUtils';

/**
 * The DilemmaSystem is the engine of the dilemma loop, responsible for generating 
 * choices based on the player's current state. It directly implements the 
 * read_state → find_triggers → generate_choices sequence.
 * 
 * This system reads the player's game state from their DataSetEventComponent,
 * queries the global DataSetComponent for valid choices, and creates a 
 * DilemmaComponent with the available options.
 */
export class DilemmaSystem extends System {

    /**
     * Creates an instance of DilemmaSystem.
     * The system is configured to run on entities that have a DataSetEventComponent.
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [DataSetEventComponent]);
    }

    /**
     * Processes a single entity (the player) to generate dilemma choices.
     * 
     * Logic:
     * 1. Read State: Reads the current state from the EventConsequence field 
     *    of the DataSetEvent in the entity's DataSetEventComponent
     * 2. Find Triggers: Accesses the singleton DataSetComponent and filters 
     *    for events where EventTrigger matches the current state
     * 3. Generate Choices: Creates a DilemmaComponent with valid choices
     *    and attaches it to the entity
     * 
     * @param entity - The entity to process (should be the player entity).
     */
    processEntity(entity: Entity): void {
        TypeUtils.ensureInstanceOf(entity, Entity, 'entity must be an Entity instance.');

        // get current state, from the DataSetEvent
        const dataSetEventComponent = entity.getComponent(DataSetEventComponent);
        if (!dataSetEventComponent) return;

        const currentDataSetEvent = dataSetEventComponent.getDataSetEvent();        
        const currentState = currentDataSetEvent.EventConsequence;

        // exit if current state isn't defined 
        if (!currentState || currentState.trim() === '') return;        

        // Step 2: Find Triggers in the global DataSetComponent and filter by trigger
        const globalDataSetComponent = this.getEntityManager().getSingletonComponent(DataSetComponent);
        if (!globalDataSetComponent) return; 

        // Find all events where EventTrigger matches the player's current state
        const validChoices = globalDataSetComponent.find(event => 
            event.EventTrigger === currentState
        );

        // Step 3: Generate Choices - Create DilemmaComponent with valid choices
        if (validChoices.length > 0) {
            // Remove existing DilemmaComponent if it exists (replace old choices)
            entity.removeComponent(DilemmaComponent);
            
            // Create and attach new DilemmaComponent with the valid choices
            const dilemmaComponent = DilemmaComponent.create(validChoices);
            entity.addComponent(dilemmaComponent);
        }
    }
}
