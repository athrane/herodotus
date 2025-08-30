import { System } from '../../ecs/System';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { DynamicTextComponent } from './DynamicTextComponent';
import { TextComponent } from './TextComponent';
import { IsVisibleComponent } from './IsVisibleComponent';
import { Ecs } from '../../ecs/Ecs';

/**
 * System that updates TextComponent values from DynamicTextComponent callbacks
 * for visible entities (only).
 */
export class DynamicTextUpdateSystem extends System {
  private readonly simulationEcs: Ecs;

  /**
   * Creates a new DynamicTextUpdateSystem.
   * @param entityManager The entity manager for managing entities.
   * @param simulationEcs The simulation ECS instance for accessing simulation state.
   */
  constructor(entityManager: EntityManager, simulationEcs: Ecs) {
    super(entityManager, [DynamicTextComponent, TextComponent, IsVisibleComponent]);
    this.simulationEcs = simulationEcs;
  }

  /**
   * Processes a single entity.
   * @param entity The entity to process.
   * @returns 
   */
  processEntity(entity: Entity): void {

    // Exit if visible component is not present
    const visibilityComponent = entity.getComponent(IsVisibleComponent);
    if (!visibilityComponent) return;

    // Exit if the entity is not visible    
    if (!visibilityComponent.isVisible()) return;

    // Get the dynamic text and regular text components
    const dynamicTextComponent = entity.getComponent(DynamicTextComponent);
    if (!dynamicTextComponent) return;

    const textComponent = entity.getComponent(TextComponent);
    if (!textComponent) return;

    // Compute the new text value and update the TextComponent
    const newText = dynamicTextComponent.getText(this.getEntityManager(), this.simulationEcs.getEntityManager());
    textComponent.setText(String(newText));
  }

  /**
   * Creates a new DynamicTextUpdateSystem.
   * @param entityManager The entity manager for managing entities.
   * @param simulationEcs The simulation ECS instance for accessing simulation state.
   * @returns A new instance of DynamicTextUpdateSystem.
   */
  static create(entityManager: EntityManager, simulationEcs: Ecs): DynamicTextUpdateSystem {
    return new DynamicTextUpdateSystem(entityManager, simulationEcs);
  } 

}
