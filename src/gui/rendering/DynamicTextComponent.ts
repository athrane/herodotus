import { TypeUtils } from '../../util/TypeUtils';
import { Component } from '../../ecs/Component';
import { Simulation } from '../../simulation/Simulation';

/**
 * Represents a text component whose content can change dynamically.
 */
export class DynamicTextComponent extends Component {

  /**
   * Function to retrieve the current text based on the simulation state.
   * @param sim The simulation instance to use for retrieving the text.
   * @returns The current text to display.
   */
  public getText: (sim: Simulation) => string;

  /**
   * Constructs a DynamicTextComponent with the given text retrieval function.
   * @param getText A function that takes a Simulation instance and returns the text to display.
   */
  constructor(getText: (sim: Simulation) => string) {
    super();
    TypeUtils.ensureFunction(getText, "getText must be a function");
    this.getText = getText;
  }
}
