import { ActionQueueComponent } from '../../../src/gui/menu/ActionQueueComponent';

describe('ActionQueueComponent', () => {
  test('initial queue is empty', () => {
    const comp = new ActionQueueComponent();
    expect(comp.getActions()).toEqual([]);
    expect(comp.queue.length).toBe(0);
  });

  test('addAction adds actions and getActions returns them', () => {
    const comp = new ActionQueueComponent();
    comp.addAction('ACTION_ONE');
    comp.addAction('ACTION_TWO');

    expect(comp.getActions()).toEqual(['ACTION_ONE', 'ACTION_TWO']);
    // verify the public queue property reflects the same contents
    expect(comp.queue).toEqual(['ACTION_ONE', 'ACTION_TWO']);
  });

  test('clear resets the queue to empty', () => {
    const comp = new ActionQueueComponent();
    comp.addAction('X');
    expect(comp.getActions().length).toBe(1);
    comp.clear();
    expect(comp.getActions()).toEqual([]);
    expect(comp.queue.length).toBe(0);
  });

  test('multiple instances maintain independent queues', () => {
    const a = new ActionQueueComponent();
    const b = new ActionQueueComponent();

    a.addAction('A');
    b.addAction('B');

    expect(a.getActions()).toEqual(['A']);
    expect(b.getActions()).toEqual(['B']);
  });
});
