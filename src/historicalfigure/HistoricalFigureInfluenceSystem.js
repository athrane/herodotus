import { System } from '../ecs/System.js';
import { HistoricalFigureComponent } from './HistoricalFigureComponent.js';
import { ChronicleEventComponent } from '../chronicle/ChronicleEventComponent.js';
import { EntityManager } from '../ecs/EntityManager.js';
import { TypeUtils } from '../util/TypeUtils.js';

/**
 * @class HistoricalFigureInfluenceSystem
 * @augments System
 * @description Translates the existence and roles of active historical figures into concrete historical events.
 */
export class HistoricalFigureInfluenceSystem extends System {
    /**
     * @param {EntityManager} entityManager - The entity manager instance.
     */
    constructor(entityManager) {
        super(entityManager, [HistoricalFigureComponent]);
    }

    /**
     * Processes a single entity to generate historical events based on its influence.
     * @param {Entity} entity - The historical figure entity.
     * @param {number} currentYear - The current year in the simulation.
     */
    processEntity(entity, currentYear) {
        TypeUtils.ensureNumber(currentYear, 'currentYear must be a number.');

        const historicalFigure = entity.getComponent(HistoricalFigureComponent);
        if (!historicalFigure) return;
    
        const chronicle = this.getEntityManager().getSingletonComponent(ChronicleEventComponent);
        if (!chronicle) return;
    
        // Example: A simple event generation based on the historical figure's existence
        // In a real scenario, this would be much more complex, considering traits, roles, etc.
        if (currentYear >= historicalFigure.birthYear && currentYear <= historicalFigure.deathYear) {
            const event = {
                year: currentYear,
                description: `${historicalFigure.name} (${historicalFigure.occupation}) is active this year.`,
                type: 'HistoricalFigureActivity',
                figureId: entity.id
            };
            chronicle.addEvent(event);
        }
    }

    /**
     * Static factory method to create a HistoricalFigureInfluenceSystem.
     * @static
     * @param {EntityManager} entityManager - The entity manager instance.
     * @returns {HistoricalFigureInfluenceSystem} A new instance of HistoricalFigureInfluenceSystem.
     */
    static create(entityManager) {
        return new HistoricalFigureInfluenceSystem(entityManager);
    }

}
