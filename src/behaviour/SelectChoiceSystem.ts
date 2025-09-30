import { System } from '../ecs/System';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { ChoiceComponent } from './ChoiceComponent';
import { DataSetEventComponent } from '../data/DataSetEventComponent';
import { DataSetEvent } from '../data/DataSetEvent';
import { TypeUtils } from '../util/TypeUtils';
import { ChronicleComponent } from '../chronicle/ChronicleComponent';
import { ChronicleEvent } from '../chronicle/ChronicleEvent';
import { TimeComponent } from '../time/TimeComponent';
import { GalaxyMapComponent } from '../geography/galaxy/GalaxyMapComponent';
import { EventType } from '../chronicle/EventType';
import { getEventCategoryFromString } from '../chronicle/EventCategory';
import { Place } from '../generator/Place';
import { HistoricalFigureComponent } from '../historicalfigure/HistoricalFigureComponent';
import { PlayerComponent } from '../ecs/PlayerComponent';

/**
 * The SelectChoiceSystem processes entities with ChoiceComponents to resolve
 * player choices. It selects one of the available choices, updates the entity's
 * DataSetEventComponent with the chosen event, and removes the ChoiceComponent
 * to prepare for the next choice generation cycle.
 */
export class SelectChoiceSystem extends System {
    
    /**
     * A constant representing an unknown historical figure used when no HistoricalFigureComponent is found.
     */
    private static readonly UNKNOWN_HISTORICAL_FIGURE: HistoricalFigureComponent = HistoricalFigureComponent.create(
        "Unknown",
        0,
        50,
        "Unknown",
        "Unknown"
    );

    /**
     * Creates a new SelectChoiceSystem.
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [ChoiceComponent, DataSetEventComponent]);
    }

    /**
     * Processes an entity with a ChoiceComponent by making a choice and updating
     * the entity's DataSetEventComponent with the chosen event.
     * Also creates a chronicle event to record the decision.
     * For player entities, the choice must be made via the GUI before processing.
     * @param entity - The entity to process.
     */
    processEntity(entity: Entity): void {
        TypeUtils.ensureInstanceOf(entity, Entity, 'Entity must be a valid Entity instance.');

        // Get choice components
        const choiceComponent = entity.getComponent(ChoiceComponent);
        if (!choiceComponent) return;

        // Get DataSetEventComponent        
        const dataSetEventComponent = entity.getComponent(DataSetEventComponent);
        if (!dataSetEventComponent) return;

        // Check if this is a player entity
        const isPlayerEntity = entity.hasComponent(PlayerComponent);

        // Get available choices, exit if no choices are available
        const choices = choiceComponent.getChoices();
        if (choices.length === 0) return;

        // For player entities, check if a choice has already been made via GUI
        if (isPlayerEntity) {
            // Check if the current DataSetEvent is one of the available choices
            const currentEvent = dataSetEventComponent.getDataSetEvent();
            const isChoiceMade = choices.some(choice => 
                choice.getEventName() === currentEvent?.getEventName() &&
                choice.getDescription() === currentEvent?.getDescription()
            );

            // If no choice has been made yet, return early (wait for GUI input)
            if (!isChoiceMade) {
                return;
            }

            // Record the player's decision in the chronicle
            this.recordDecisionInChronicle(entity, currentEvent!);

            // Clear the choices in ChoiceComponent to prepare for the next cycle
            choiceComponent.clearChoices();
            return;
        }

        // For non-player entities, make an automatic choice
        const chosenEvent = this.makeChoice(choices);

        // Update the entity's DataSetEventComponent with the choice
        dataSetEventComponent.setDataSetEvent(chosenEvent);

        // Record the decision in the chronicle
        this.recordDecisionInChronicle(entity, chosenEvent);

        // Clear the choices in ChoiceComponent to prepare for the next cycle
        choiceComponent.clearChoices();
    }

    /**
     * Makes a choice from the available DataSetEvents.
     * This is where the decision-making logic would be implemented.
     * For player entities, this method will wait for player input via the GUI.
     * For non-player entities, it uses random selection.
     * 
     * @param choices - Array of available DataSetEvent choices.
     * @returns The chosen DataSetEvent.
     */
    private makeChoice(choices: readonly DataSetEvent[]): DataSetEvent {
        // Random choice logic: select a random choice from available options
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }

    /**
     * Records the decision made in the chronicle for historical tracking.
     * @param entity - The entity that made the decision.
     * @param chosenEvent - The DataSetEvent that was chosen.
     */
    private recordDecisionInChronicle(entity: Entity, chosenEvent: DataSetEvent): void {

        // Get chronicle component
        const chronicleComponent = this.getEntityManager().getSingletonComponent(ChronicleComponent);
        if(!chronicleComponent) return;

        // Get time component and
        const timeComponent = this.getEntityManager().getSingletonComponent(TimeComponent);
        if(!timeComponent) return;

        // Get galaxy map component
        const galaxyMapComponent = this.getEntityManager().getSingletonComponent(GalaxyMapComponent);
        if(!galaxyMapComponent) return;
        
        // Get the current time
        const currentTime = timeComponent.getTime();
        
        // Get a place from the galaxy map
        const place = this.computeDecisionPlace(galaxyMapComponent);

        // Create an event type for the decision using the chosen event's type
        const eventCategory = getEventCategoryFromString(chosenEvent.getEventType());
        const eventType = EventType.create(eventCategory, chosenEvent.getEventName());

        // Get the historical figure making the decision
        const historicalFigure = this.getHistoricalFigureFromEntity(entity);

        // Create the chronicle event
        const heading = `Decision made: ${chosenEvent.getEventName()}`;
        const description = chosenEvent.getDescription();

        const chronicleEvent = ChronicleEvent.create(
            heading,
            eventType,
            currentTime,
            place,
            description,
            historicalFigure
        );

        // Add the event to the chronicle
        chronicleComponent.addEvent(chronicleEvent);
    }

    /**
     * Computes a place for the decision event.
     * This method retrieves a random geographical feature from the galaxy map.
     * @param galaxyMap - The GalaxyMapComponent instance to get a random place from.
     * @returns A Place instance representing the location where the decision was made.
     */
    private computeDecisionPlace(galaxyMap: GalaxyMapComponent): Place {
        // Get a random planet from the galaxy map
        const planet = galaxyMap.getRandomPlanet();
        if (planet) {
            const continents = planet.getContinents();
            if (continents.length > 0) {
                const randomContinent = continents[Math.floor(Math.random() * continents.length)];
                const randomFeature = randomContinent.getRandomFeature();
                if (randomFeature) {
                    // Use format: "FeatureName, PlanetName" (consistent with birth/death systems)
                    return Place.create(`${randomFeature.getName()}, ${planet.getName()}`);
                }
            }
        }
        return Place.create('The Council Chambers');
    }

    /**
     * Extracts a HistoricalFigureComponent from the given entity.
     * If the entity has a HistoricalFigureComponent, it returns that instance.
     * @param entity - The entity to extract the historical figure from.
     * @returns A HistoricalFigureComponent representing the entity, or a shared unknown HistoricalFigureComponent if none is found.
     */
    private getHistoricalFigureFromEntity(entity: Entity): HistoricalFigureComponent {
        // Check if entity has HistoricalFigureComponent
        const historicalFigureComponent = entity.getComponent(HistoricalFigureComponent);
        if (historicalFigureComponent) {
            return historicalFigureComponent;
        }

        // Return the unknown historical figure constant if entity has no HistoricalFigureComponent
        return SelectChoiceSystem.UNKNOWN_HISTORICAL_FIGURE;
    }

    /**
     * Static factory method to create a new instance of SelectChoiceSystem.
     * @param entityManager The entity manager to use for accessing entities.
     * @returns A new SelectChoiceSystem instance.
     */
    static create(entityManager: EntityManager): SelectChoiceSystem {
        return new SelectChoiceSystem(entityManager);
    }
}
