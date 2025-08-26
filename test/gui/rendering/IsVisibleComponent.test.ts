import { IsVisibleComponent } from '../../../src/gui/rendering/IsVisibleComponent';

describe('IsVisibleComponent', () => {
  test('defaults to visible when constructed without args', () => {
    const comp = new IsVisibleComponent();
    expect(comp.isVisible()).toBe(true);
  });

  test('honors constructor boolean parameter', () => {
    const visible = new IsVisibleComponent(true);
    const invisible = new IsVisibleComponent(false);

    expect(visible.isVisible()).toBe(true);
    expect(invisible.isVisible()).toBe(false);
  });

  test('setVisibility updates the visibility state', () => {
    const comp = new IsVisibleComponent(true);
    expect(comp.isVisible()).toBe(true);

    comp.setVisibility(false);
    expect(comp.isVisible()).toBe(false);

    comp.setVisibility(true);
    expect(comp.isVisible()).toBe(true);
  });
});
