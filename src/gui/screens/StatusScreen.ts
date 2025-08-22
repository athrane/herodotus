import { Simulation } from '../../simulation/Simulation';
import { GuiHelper } from '../GuiHelper';
import { TimeComponent } from '../../time/TimeComponent';
import { DilemmaComponent } from '../../behaviour/DilemmaComponent';
import { HistoricalFigureComponent } from '../../historicalfigure/HistoricalFigureComponent';
import { NameComponent } from '../../ecs/NameComponent';
import * as readline from 'readline';

/**
 * Status screen renderer function.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function renderStatusScreen(simulation: Simulation, readline: readline.Interface): Promise<void> {
    GuiHelper.clearScreen();
    
    const entityManager = simulation.getEntityManager();
    const timeComponent = entityManager.getSingletonComponent(TimeComponent);
    
    console.log('='.repeat(80));
    console.log('DETAILED SIMULATION STATUS');
    console.log('='.repeat(80));
    
    // Time Information
    if (timeComponent) {
        const time = timeComponent.getTime();
        console.log(`Current Year: ${time.getYear()}`);
    }
    
    console.log(`Simulation Running: ${simulation.getIsRunning() ? 'Yes' : 'No'}`);
    console.log('');
    
    // Player Information
    const playerEntity = GuiHelper.getPlayerEntity(simulation);
    if (playerEntity) {
        console.log('--- PLAYER STATUS ---');
        const nameComponent = playerEntity.getComponent(NameComponent);
        console.log(`Player: ${nameComponent ? nameComponent.getText() : 'Unnamed'}`);
        
        const dilemmaComponent = playerEntity.getComponent(DilemmaComponent);
        if (dilemmaComponent) {
            console.log(`Pending Dilemmas: ${dilemmaComponent.getChoices().length}`);
        }
        console.log('');
    }
    
    // Historical Figures
    const historicalFigures = entityManager.getEntitiesWithComponents(HistoricalFigureComponent);
    console.log('--- HISTORICAL FIGURES ---');
    console.log(`Total Historical Figures: ${historicalFigures.length}`);
    
    if (historicalFigures.length > 0) {
        console.log('Recent Figures:');
        historicalFigures.slice(-5).forEach(figure => {
            const nameComponent = figure.getComponent(NameComponent);
            const historicalFigureComponent = figure.getComponent(HistoricalFigureComponent);
            const name = nameComponent ? nameComponent.getText() : 'Unnamed';
            const birthYear = historicalFigureComponent ? historicalFigureComponent.getHistoricalFigure().getBirthYear() : 'Unknown';
            console.log(`  - ${name} (Born: ${birthYear})`);
        });
    }
    
    console.log('');
    console.log('='.repeat(80));
    console.log('Press Enter to return to main menu...');
}

/**
 * Status screen input handler function.
 */
export async function handleStatusScreenInput(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    command: string, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    simulation: Simulation, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readline: readline.Interface
): Promise<boolean> {
    // Any input returns to main screen
    return true;
}
