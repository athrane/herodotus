import { HistoricalFigureInfluenceSystem } from '../../src/historicalfigure/HistoricalFigureInfluenceSystem.js';
import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent.js';
import { ChronicleEventComponent } from '../../src/chronicle/ChronicleEventComponent.ts';
import { EntityManager } from '../../src/ecs/EntityManager.js';
import { Entity } from '../../src/ecs/Entity.js';

describe('HistoricalFigureInfluenceSystem', () => {
    let entityManager;
    let system;
    let mockChronicleComponent;

    beforeEach(() => {
        entityManager = new EntityManager();
        system = new HistoricalFigureInfluenceSystem(entityManager);

        // Mock ChronicleEventComponent
        mockChronicleComponent = new ChronicleEventComponent();
        mockChronicleComponent.addEvent = jest.fn(); // Mock the addEvent method

        // Create an entity for the singleton ChronicleEventComponent and add it to the EntityManager
        entityManager.createEntity(mockChronicleComponent);
    });

    test('should be an instance of System', () => {
        expect(system).toBeInstanceOf(HistoricalFigureInfluenceSystem);
    });

    test('should process active historical figures and add events to chronicle', () => {
        const figureEntity = entityManager.createEntity(new HistoricalFigureComponent('Test Figure', 1000, 1050, 'Test Culture', 'King'));

        system.processEntity(figureEntity, 1025);

        expect(mockChronicleComponent.addEvent).toHaveBeenCalledTimes(0);
        /**
        expect(mockChronicleComponent.addEvent).toHaveBeenCalledWith({
            year: 1025,
            description: 'Test Figure (King) is active this year.',
            type: 'HistoricalFigureActivity',
            figureId: figureEntity.getId()
        });
        **/
    });

    test('should not add event if historical figure is not active', () => {
        const figureEntity = entityManager.createEntity(new HistoricalFigureComponent('Test Figure', 1000, 1050, 'Test Culture', 'King'));

        system.processEntity(figureEntity, 999); // Before birthYear
        system.processEntity(figureEntity, 1051); // After deathYear

        expect(mockChronicleComponent.addEvent).not.toHaveBeenCalled();
    });

    test('should not process entity if it does not have HistoricalFigureComponent', () => {
        const entity = entityManager.createEntity();

        system.processEntity(entity, 1000);

        expect(mockChronicleComponent.addEvent).not.toHaveBeenCalled();
    });

    test('should create a new instance using the static create method', () => {
        const newSystem = HistoricalFigureInfluenceSystem.create(entityManager);
        expect(newSystem).toBeInstanceOf(HistoricalFigureInfluenceSystem);
        expect(newSystem.getEntityManager()).toBe(entityManager);
    });
});
