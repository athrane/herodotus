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
        expect(event.getEventType()).toBe('Political');
        expect(event.getEventTrigger()).toBe('PLAYER_START');
        expect(event.getEventName()).toBe('Rise to Power');
        expect(event.getEventConsequence()).toBe('Coronation');
        expect(event.getHeading()).toBe('A New Dawn Rises');
        expect(event.getPlace()).toBe('Capital');
        expect(event.getPrimaryActor()).toBe('Player');
        expect(event.getSecondaryActor()).toBe('The People');
        expect(event.getMotive()).toBe('Ascension to power');
        expect(event.getDescription()).toContain('You have ascended to power');
        expect(event.getConsequence()).toContain('The player gains control');
        expect(event.getTags()).toBe('political, beginning, power, leadership');
    });
});
