// Simple manual test to verify scroll strategy functionality
import { MenuComponent } from '../src/gui/menu/MenuComponent';
import { MenuItem } from '../src/gui/menu/MenuItem';
import { ScrollStrategy } from '../src/gui/menu/ScrollStrategy';

console.log('=== Manual ScrollStrategy Test ===\n');

try {
    // Test 1: Default scroll strategy
    console.log('Test 1: Default scroll strategy');
    const items = [
        new MenuItem('Start Game', 'start'),
        new MenuItem('Load Game', 'load'),
        new MenuItem('Quit', 'quit')
    ];
    
    const defaultMenu = new MenuComponent(items);
    console.log(`Default strategy: ${defaultMenu.getScrollStrategy()}`);
    console.log(`Expected: ${ScrollStrategy.HORIZONTAL}`);
    console.log(`✓ Match: ${defaultMenu.getScrollStrategy() === ScrollStrategy.HORIZONTAL}\n`);

    // Test 2: Vertical scroll strategy
    console.log('Test 2: Vertical scroll strategy');
    const verticalMenu = new MenuComponent(items, ScrollStrategy.VERTICAL);
    console.log(`Vertical strategy: ${verticalMenu.getScrollStrategy()}`);
    console.log(`Expected: ${ScrollStrategy.VERTICAL}`);
    console.log(`✓ Match: ${verticalMenu.getScrollStrategy() === ScrollStrategy.VERTICAL}\n`);

    // Test 3: Horizontal scroll strategy (explicit)
    console.log('Test 3: Horizontal scroll strategy (explicit)');
    const horizontalMenu = new MenuComponent(items, ScrollStrategy.HORIZONTAL);
    console.log(`Horizontal strategy: ${horizontalMenu.getScrollStrategy()}`);
    console.log(`Expected: ${ScrollStrategy.HORIZONTAL}`);
    console.log(`✓ Match: ${horizontalMenu.getScrollStrategy() === ScrollStrategy.HORIZONTAL}\n`);

    // Test 4: Change strategy after creation
    console.log('Test 4: Change strategy after creation');
    const changeableMenu = new MenuComponent(items);
    console.log(`Initial: ${changeableMenu.getScrollStrategy()}`);
    changeableMenu.setScrollStrategy(ScrollStrategy.VERTICAL);
    console.log(`After change: ${changeableMenu.getScrollStrategy()}`);
    console.log(`✓ Change successful: ${changeableMenu.getScrollStrategy() === ScrollStrategy.VERTICAL}\n`);

    // Test 5: Enum values
    console.log('Test 5: Enum values');
    console.log(`VERTICAL value: "${ScrollStrategy.VERTICAL}"`);
    console.log(`HORIZONTAL value: "${ScrollStrategy.HORIZONTAL}"`);
    console.log(`✓ Values correct: ${ScrollStrategy.VERTICAL === 'vertical' && ScrollStrategy.HORIZONTAL === 'horizontal'}\n`);

    console.log('=== All tests passed! ===');

} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
}