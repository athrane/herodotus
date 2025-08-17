import { System } from '../ecs/System';
import { HistoricalFigureComponent } from './HistoricalFigureComponent';
import { ChronicleComponent } from '../chronicle/ChronicleComponent';
import { EntityManager } from '../ecs/EntityManager';
import { Entity } from '../ecs/Entity';
import { TypeUtils } from '../util/TypeUtils';

/**
 * Translates the existence and roles of active historical figures into concrete historical events.
 */
export class HistoricalFigureInfluenceSystem extends System {
    /**
     * @param entityManager - The entity manager instance.
     */
    constructor(entityManager: EntityManager) {
        super(entityManager, [HistoricalFigureComponent]);
    }

    /**
     * Processes a single entity to generate historical events based on its influence.
     * @param entity - The historical figure entity.
     * @param currentYear - The current year in the simulation.
     */
    processEntity(entity: Entity, currentYear: number): void {
        TypeUtils.ensureInstanceOf(entity, Entity);
        TypeUtils.ensureNumber(currentYear, 'currentYear must be a number.');

        // Get the historical figure component from the entity
        const historicalFigure = entity.getComponent(HistoricalFigureComponent);
        if (!historicalFigure) return;

        // get chronicle component from entity manager
        const chronicle = this.getEntityManager().getSingletonComponent(ChronicleComponent);
        if (!chronicle) return;

        // Simple event generation based on the historical figure's active years
        const calculatedDeathYear = historicalFigure.birthYear + historicalFigure.averageLifeSpan;
        if (currentYear >= historicalFigure.birthYear && currentYear <= calculatedDeathYear) {

            /** 
            const event = {
                year: currentYear,
                description: `${historicalFigure.name} (${historicalFigure.occupation}) is active this year.`,
                type: 'HistoricalFigureActivity',
                figureId: entity.getId()
            };
            chronicle.addEvent(event);
            **/
        }
    }

    /**
     * Static factory method to create a HistoricalFigureInfluenceSystem.
     * @param entityManager - The entity manager instance.
     * @returns A new instance of HistoricalFigureInfluenceSystem.
     */
    static create(entityManager: EntityManager): HistoricalFigureInfluenceSystem {
        return new HistoricalFigureInfluenceSystem(entityManager);
    }
}