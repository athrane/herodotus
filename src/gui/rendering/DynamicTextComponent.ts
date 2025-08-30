import { TypeUtils } from '../../util/TypeUtils';
import { Component } from '../../ecs/Component';
import { EntityManager } from '../../ecs/EntityManager';

/**
 * Represents a text component whose content can change dynamically.
 */
export class DynamicTextComponent extends Component {

  /**
   * Function to retrieve the current text based on the GUI and simulation entity managers.
   * @param guiEntityManager The GUI entity manager to use for retrieving GUI-related data.
   * @param simulationEntityManager The simulation entity manager to use for retrieving simulation data.
   * @returns The current text to display.
   */
  public getText: (guiEntityManager: EntityManager, simulationEntityManager: EntityManager) => string;

  /**
   * Constructs a DynamicTextComponent with the given text retrieval function.
   * @param getText A function that takes GUI and simulation entity managers and returns the text to display.
   */
  constructor(getText: (guiEntityManager: EntityManager, simulationEntityManager: EntityManager) => string) {
    super();
    TypeUtils.ensureFunction(getText, "getText must be a function");
    this.getText = getText;
  }
}
