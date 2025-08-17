import { SimulationBuilder } from '../../../src/simulation/builder/SimulationBuilder.ts';
import { NameComponent } from '../../../src/ecs/NameComponent.ts';
import { DataSetEventComponent } from '../../../src/data/DataSetEventComponent.ts';

describe('Player Initial Event Verification', () => {
    let builder;
    let simulation;

    beforeEach(() => {
        builder = SimulationBuilder.create();
        builder.build();
        builder.buildData();
        builder.buildEntities();
        simulation = builder.getSimulation();
    });

    it('should create Player entity with complete DataSetEvent fields', () => {
        const entityManager = simulation.getEntityManager();
        const entities = entityManager.getEntitiesWithComponents();
        
        // Find the Player entity
        const playerEntity = entities.find(entity => {
            const nameComponent = entity.getComponent(NameComponent);
            return nameComponent && nameComponent.getText() === 'Player';
        });

        expect(playerEntity).toBeDefined();

        // Get the DataSetEventComponent
        const dataSetEventComponent = playerEntity.getComponent(DataSetEventComponent);
        expect(dataSetEventComponent).toBeInstanceOf(DataSetEventComponent);

        const event = dataSetEventComponent.getDataSetEvent();
        
        // Verify all fields are set
        expect(event.EventType).toBe('Political');
        expect(event.EventTrigger).toBe('PLAYER_START');
        expect(event.EventName).toBe('Rise to Power');
        expect(event.EventConsequence).toBe('The player begins their reign as a new ruler');
        expect(event.Heading).toBe('A New Dawn Rises');
        expect(event.Place).toBe('Capital');
        expect(event.PrimaryActor).toBe('Player');
        expect(event.SecondaryActor).toBe('The People');
        expect(event.Motive).toBe('Ascension to power');
        expect(event.Description).toContain('You have ascended to power');
        expect(event.Consequence).toContain('The player gains control');
        expect(event.Tags).toBe('political, beginning, power, leadership');
    });
});
