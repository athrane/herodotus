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

  test('create factory returns a visible, mutable instance by default', () => {
    const comp = IsVisibleComponent.create();
    expect(comp).toBeInstanceOf(IsVisibleComponent);
    expect(comp.isVisible()).toBe(true);
    expect(comp.isImmutable()).toBe(false);
    comp.setVisibility(false);
    expect(comp.isVisible()).toBe(false);
  });

  test(' create factory returns a visible, mutable instance when given false', () => {
    const comp = IsVisibleComponent.create(false);
    expect(comp).toBeInstanceOf(IsVisibleComponent);
    expect(comp.isVisible()).toBe(false);
    expect(comp.isImmutable()).toBe(false);
  });

  test('createImmutable returns an immutable instance', () => {
    const comp = IsVisibleComponent.createImmutable(false);
    expect(comp).toBeInstanceOf(IsVisibleComponent);
    expect(comp.isVisible()).toBe(false);
    expect(comp.isImmutable()).toBe(true);
    comp.setVisibility(true); // should be ignored because immutable
    expect(comp.isVisible()).toBe(false);
  });
});
