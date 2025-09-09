import { ScreenBufferComponent } from '../../../src/gui/rendering/ScreenBufferComponent';

describe('ScreenBufferComponent', () => {
    let screenBuffer;

    beforeEach(() => {
        screenBuffer = new ScreenBufferComponent();
    });

    test('should create an empty 24x80 buffer', () => {
        const dimensions = screenBuffer.getDimensions();
        expect(dimensions.rows).toBe(24);
        expect(dimensions.cols).toBe(80);

        const buffer = screenBuffer.getBuffer();
        expect(buffer).toHaveLength(24);
        buffer.forEach(row => {
            expect(row).toHaveLength(80);
            expect(row).toBe(' '.repeat(80));
        });
    });

    test('should initialize cursor at position (0, 0)', () => {
        const cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(0);
        expect(cursor.col).toBe(0);
    });

    test('should set cursor position within bounds', () => {
        screenBuffer.setCursor(10, 40);
        const cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(10);
        expect(cursor.col).toBe(40);
    });

    test('should clamp cursor position to screen bounds', () => {
        screenBuffer.setCursor(-5, -10);
        let cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(0);
        expect(cursor.col).toBe(0);

        screenBuffer.setCursor(30, 100);
        cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(23);
        expect(cursor.col).toBe(79);
    });

    test('should write text at specific position', () => {
        screenBuffer.writeAt(5, 10, 'Hello');
        const row = screenBuffer.getRow(5);
        expect(row.substring(10, 15)).toBe('Hello');
        expect(row.substring(0, 10)).toBe(' '.repeat(10));
        expect(row.substring(15)).toBe(' '.repeat(65));
    });

    test('should not write text outside buffer bounds', () => {
        screenBuffer.writeAt(-1, 5, 'Test');
        screenBuffer.writeAt(25, 5, 'Test');
        screenBuffer.writeAt(5, -1, 'Test');
        screenBuffer.writeAt(5, 85, 'Test');

        // Buffer should remain empty
        const buffer = screenBuffer.getBuffer();
        buffer.forEach(row => {
            expect(row).toBe(' '.repeat(80));
        });
    });

    test('should write text and advance cursor', () => {
        screenBuffer.write('Hello World');
        
        const cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(0);
        expect(cursor.col).toBe(11);

        const row = screenBuffer.getRow(0);
        expect(row.substring(0, 11)).toBe('Hello World');
    });

    test('should handle newline characters', () => {
        screenBuffer.write('Line 1\nLine 2');
        
        const cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(1);
        expect(cursor.col).toBe(6);

        expect(screenBuffer.getRow(0).substring(0, 6)).toBe('Line 1');
        expect(screenBuffer.getRow(1).substring(0, 6)).toBe('Line 2');
    });

    test('should wrap text when reaching end of line', () => {
        const longText = 'A'.repeat(85); // Longer than 80 chars
        screenBuffer.write(longText);
        
        const cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(1);
        expect(cursor.col).toBe(5);

        expect(screenBuffer.getRow(0)).toBe('A'.repeat(80));
        expect(screenBuffer.getRow(1).substring(0, 5)).toBe('AAAAA');
    });

    test('should scroll when reaching bottom of screen', () => {
        // Fill the entire screen
        for (let i = 0; i < 24; i++) {
            screenBuffer.write(`Line ${i}\n`);
        }
        
        // Write one more line to trigger scroll
        screenBuffer.write('New bottom line');
        
        // First line should be gone, new line should be at bottom
        expect(screenBuffer.getRow(0).startsWith('Line 1')).toBe(true);
        expect(screenBuffer.getRow(23).startsWith('New bottom line')).toBe(true);
        
        const cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(23);
    });

    test('should clear buffer and reset cursor', () => {
        screenBuffer.write('Some text');
        screenBuffer.setCursor(10, 20);
        
        screenBuffer.clear();
        
        const cursor = screenBuffer.getCursor();
        expect(cursor.row).toBe(0);
        expect(cursor.col).toBe(0);

        const buffer = screenBuffer.getBuffer();
        buffer.forEach(row => {
            expect(row).toBe(' '.repeat(80));
        });
    });

    test('should get specific row', () => {
        screenBuffer.writeAt(5, 0, 'Test Row 5');
        
        expect(screenBuffer.getRow(5).startsWith('Test Row 5')).toBe(true);
        expect(screenBuffer.getRow(-1)).toBe('');
        expect(screenBuffer.getRow(25)).toBe('');
    });
});
