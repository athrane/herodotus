import { Component } from '../ecs/Component';
import { Simulation } from '../simulation/Simulation';
import * as readline from 'readline';

/**
 * Component that contains the render logic for a screen.
 * Each screen entity should have this component.
 */
export class ScreenComponent extends Component {
    private renderFunction: (simulation: Simulation, readline: readline.Interface) => Promise<void>;
    private handleInputFunction: (command: string, simulation: Simulation, readline: readline.Interface) => Promise<boolean>;

    /**
     * @param renderFunction Function that renders the screen content
     * @param handleInputFunction Function that handles user input. Returns true if input was handled, false to continue with default handling
     */
    constructor(
        renderFunction: (simulation: Simulation, readline: readline.Interface) => Promise<void>,
        handleInputFunction: (command: string, simulation: Simulation, readline: readline.Interface) => Promise<boolean>
    ) {
        super();
        this.renderFunction = renderFunction;
        this.handleInputFunction = handleInputFunction;
    }

    async render(simulation: Simulation, readline: readline.Interface): Promise<void> {
        await this.renderFunction(simulation, readline);
    }

    async handleInput(command: string, simulation: Simulation, readline: readline.Interface): Promise<boolean> {
        return await this.handleInputFunction(command, simulation, readline);
    }
}
