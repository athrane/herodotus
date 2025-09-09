import { Component } from '../../ecs/Component';

/**
 * Component that holds a screen buffer for TTY rendering.
 * Represents a 24x80 character terminal screen.
 */
export class ScreenBufferComponent extends Component {
    private static readonly ROWS = 24;
    private static readonly COLS = 80;
    
    private buffer: string[][];
    private cursorRow: number;
    private cursorCol: number;

    /**
     * Creates a new ScreenBufferComponent.
     */
    constructor() {
        super();
        this.buffer = this.createEmptyBuffer();
        this.cursorRow = 0;
        this.cursorCol = 0;
    }

    /**
     * Creates an empty buffer filled with spaces.
     */
    private createEmptyBuffer(): string[][] {
        const buffer: string[][] = [];
        for (let row = 0; row < ScreenBufferComponent.ROWS; row++) {
            buffer[row] = new Array(ScreenBufferComponent.COLS).fill(' ');
        }
        return buffer;
    }

    /**
     * Clears the entire screen buffer.
     */
    clear(): void {
        this.buffer = this.createEmptyBuffer();
        this.cursorRow = 0;
        this.cursorCol = 0;
    }

    /**
     * Sets the cursor position.
     */
    setCursor(row: number, col: number): void {
        this.cursorRow = Math.max(0, Math.min(row, ScreenBufferComponent.ROWS - 1));
        this.cursorCol = Math.max(0, Math.min(col, ScreenBufferComponent.COLS - 1));
    }

    /**
     * Gets the current cursor position.
     */
    getCursor(): { row: number; col: number } {
        return { row: this.cursorRow, col: this.cursorCol };
    }

    /**
     * Writes text at the current cursor position.
     */
    writeAt(row: number, col: number, text: string): void {
        if (row < 0 || row >= ScreenBufferComponent.ROWS || col < 0 || col >= ScreenBufferComponent.COLS) {
            return; // Out of bounds
        }

        for (let i = 0; i < text.length && col + i < ScreenBufferComponent.COLS; i++) {
            this.buffer[row][col + i] = text[i];
        }
    }

    /**
     * Writes text at the current cursor position and advances the cursor.
     */
    write(text: string): void {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === '\n') {
                this.cursorRow++;
                this.cursorCol = 0;
                if (this.cursorRow >= ScreenBufferComponent.ROWS) {
                    this.scroll();
                    this.cursorRow = ScreenBufferComponent.ROWS - 1;
                }
            } else {
                if (this.cursorCol >= ScreenBufferComponent.COLS) {
                    this.cursorRow++;
                    this.cursorCol = 0;
                    if (this.cursorRow >= ScreenBufferComponent.ROWS) {
                        this.scroll();
                        this.cursorRow = ScreenBufferComponent.ROWS - 1;
                    }
                }
                
                this.buffer[this.cursorRow][this.cursorCol] = char;
                this.cursorCol++;
            }
        }
    }

    /**
     * Scrolls the buffer up by one line.
     */
    private scroll(): void {
        for (let row = 0; row < ScreenBufferComponent.ROWS - 1; row++) {
            this.buffer[row] = [...this.buffer[row + 1]];
        }
        this.buffer[ScreenBufferComponent.ROWS - 1] = new Array(ScreenBufferComponent.COLS).fill(' ');
    }

    /**
     * Gets the entire screen buffer as an array of strings.
     */
    getBuffer(): string[] {
        return this.buffer.map(row => row.join(''));
    }

    /**
     * Gets a specific row from the buffer.
     */
    getRow(row: number): string {
        if (row < 0 || row >= ScreenBufferComponent.ROWS) {
            return '';
        }
        return this.buffer[row].join('');
    }

    /**
     * Gets the screen dimensions.
     */
    getDimensions(): { rows: number; cols: number } {
        return { rows: ScreenBufferComponent.ROWS, cols: ScreenBufferComponent.COLS };
    }
}
