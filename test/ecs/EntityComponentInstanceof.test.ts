import { EntityManager } from '../../src/ecs/EntityManager';
import { Component } from '../../src/ecs/Component';
import { Entity } from '../../src/ecs/Entity';

class BaseC extends Component { kind = 'base'; }
class SubC extends BaseC { kind = 'sub'; }

describe('Entity getComponent/hasComponent with inheritance', () => {
  it('hasComponent returns true for subclass when querying base (instanceof)', () => {
    const em = EntityManager.create();
    const e = em.createEntity(new SubC());
    expect(e.hasComponent(BaseC)).toBe(true);
    expect(e.hasComponent(SubC)).toBe(true);
  });

  it('getComponent prefers exact match when both exact and subclass exist', () => {
    const e = Entity.create(new BaseC(), new SubC());
    const base = e.getComponent(BaseC);
    const sub = e.getComponent(SubC);
    expect(base).toBeInstanceOf(BaseC);
    expect(base?.kind).toBe('base');
    expect(sub).toBeInstanceOf(SubC);
    expect(sub?.kind).toBe('sub');
  });

  it('getComponent returns subclass instance when only subclass is present but base is requested', () => {
    const e = Entity.create(new SubC());
    const base = e.getComponent(BaseC);
    expect(base).toBeInstanceOf(SubC);
    expect(base?.kind).toBe('sub');
  });
});
