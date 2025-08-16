import { HistoricalFigureLifecycleSystem } from '../../src/historicalfigure/HistoricalFigureLifecycleSystem';
import { EntityManager } from '../../src/ecs/EntityManager';
import { HistoricalFigureComponent } from '../../src/historicalfigure/HistoricalFigureComponent';
import { TimeComponent } from '../../src/time/TimeComponent';
import { Time } from '../../src/time/Time';

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

        expect(console.log).toHaveBeenCalledWith('Historical figure Test Figure (died 150) has died and exited the simulation.');
        expect(console.log).toHaveBeenCalledWith('  - Test Figure lived for 50 years (100-150)');
        expect(console.log).toHaveBeenCalledWith('  - Occupation: occupation, Culture: culture');
        expect(entity.hasComponent(HistoricalFigureComponent)).toBe(false);
    });

    test('should not process entity if time component is missing', () => {
        const entity = entityManager.createEntity(new HistoricalFigureComponent('Test Figure', 100, 150, 'culture', 'occupation'));

        console.log = jest.fn();

        system.processEntity(entity, 100);

        expect(console.log).not.toHaveBeenCalled();
    });

    test('should record detailed death information', () => {
        const entity = entityManager.createEntity(new HistoricalFigureComponent('Famous Ruler', 1200, 1280, 'Ancient Empire', 'Emperor'));

        const time = new Time(1200);
        const timeComponent = new TimeComponent(time);
        entityManager.createEntity(timeComponent);

        console.log = jest.fn();

        system.processEntity(entity, 1280);

        expect(console.log).toHaveBeenCalledWith('Historical figure Famous Ruler (died 1280) has died and exited the simulation.');
        expect(console.log).toHaveBeenCalledWith('  - Famous Ruler lived for 80 years (1200-1280)');
        expect(console.log).toHaveBeenCalledWith('  - Occupation: Emperor, Culture: Ancient Empire');
    });

    test('should not process entity when current year is not birth or death year', () => {
        const entity = entityManager.createEntity(new HistoricalFigureComponent('Test Figure', 100, 150, 'culture', 'occupation'));

        const time = new Time(100);
        const timeComponent = new TimeComponent(time);
        entityManager.createEntity(timeComponent);

        console.log = jest.fn();

        // Process during their lifetime (not birth or death year)
        system.processEntity(entity, 125);

        expect(console.log).not.toHaveBeenCalled();
        expect(entity.hasComponent(HistoricalFigureComponent)).toBe(true);
    });
});
