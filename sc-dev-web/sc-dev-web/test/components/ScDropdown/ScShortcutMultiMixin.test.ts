import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import {
  ArrowShortcutMixin,
  E_KEYS,
} from '../../../src/components/ScDropdown/arrow-shortcut-mixin.js';
import { ArrowShortcutMultiMixin } from '../../../src/components/ScDropdown/arrow-shortcut-multi-mixin.js';
import ScElement from '../../../src/shared/sc-element.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import { customElement, query } from 'lit/decorators.js';
import { ScCheckbox } from '../../../src/components/ScCheckbox/ScCheckbox.js';

@customElement('test-com')
class Test extends ArrowShortcutMultiMixin(ArrowShortcutMixin(ScElement)) {
  static get scopedElements() {
    return {
      'sl-menu': SlMenu,
      'sc-checkbox': ScCheckbox,
    };
  }
  isExpandedMenuItem() { return true; }
  updateExpandedBehaviour() {}
  
  @query('.scroll-element') scrollElement: HTMLElement;
  hide() {}
  render() {
    return html` <sl-menu
      @keyup=${this.OnMenuKeyup}
      @keydown=${this.onMenuKeydown}
    >
      <div class="scroll-element">
        <div class="list-item">
          <sc-checkbox>
            <sc-dropdown-option value="first">first</sc-dropdown-option>
          </sc-checkbox>
        </div>
        <div class="list-item">
          <sc-checkbox>
            <sc-dropdown-option value="last">last</sc-dropdown-option>
          </sc-checkbox>
        </div>
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
