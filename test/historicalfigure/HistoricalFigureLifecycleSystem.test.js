import { HistoricalFigureLifecycleSystem } from '../../src/historicalfigure/HistoricalFigureLifecycleSystem.ts';
import { EntityManager } from '../../src/ecs/EntityManager';
import { Entity } from '../../src/ecs/Entity';
import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent.ts';
import { TimeComponent } from '../../src/time/TimeComponent.js';
import { Time } from '../../src/time/Time.js';

describe('HistoricalFigureLifecycleSystem', () => {
    let entityManager;
    let system;

    beforeEach(() => {
        entityManager = new EntityManager();
        system = HistoricalFigureLifecycleSystem.create(entityManager);
    });

    test('should create a new instance with the static create method', () => {
        expect(system).toBeInstanceOf(HistoricalFigureLifecycleSystem);
        expect(system.getEntityManager()).toBe(entityManager);
    });

    test('should process birth year correctly', () => {
        const entity = entityManager.createEntity(new HistoricalFigureComponent('Test Figure', 100, 150, 'culture', 'occupation'));

        const time = new Time(100);
        const timeComponent = new TimeComponent(time);
        entityManager.createEntity(timeComponent);

        console.log = jest.fn();

        system.processEntity(entity, 100);

        expect(console.log).toHaveBeenCalledWith('Historical figure Test Figure (born 100) has entered the simulation.');
    });

    test('should process death year correctly', () => {
        const entity = entityManager.createEntity(new HistoricalFigureComponent('Test Figure', 100, 150, 'culture', 'occupation'));

        const time = new Time(100);
        const timeComponent = new TimeComponent(time);
        entityManager.createEntity(timeComponent);

        console.log = jest.fn();

        system.processEntity(entity, 150);

        expect(console.log).toHaveBeenCalledWith('Historical figure Test Figure (died 150) has exited the simulation.');
        expect(entity.hasComponent(HistoricalFigureComponent)).toBe(false);
    });

    test('should not process entity if time component is missing', () => {
        const entity = entityManager.createEntity(new HistoricalFigureComponent('Test Figure', 100, 150, 'culture', 'occupation'));

        console.log = jest.fn();

        system.processEntity(entity, 100);

        expect(console.log).not.toHaveBeenCalled();
    });
});
