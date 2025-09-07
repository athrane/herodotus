import { InputComponent } from '../../../src/gui/view/InputComponent';

describe('InputComponent', () => {
  test('default lastInput is null and setters/getters work', () => {
    const comp = new InputComponent();

    expect(comp.getLastInput()).toBeNull();

    comp.setLastInput('test input');
    expect(comp.getLastInput()).toBe('test input');

    comp.setLastInput(null);
    expect(comp.getLastInput()).toBeNull();
  });

  test('multiple instances maintain independent lastInput values', () => {
    const a = new InputComponent();
    const b = new InputComponent();

    a.setLastInput('A');
    b.setLastInput('B');

    expect(a.getLastInput()).toBe('A');
    expect(b.getLastInput()).toBe('B');
  });
});
