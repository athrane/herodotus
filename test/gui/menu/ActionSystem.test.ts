import { ActionSystem } from '../../../src/gui/menu/ActionSystem';
import { EntityManager } from '../../../src/ecs/EntityManager';
import { GuiEcsManager } from '../../../src/gui/GuiEcsManager';

describe('ActionSystem', () => {
  let mockEntityManager: EntityManager;
  let mockGuiManager: jest.Mocked<GuiEcsManager>;
  let system: ActionSystem;

  beforeEach(() => {
    // Use a real EntityManager instance so runtime instance checks pass
    mockEntityManager = EntityManager.create();
    mockGuiManager = {
      setActiveScreen: jest.fn(),
      stop: jest.fn(),
    } as unknown as jest.Mocked<GuiEcsManager>;
  // Make the plain mock object pass `instanceof GuiEcsManager` checks
  Object.setPrototypeOf(mockGuiManager, GuiEcsManager.prototype);

    system = new ActionSystem(mockEntityManager as any, mockGuiManager as any);
  });

  test('NAV_STATUS navigates to StatusScreen', () => {
    system.handleAction('NAV_STATUS');
    expect(mockGuiManager.setActiveScreen).toHaveBeenCalledWith('StatusScreen');
  });

  test('NAV_MAIN navigates to MainInterfaceScreen', () => {
    system.handleAction('NAV_MAIN');
    expect(mockGuiManager.setActiveScreen).toHaveBeenCalledWith('MainInterfaceScreen');
  });

  test('NAV_CHRONICLE navigates to ChronicleScreen', () => {
    system.handleAction('NAV_CHRONICLE');
    expect(mockGuiManager.setActiveScreen).toHaveBeenCalledWith('ChronicleScreen');
  });

  test('NAV_CHOICES navigates to ChoicesScreen', () => {
    system.handleAction('NAV_CHOICES');
    expect(mockGuiManager.setActiveScreen).toHaveBeenCalledWith('ChoicesScreen');
  });

  test('QUIT calls guiManager.stop', () => {
    system.handleAction('QUIT');
    expect(mockGuiManager.stop).toHaveBeenCalled();
  });

  test('unknown action does not call gui manager', () => {
    system.handleAction('SOME_UNKNOWN_ACTION');
    expect(mockGuiManager.setActiveScreen).not.toHaveBeenCalled();
    expect(mockGuiManager.stop).not.toHaveBeenCalled();
  });
});
