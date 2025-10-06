import { SimulationBuilder } from '../../../src/simulation/builder/SimulationBuilder.ts';
import { Simulation } from '../../../src/simulation/Simulation.ts';
import { NameComponent } from '../../../src/ecs/NameComponent.ts';
import { HistoricalFigureComponent } from '../../../src/historicalfigure/HistoricalFigureComponent.ts';
import { DataSetEventComponent } from '../../../src/data/DataSetEventComponent.ts';
import { LocationComponent } from '../../../src/geography/LocationComponent.ts';
import { GeographicalFeatureTypeRegistry } from '../../../src/geography/feature/GeographicalFeatureTypeRegistry.ts';

describe('Player Entity Integration', () => {
    let builder;
    let simulation;

    beforeEach(() => {
        // Clear the registry to ensure clean state between tests
        GeographicalFeatureTypeRegistry.clear();
        
        builder = SimulationBuilder.create();
        builder.build();
        builder.buildData();
        builder.buildEntities();
        const ecs = builder.getEcs();
        simulation = Simulation.create(ecs);
    });

    it('should create a dedicated Player entity with required components', () => {
        const entityManager = simulation.getEntityManager();
        
        // Get all entities
        const entities = entityManager.getEntitiesWithComponents();
        
        // Find the Player entity by name
        const playerEntity = entities.find(entity => {
            const nameComponent = entity.getComponent(NameComponent);
            return nameComponent && nameComponent.getText() === 'Player';
        });

        expect(playerEntity).toBeDefined();

        // Verify Player entity has HistoricalFigureComponent
        const historicalFigureComponent = playerEntity.getComponent(HistoricalFigureComponent);
        expect(historicalFigureComponent).toBeInstanceOf(HistoricalFigureComponent);
        expect(historicalFigureComponent.name).toBe('Player Character');
        expect(historicalFigureComponent.occupation).toBe('Ruler');

        // Verify Player entity has DataSetEventComponent
        const dataSetEventComponent = playerEntity.getComponent(DataSetEventComponent);
        expect(dataSetEventComponent).toBeInstanceOf(DataSetEventComponent);
        expect(dataSetEventComponent.getDataSetEvent()).toBeDefined();

        // Verify Player entity has LocationComponent
        const locationComponent = playerEntity.getComponent(LocationComponent);
        expect(locationComponent).toBeInstanceOf(LocationComponent);
        expect(locationComponent.getName()).toBeDefined();
        expect(locationComponent.getFeature()).toBeDefined();
        expect(locationComponent.getPlanet()).toBeDefined();
    });

    it('should have separate Player and Global entities', () => {
        const entityManager = simulation.getEntityManager();
        const entities = entityManager.getEntitiesWithComponents();

        // Find Player entity
        const playerEntity = entities.find(entity => {
            const nameComponent = entity.getComponent(NameComponent);
            return nameComponent && nameComponent.getText() === 'Player';
        });

        // Find Global entity
        const globalEntity = entities.find(entity => {
            const nameComponent = entity.getComponent(NameComponent);
            return nameComponent && nameComponent.getText() === 'Global';
        });

        expect(playerEntity).toBeDefined();
        expect(globalEntity).toBeDefined();
        expect(playerEntity).not.toBe(globalEntity);
    });
});
