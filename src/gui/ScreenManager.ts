import { EntityManager } from '../ecs/EntityManager';
import { ScreenComponent } from './ScreenComponent';
import { IsActiveComponent } from './IsActiveComponent';
import { NameComponent } from '../ecs/NameComponent';
import { renderMainInterface, handleMainInterfaceInput } from './screens/MainInterfaceScreen';
import { renderStatusScreen, handleStatusScreenInput } from './screens/StatusScreen';
import { renderChoicesScreen, handleChoicesScreenInput } from './screens/ChoicesScreen';
import { renderChronicleScreen, handleChronicleScreenInput } from './screens/ChronicleScreen';
import * as readline from 'readline';

/**
 * Screen manager that creates and manages all GUI screens as entities.
 */
export class ScreenManager {
    private entityManager: EntityManager;
    private screens: Map<string, string> = new Map(); // screen name -> entity ID
    
    constructor(entityManager: EntityManager) {
        this.entityManager = entityManager;
    }

    /**
     * Initialize all screens as entities in the ECS system.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    initializeScreens(readline: readline.Interface): void {
        // Create main interface screen
        const mainScreen = this.entityManager.createEntity();
        mainScreen.addComponent(new NameComponent('MainInterface'));
        mainScreen.addComponent(new ScreenComponent(renderMainInterface, handleMainInterfaceInput));
        mainScreen.addComponent(new IsActiveComponent()); // Start with main screen active
        this.screens.set('main', mainScreen.getId());

        // Create status screen
        const statusScreen = this.entityManager.createEntity();
        statusScreen.addComponent(new NameComponent('Status'));
        statusScreen.addComponent(new ScreenComponent(renderStatusScreen, handleStatusScreenInput));
        this.screens.set('status', statusScreen.getId());

        // Create choices screen
        const choicesScreen = this.entityManager.createEntity();
        choicesScreen.addComponent(new NameComponent('Choices'));
        choicesScreen.addComponent(new ScreenComponent(renderChoicesScreen, handleChoicesScreenInput));
        this.screens.set('choices', choicesScreen.getId());

        // Create chronicle screen
        const chronicleScreen = this.entityManager.createEntity();
        chronicleScreen.addComponent(new NameComponent('Chronicle'));
        chronicleScreen.addComponent(new ScreenComponent(renderChronicleScreen, handleChronicleScreenInput));
        this.screens.set('chronicle', chronicleScreen.getId());
    }

    /**
     * Get the entity ID for a screen by name.
     */
    getScreenEntityId(screenName: string): string | undefined {
        return this.screens.get(screenName);
    }

    /**
     * Get all available screen names.
     */
    getScreenNames(): string[] {
        return Array.from(this.screens.keys());
    }
}
