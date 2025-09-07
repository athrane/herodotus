import { GuiBuilder } from '../../../src/gui/builder/GuiBuilder.ts';
import { Simulation } from '../../../src/simulation/Simulation.ts';
import { NameComponent } from '../../../src/ecs/NameComponent.ts';

describe('GuiBuilder', () => {
    let simulation;
    let builder;

    beforeEach(() => {
        simulation = new Simulation();
        builder = GuiBuilder.create(simulation);
    });

    it('should create a new GuiBuilder instance', () => {
        expect(builder).toBeInstanceOf(GuiBuilder);
    });

    it('should build GUI ECS with systems and entities', () => {
        // Build the GUI ECS
        builder.build();
        builder.buildSystems();
        builder.buildEntities();

        const guiEcs = builder.getGuiEcs();
        expect(guiEcs).toBeDefined();

        // Check that systems are registered
        const systemManager = guiEcs.getSystemManager();
        expect(systemManager.get('InputSystem')).toBeDefined();

        // Check that entities are created
        const entityManager = guiEcs.getEntityManager();
        expect(entityManager.count()).toBeGreaterThan(0);

        // Check for specific entities
        const entities = entityManager.getEntitiesWithComponents(NameComponent);
        const entityNames = entities.map(entity => {
            const nameComponent = entity.getComponent(NameComponent);
            return nameComponent ? nameComponent.getText() : '';
        });

        expect(entityNames).toContain('ScreenBuffer');
        expect(entityNames).toContain('Input');
        expect(entityNames).toContain('ActionQueue');
    });

    it('should return the simulation unchanged', () => {
        builder.build();
        const returnedSimulation = builder.getSimulation();
        expect(returnedSimulation).toBe(simulation);
    });

    it('should have empty buildData and buildComponents methods', () => {
        expect(builder.buildData()).toBeUndefined();
        expect(builder.buildComponents()).toBeUndefined();
    });
});