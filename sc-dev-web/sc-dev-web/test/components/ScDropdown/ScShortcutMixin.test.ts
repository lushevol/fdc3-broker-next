import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import {
  ArrowShortcutMixin,
  E_KEYS,
} from '../../../src/components/ScDropdown/arrow-shortcut-mixin.js';
import ScElement from '../../../src/shared/sc-element.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import { customElement, query } from 'lit/decorators.js';

@customElement('test-com')
class Test extends ArrowShortcutMixin(ScElement) {
  static get scopedElements() {
    return {
      'sl-menu': SlMenu,
      'sl-menu-item': SlMenuItem,
    };
  }
  @query('.scroll-element') scrollElement: HTMLElement;
  hide() {}
  render() {
    return html` <sl-menu
      @keyup=${this.OnMenuKeyup}
      @keydown=${this.onMenuKeydown}
    >
      <div class="scroll-element">
        <sl-menu-item class="fisrt" value="first" class="dropdown-item">
          first
        </sl-menu-item>
        <sl-menu-item class="last" value="last" class="dropdown-item">
          last
        </sl-menu-item>
      </div>
    </sl-menu>`;
  }
}

describe('ScOption', () => {
  let el: Test;
  let keyboardEvent: KeyboardEvent;
  beforeEach(async () => {
    keyboardEvent = new KeyboardEvent('keyboard');
    el = await fixture<Test>(html` <test-com> </test-com> `);
  });

  it('scroll from top', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.down,
    });
    el.onKeydown(keyboardEvent);
    el.focusOn(el.firstMenuItem);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.firstMenuItem);
  });
  it('scroll from down', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.up,
    });
    el.onKeydown(keyboardEvent);
    el.focusOn(el.lastMenuItem);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.lastMenuItem);
  });
  it('scroll down', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.down,
    });
    el.focusOn(el.firstMenuItem);
    el.onMenuKeydown(keyboardEvent);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.lastMenuItem);
  });
  it('over scroll down', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.down,
    });
    el.focusOn(el.lastMenuItem);
    el.onMenuKeydown(keyboardEvent);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.firstMenuItem);
  });
  it('scroll top', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.up,
    });
    el.focusOn(el.lastMenuItem);
    el.onMenuKeydown(keyboardEvent);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.firstMenuItem);
  });
  it('over scroll top', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.up,
    });
    el.focusOn(el.firstMenuItem);
    el.onMenuKeydown(keyboardEvent);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.lastMenuItem);
  });
  it('scroll home', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.home,
    });
    el.focusOn(el.lastMenuItem);
    el.onMenuKeydown(keyboardEvent);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.firstMenuItem);
  });
  it('scroll end', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.end,
    });
    el.focusOn(el.firstMenuItem);
    el.onMenuKeydown(keyboardEvent);
    await el.updateComplete;
    expect(el.getCurrentItem()).to.equal(el.lastMenuItem);
  });
  it('exit scroll', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.esc,
    });
    const mockFn = jest.fn();
    el.hide = mockFn;
    el.focusOn(el.firstMenuItem);
    el.onMenuKeydown(keyboardEvent);
    expect(mockFn.mock.calls.length).to.equal(1);
  });
  it('select item', async () => {
    Object.defineProperty(keyboardEvent, 'key', {
      get: () => E_KEYS.enter,
    });
    el.focusOn(el.firstMenuItem);
    el.OnMenuKeyup(keyboardEvent);
    expect(el.getCurrentItem()).to.equal(el.firstMenuItem);
  });
});
