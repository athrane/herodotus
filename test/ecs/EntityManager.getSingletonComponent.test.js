import { EntityManager } from '../../src/ecs/EntityManager';
import { TimeComponent } from '../../src/time/TimeComponent';
import { Time } from '../../src/time/Time';

describe('EntityManager.getSingletonComponent', () => {
  let entityManager;
  let time;

  beforeEach(() => {
    entityManager = new EntityManager();
    time = new Time(100);
  });

  test('should return the component when one entity has it', () => {
    const timeComponent = new TimeComponent(time);
    entityManager.createEntity(timeComponent);

    const result = entityManager.getSingletonComponent(TimeComponent);

    expect(result).toBe(timeComponent);
  });

  test('should return undefined when no entity has the component', () => {
    const result = entityManager.getSingletonComponent(TimeComponent);

    expect(result).toBeUndefined();
  });

  test('should throw an error when multiple entities have the component', () => {
    const timeComponent1 = new TimeComponent(time);
    const timeComponent2 = new TimeComponent(time);
    entityManager.createEntity(timeComponent1);
    entityManager.createEntity(timeComponent2);

    expect(() => {
      entityManager.getSingletonComponent(TimeComponent);
    }).toThrow('Expected to find one entity with TimeComponent but found 2.');
  });
});
