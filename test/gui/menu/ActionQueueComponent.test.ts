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

  test('queue maintains FIFO order', () => {
    const comp = new ActionQueueComponent();
    const actions = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];
    
    actions.forEach(action => comp.addAction(action));
    
    expect(comp.getActions()).toEqual(actions);
  });

  test('can add duplicate actions', () => {
    const comp = new ActionQueueComponent();
    comp.addAction('DUPLICATE');
    comp.addAction('DUPLICATE');
    comp.addAction('DIFFERENT');
    comp.addAction('DUPLICATE');

    expect(comp.getActions()).toEqual(['DUPLICATE', 'DUPLICATE', 'DIFFERENT', 'DUPLICATE']);
  });

  test('can handle empty string actions', () => {
    const comp = new ActionQueueComponent();
    comp.addAction('');
    comp.addAction('NORMAL');
    comp.addAction('');

    expect(comp.getActions()).toEqual(['', 'NORMAL', '']);
  });

  test('getActions returns reference to actual array', () => {
    const comp = new ActionQueueComponent();
    comp.addAction('TEST');
    
    const actions1 = comp.getActions();
    const actions2 = comp.getActions();
    
    expect(actions1).toBe(actions2); // Same reference
    expect(actions1).toBe(comp.queue); // References internal queue
  });

  test('clear can be called multiple times safely', () => {
    const comp = new ActionQueueComponent();
    comp.addAction('TEST');
    
    comp.clear();
    expect(comp.getActions()).toEqual([]);
    
    comp.clear(); // Should not throw
    expect(comp.getActions()).toEqual([]);
    
    comp.clear(); // Should not throw
    expect(comp.getActions()).toEqual([]);
  });

  test('can add actions after clearing', () => {
    const comp = new ActionQueueComponent();
    comp.addAction('BEFORE_CLEAR');
    comp.clear();
    comp.addAction('AFTER_CLEAR');

    expect(comp.getActions()).toEqual(['AFTER_CLEAR']);
  });

  test('handles large number of actions', () => {
    const comp = new ActionQueueComponent();
    const numActions = 1000;
    
    for (let i = 0; i < numActions; i++) {
      comp.addAction(`ACTION_${i}`);
    }
    
    expect(comp.getActions()).toHaveLength(numActions);
    expect(comp.getActions()[0]).toBe('ACTION_0');
    expect(comp.getActions()[numActions - 1]).toBe(`ACTION_${numActions - 1}`);
  });
});
