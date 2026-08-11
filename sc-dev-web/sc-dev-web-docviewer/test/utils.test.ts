import { expect } from '@open-wc/testing';
import { throttle } from '../src/utils/msg/lodash.js';
import { debounce } from '../src/utils/debounce.js';
import { findAncestor, getAncestorsOf } from '../src/utils/ancestor.js';

describe('test utils', () => {
  it('throttle', async () => {
    let num = 0;
    const fn = () => {
      num += 1;
    };
    const throttleFn = throttle(fn, global, 50);
    throttleFn();
    throttleFn();
    throttleFn();
    expect(num).to.equal(1);
  });

  it('debounce supports flush cancel and abort', async () => {
    jest.useFakeTimers();

    const calls: Array<{ value: number; ctx: any }> = [];
    const controller = new AbortController();
    const debounced = debounce(
      function (this: any, value: number) {
        calls.push({ value, ctx: this });
      },
      25,
      { signal: controller.signal }
    );

    const ctx = { id: 'ctx' };
    debounced.call(ctx, 1);
    debounced.cancel();
    jest.advanceTimersByTime(30);

    debounced.call(ctx, 2);
    debounced.flush();

    debounced.call(ctx, 3);
    controller.abort();
    jest.advanceTimersByTime(30);

    expect(calls).to.deep.equal([{ value: 2, ctx }]);

    jest.useRealTimers();
  });

  it('debounce supports leading edge and schedule', async () => {
    jest.useFakeTimers();

    const values: number[] = [];
    const debounced = debounce(
      (value: number) => {
        values.push(value);
      },
      20,
      { edges: ['leading', 'trailing'] }
    );

    debounced(1);
    debounced(2);
    debounced.schedule();
    jest.advanceTimersByTime(25);

    expect(values).to.deep.equal([1, 2]);

    jest.useRealTimers();
  });

  it('ancestor helpers walk parent elements slots and shadow hosts', async () => {
    const host = document.createElement('div');
    const shadowHost = document.createElement('section');
    const slot = document.createElement('slot');
    const lightChild = document.createElement('span');
    const deepChild = document.createElement('em');

    document.body.append(host);
    host.append(shadowHost);
    shadowHost.attachShadow({ mode: 'open' }).append(slot);
    shadowHost.append(lightChild);
    lightChild.append(deepChild);

    const ancestors = Array.from(getAncestorsOf(deepChild));
    expect(ancestors[0]).to.equal(lightChild);
    expect(findAncestor(deepChild, el => el === shadowHost)).to.equal(
      shadowHost
    );

    const slottedChild = document.createElement('strong');
    lightChild.append(slottedChild);
    expect(findAncestor(slottedChild, el => el === shadowHost)).to.equal(
      shadowHost
    );

    host.remove();
  });
});
