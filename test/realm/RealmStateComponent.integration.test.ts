import { SimulationBuilder } from '../../src/simulation/builder/SimulationBuilder';
import { BuilderDirector } from '../../src/ecs/builder/BuilderDirector';
import { RealmStateComponent } from '../../src/realm/RealmStateComponent';
import { NameComponent } from '../../src/ecs/NameComponent';
import { Ecs } from '../../src/ecs/Ecs';

describe('RealmStateComponent Integration', () => {
  let ecs: Ecs;

  // Build simulation once before all tests
  beforeAll(() => {
    const builder = SimulationBuilder.create();
    const director = BuilderDirector.create(builder);
    ecs = director.build();
  });
  
  it('creates RealmState entity during simulation build', () => {
    // Use the pre-built simulation
    
    // Find the RealmState entity
    const entityManager = ecs.getEntityManager();
    const entities = entityManager.getEntitiesWithComponents(NameComponent);
    
    let realmStateEntity = null;
    for (const entity of entities) {
      const name = entity.getComponent(NameComponent);
      if (name && name.getText() === 'RealmState') {
        realmStateEntity = entity;
        break;
      }
    }
    
    // Verify the entity exists
    expect(realmStateEntity).not.toBeNull();
  });

  it('RealmState entity has RealmStateComponent attached', () => {
    // Use the pre-built simulation
    
    // Find the RealmState entity
    const entityManager = ecs.getEntityManager();
    const entities = entityManager.getEntitiesWithComponents(NameComponent);
    
    let realmStateEntity = null;
    for (const entity of entities) {
      const name = entity.getComponent(NameComponent);
      if (name && name.getText() === 'RealmState') {
        realmStateEntity = entity;
        break;
      }
    }
    
    // Verify the component is attached
    expect(realmStateEntity).not.toBeNull();
    const realmState = realmStateEntity!.getComponent(RealmStateComponent);
    expect(realmState).toBeInstanceOf(RealmStateComponent);
  });

  it('RealmStateComponent is initialized with default values', () => {
    // Use the pre-built simulation
    
    // Find the RealmState entity
    const entityManager = ecs.getEntityManager();
    const entities = entityManager.getEntitiesWithComponents(NameComponent);
    
    let realmStateEntity = null;
    for (const entity of entities) {
      const name = entity.getComponent(NameComponent);
      if (name && name.getText() === 'RealmState') {
        realmStateEntity = entity;
        break;
      }
    }
    
    // Verify default values
    expect(realmStateEntity).not.toBeNull();
    const realmState = realmStateEntity!.getComponent(RealmStateComponent);
    expect(realmState).toBeInstanceOf(RealmStateComponent);
    expect(realmState!.getTreasury()).toBe(100);
    expect(realmState!.getStability()).toBe(100);
    expect(realmState!.getLegitimacy()).toBe(100);
    expect(realmState!.getHubris()).toBe(0);
  });

  it('can modify RealmStateComponent during simulation', () => {
    // Use the pre-built simulation
    
    // Find the RealmState entity
    const entityManager = ecs.getEntityManager();
    const entities = entityManager.getEntitiesWithComponents(NameComponent);
    
    let realmStateEntity = null;
    for (const entity of entities) {
      const name = entity.getComponent(NameComponent);
      if (name && name.getText() === 'RealmState') {
        realmStateEntity = entity;
        break;
      }
    }
    
    // Modify the component
    expect(realmStateEntity).not.toBeNull();
    const realmState = realmStateEntity!.getComponent(RealmStateComponent);
    expect(realmState).toBeInstanceOf(RealmStateComponent);
    
    realmState!.setTreasury(150);
    realmState!.setFactionInfluence('Nobility', 75);
    realmState!.setFactionAllegiance('Nobility', 50);
    
    // Verify modifications
    expect(realmState!.getTreasury()).toBe(150);
    expect(realmState!.getFactionInfluence('Nobility')).toBe(75);
    expect(realmState!.getFactionAllegiance('Nobility')).toBe(50);
  });

  it('RealmState entity is accessible by other systems via entity query', () => {
    // Use the pre-built simulation
    
    // Systems would query for entities with RealmStateComponent
    const entityManager = ecs.getEntityManager();
    const realmStateEntities = entityManager.getEntitiesWithComponents(RealmStateComponent);
    
    // Verify exactly one RealmState entity exists (singleton pattern)
    expect(realmStateEntities.length).toBe(1);
    
    const realmState = realmStateEntities[0].getComponent(RealmStateComponent);
    expect(realmState).toBeInstanceOf(RealmStateComponent);
  });
});
