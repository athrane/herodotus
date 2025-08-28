import { System } from '../../ecs/System';
import { Entity } from '../../ecs/Entity';
import { EntityManager } from '../../ecs/EntityManager';
import { DynamicTextComponent } from './DynamicTextComponent';
import { TextComponent } from './TextComponent';
import { IsVisibleComponent } from './IsVisibleComponent';
import { Simulation } from '../../simulation/Simulation';

/**
 * System that updates TextComponent values from DynamicTextComponent callbacks.
 */
export class DynamicTextUpdateSystem extends System {
  private readonly simulation: Simulation;

  /**
   * Creates a new DynamicTextUpdateSystem.
   * @param entityManager The entity manager for managing entities.
   * @param simulation The simulation instance for accessing simulation state.
   */
  constructor(entityManager: EntityManager, simulation: Simulation) {
    super(entityManager, [DynamicTextComponent, TextComponent, IsVisibleComponent]);
    this.simulation = simulation;
  }

  /**
   * Processes a single entity.
   * @param entity The entity to process.
   * @returns 
   */
  processEntity(entity: Entity): void {

    // Exit if the entity is not visible
    const visibility = entity.getComponent(IsVisibleComponent);
    if (!visibility || !visibility.isVisible()) return;

    // Get the dynamic text and regular text components
    const dynamic = entity.getComponent(DynamicTextComponent);
    const text = entity.getComponent(TextComponent);
    if (!dynamic || !text) return;

    // Compute the new text value and update the TextComponent
    const newText = dynamic.getText(this.simulation);
    text.setText(String(newText));
  }

  /**
   * Creates a new DynamicTextUpdateSystem.
   * @param entityManager The entity manager for managing entities.
   * @param simulation The simulation instance for accessing simulation state.
   * @returns A new instance of DynamicTextUpdateSystem.
   */
  static create(entityManager: EntityManager, simulation: Simulation): DynamicTextUpdateSystem {
    return new DynamicTextUpdateSystem(entityManager, simulation);
  } 

}
