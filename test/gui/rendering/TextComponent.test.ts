import { TextComponent } from '../../../src/gui/rendering/TextComponent';

describe('TextComponent', () => {
  test('default constructor initializes with one empty line', () => {
    const tc = new TextComponent();
    expect(tc.getLineCount()).toBe(1);
    expect(tc.getText()).toEqual(['']);
  });

  test('constructor with single-line text', () => {
    const tc = new TextComponent('Hello World');
    expect(tc.getLineCount()).toBe(1);
    expect(tc.getText()).toEqual(['Hello World']);
  });

  test('constructor with multi-line text splits into lines', () => {
    const tc = new TextComponent('line1\nline2\nline3');
    expect(tc.getLineCount()).toBe(3);
    expect(tc.getText()).toEqual(['line1', 'line2', 'line3']);
  });

  test('setText replaces content and supports multiple lines', () => {
    const tc = new TextComponent('one');
    tc.setText('a\nb\nc');
    expect(tc.getLineCount()).toBe(3);
    expect(tc.getText()).toEqual(['a', 'b', 'c']);
  });

  test('setTexts replaces lines directly', () => {
    const tc = new TextComponent('x');
    tc.setTexts(['alpha', 'beta']);
    expect(tc.getLineCount()).toBe(2);
    expect(tc.getText()).toEqual(['alpha', 'beta']);
  });

  test('empty string results in a single empty line', () => {
    const tc = new TextComponent('');
    expect(tc.getLineCount()).toBe(1);
    expect(tc.getText()).toEqual(['']);
  });
});
