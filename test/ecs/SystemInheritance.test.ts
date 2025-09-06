import { EntityManager } from '../../src/ecs/EntityManager';
import { System } from '../../src/ecs/System';
import { Component } from '../../src/ecs/Component';
import { Entity } from '../../src/ecs/Entity';

class C1 extends Component {}
class C2 extends C1 {}

class S1 extends System {
  public processed: string[] = [];
  constructor(entityManager: EntityManager) {
    super(entityManager, [C1]);
  }
   
  processEntity(entity: Entity, ...args: any[]): void {
    this.processed.push(entity.getId());
  }
}

describe('System component matching with inheritance', () => {
  it('processes entities that have C1 or any subclass (C2) when requiring C1', () => {
    const em = EntityManager.create();

    const e1 = em.createEntity(new C1());
    const e2 = em.createEntity(new C2());

    const s1 = new S1(em);
    s1.update();

    expect(s1.processed).toContain(e1.getId());
    expect(s1.processed).toContain(e2.getId());
    expect(s1.processed.length).toBe(2);
  });
});
