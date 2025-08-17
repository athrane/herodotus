import { Component } from '../ecs/Component';
import { DataSetEvent } from './DataSetEvent';
import { TypeUtils } from '../util/TypeUtils';

/**
 * A component for managing game state that holds a reference to a DataSetEvent object.
 * This component serves as the complete context for the current game state from the previous turn.
 */
export class DataSetEventComponent extends Component {
  /**
   * @type {DataSetEvent}
   */
  private dataSetEvent: DataSetEvent;

  /**
   * Creates an instance of DataSetEventComponent.
   * @param dataSetEvent - The DataSetEvent object that provides the full context for the current game state.
   */
  constructor(dataSetEvent: DataSetEvent) {
    super();
    TypeUtils.ensureInstanceOf(dataSetEvent, DataSetEvent, 'DataSetEvent must be a valid DataSetEvent instance.');
    this.dataSetEvent = dataSetEvent;
  }

  /**
   * Gets the DataSetEvent object.
   * @returns The DataSetEvent object containing the full game state context.
   */
  getDataSetEvent(): DataSetEvent {
    return this.dataSetEvent;
  }

  /**
   * Sets the DataSetEvent object.
   * @param dataSetEvent - The new DataSetEvent object that provides the updated context for the current game state.
   */
  setDataSetEvent(dataSetEvent: DataSetEvent): void {
    TypeUtils.ensureInstanceOf(dataSetEvent, DataSetEvent, 'DataSetEvent must be a valid DataSetEvent instance.');
    this.dataSetEvent = dataSetEvent;
  }

  /**
   * Creates a new instance of DataSetEventComponent.
   * @param dataSetEvent - The DataSetEvent object that provides the full context for the current game state.
   * @returns A new DataSetEventComponent instance.
   */
  static create(dataSetEvent: DataSetEvent): DataSetEventComponent {
    return new DataSetEventComponent(dataSetEvent);
  }
}
