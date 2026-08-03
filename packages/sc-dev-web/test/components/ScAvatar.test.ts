import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScAvatar } from '../../src/components/ScAvatar/ScAvatar.js';
import '../../elements/sc-avatar.js';

describe('ScAvatar', () => {
  it('renders background avatar', async () => {
    let el;
    el = await fixture<ScAvatar>(html`<sc-avatar></sc-avatar>`);
    expect(el).to.not.equal(null);
    expect(el).to.not.equal(undefined);
    el = await fixture<ScAvatar>(html`<sc-avatar background="blue"></sc-avatar>`);
    expect(el.background).to.equal('blue');
    el = await fixture<ScAvatar>(html`<sc-avatar background="green"></sc-avatar>`);
    expect(el.background).to.equal('green');
    el = await fixture<ScAvatar>(html`<sc-avatar background="red"></sc-avatar>`);
    expect(el.background).to.equal('red');
    el = await fixture<ScAvatar>(html`<sc-avatar background="yellow"></sc-avatar>`);
    expect(el.background).to.equal('yellow');
  });

  it('renders size avatar', async () => {
    let el;
    el = await fixture<ScAvatar>(html`<sc-avatar size="xs"></sc-avatar>`);
    expect(el.size).to.equal('xs');
    el = await fixture<ScAvatar>(html`<sc-avatar size="sm"></sc-avatar>`);
    expect(el.size).to.equal('sm');
    el = await fixture<ScAvatar>(html`<sc-avatar></sc-avatar>`);
    expect(el.size).to.equal('md');
    el = await fixture<ScAvatar>(html`<sc-avatar size="lg"></sc-avatar>`);
    expect(el.size).to.equal('lg');
    el = await fixture<ScAvatar>(html`<sc-avatar size="xl"></sc-avatar>`);
    expect(el.size).to.equal('xl');
  });

  it('renders size avatar with badge', async () => {
    let el;
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        size="xs"
        show-badge
        badge-label="note"
        badge-type="text"
      ></sc-avatar>`
    );
    expect(el.size).to.equal('xs');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        size="sm"
        show-badge
        badge-label="note"
        badge-type="text"
      ></sc-avatar>`
    );
    expect(el.size).to.equal('sm');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-label="note"
        badge-type="text"
      ></sc-avatar>`
    );
    expect(el.size).to.equal('md');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        size="lg"
        show-badge
        badge-label="note"
        badge-type="text"
      ></sc-avatar>`
    );
    expect(el.size).to.equal('lg');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        size="xl"
        show-badge
        badge-label="note"
        badge-type="text"
      ></sc-avatar>`
    );
    expect(el.size).to.equal('xl');
  });

  it('renders avatar with shape', async () => {
    const el = await fixture<ScAvatar>(html`<sc-avatar shape="square" size="xl"></sc-avatar>`);
    expect(el.shape).to.equal('square');
  });

  it('renders avatar with badge', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar show-badge badge-number="99"></sc-avatar>`
    );
    expect(el.badgeNumber).to.equal(99);
  });

  it('renders avatar with badge colors', async () => {
    let el;
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-number="99"
        badge-color="info"
      ></sc-avatar>`
    );
    expect(el.badgeColor).to.equal('info');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-number="99"
        badge-color="error"
      ></sc-avatar>`
    );
    expect(el.badgeColor).to.equal('error');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-number="99"
        badge-color="success"
      ></sc-avatar>`
    );
    expect(el.badgeColor).to.equal('success');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-number="99"
        badge-color="warning"
      ></sc-avatar>`
    );
    expect(el.badgeColor).to.equal('warning');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-number="99"
        badge-color="disabled"
      ></sc-avatar>`
    );
    expect(el.badgeColor).to.equal('disabled');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-number="99"
        badge-color="dark-blue"
      ></sc-avatar>`
    );
    expect(el.badgeColor).to.equal('dark-blue');
    el = await fixture<ScAvatar>(
      html`<sc-avatar show-badge badge-number="99"></sc-avatar>`
    );
    expect(el.badgeColor).to.equal('red');
  });

  it('renders avatar with image', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar 
    src="https://cdn.imgbin.com/3/6/12/imgbin-computer-icons-child-avatar-child-NJfxwAUuYHnqrHwB10nxESxHt.jpg">
    </sc-avatar>`);
    expect(el).to.not.equal(null);
    expect(el).to.not.equal(undefined);
  });

  it('renders avatar with slotted element', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar>SC</sc-avatar>`);
    expect(el).to.not.equal(null);
    expect(el).to.not.equal(undefined);
  });

  it('renders avatar with outlined state', async () => {
    const el = await fixture<ScAvatar>(html`<sc-avatar outlined></sc-avatar>`);
    expect(el.outlined).to.equal(true);
  });

  it('renders avatar with clickable state', async () => {
    const el = await fixture<ScAvatar>(html`<sc-avatar clickable></sc-avatar>`);
    expect(el.clickable).to.equal(true);
  });

  it('renders avatar with selected state', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar clickable selected></sc-avatar>`
    );
    expect(el.selected).to.equal(true);
  });

  it('renders avatar with disabled state', async () => {
    const el = await fixture<ScAvatar>(html`<sc-avatar disabled></sc-avatar>`);
    expect(el.disabled).to.equal(true);
  });

  it('renders avatar with disabled and outlined state', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar disabled outlined></sc-avatar>`
    );
    expect(el.disabled).to.equal(true);
    expect(el.outlined).to.equal(true);
  });

  it('renders avatar with tooltip', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar tooltip="Hello" tooltip-on-hover></sc-avatar>`
    );
    expect(el.tooltip).to.equal('Hello');
    expect(el.tooltipOnHover).to.equal(true);
  });

  it('renders avatar with tooltip placement', async () => {
    let el;
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        tooltip="Hello"
        tooltip-on-hover
        tooltip-placement="top"
      ></sc-avatar>`
    );
    expect(el.tooltipPlacement).to.equal('top');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        tooltip="Hello"
        tooltip-on-hover
        tooltip-placement="bottom"
      ></sc-avatar>`
    );
    expect(el.tooltipPlacement).to.equal('bottom');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        tooltip="Hello"
        tooltip-on-hover
        tooltip-placement="left"
      ></sc-avatar>`
    );
    expect(el.tooltipPlacement).to.equal('left');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        tooltip="Hello"
        tooltip-on-hover
        tooltip-placement="right"
      ></sc-avatar>`
    );
    expect(el.tooltipPlacement).to.equal('right');
  });

  it('renders avatar with tooltip mode', async () => {
    let el;
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        tooltip="Hello"
        tooltip-on-hover
        tooltip-mode="dark"
      ></sc-avatar>`
    );
    expect(el.tooltipMode).to.equal('dark');
    el = await fixture<ScAvatar>(
      html`<sc-avatar
        tooltip="Hello"
        tooltip-on-hover
        tooltip-mode="light"
      ></sc-avatar>`
    );
    expect(el.tooltipMode).to.equal('light');
  });

  it('renders avatar with dot badge', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar show-badge badge-type="dot"></sc-avatar>`
    );
    expect(el.badgeType).to.equal('dot');
  });

  it('renders avatar with dot badge on square shape', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar show-badge badge-type="dot" shape="square"></sc-avatar>`
    );
    expect(el.badgeType).to.equal('dot');
    expect(el.shape).to.equal('square');
  });

  it('renders avatar with number badge', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-type="number"
        badge-number="5"
      ></sc-avatar>`
    );
    expect(el.badgeType).to.equal('number');
    expect(el.badgeNumber).to.equal(5);
  });

  it('renders avatar with text badge', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar
        show-badge
        badge-type="text"
        badge-label="new"
      ></sc-avatar>`
    );
    expect(el.badgeType).to.equal('text');
    expect(el.badgeLabel).to.equal('new');
  });

  it('getBadgeSize returns correct size', async () => {
    let el;
    el = await fixture<ScAvatar>(html`<sc-avatar size="xs"></sc-avatar>`);
    expect(el.getBadgeSize()).to.equal('sm');
    el = await fixture<ScAvatar>(html`<sc-avatar size="sm"></sc-avatar>`);
    expect(el.getBadgeSize()).to.equal('sm');
    el = await fixture<ScAvatar>(html`<sc-avatar size="md"></sc-avatar>`);
    expect(el.getBadgeSize()).to.equal('md');
    el = await fixture<ScAvatar>(html`<sc-avatar size="lg"></sc-avatar>`);
    expect(el.getBadgeSize()).to.equal('lg');
    el = await fixture<ScAvatar>(html`<sc-avatar size="xl"></sc-avatar>`);
    expect(el.getBadgeSize()).to.equal('lg');
  });

  it('getBadgeOffset returns offset values', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar size="md" show-badge badge-type="dot"></sc-avatar>`
    );
    const offset = el.getBadgeOffset(el.size);
    expect(offset.leftOffset).to.not.equal(null);
    expect(offset.topOffset).to.not.equal(null);
  });

  it('handles image error and falls back to icon', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar src="invalid-image.png"></sc-avatar>`
    );
    const img = el.shadowRoot?.querySelector('img');
    img?.dispatchEvent(new Event('error'));
    await el.updateComplete;
    expect(el._error).to.equal(true);
  });

  it('handles click event when clickable', async () => {
    const el = await fixture<ScAvatar>(html`<sc-avatar clickable></sc-avatar>`);
    let clicked = false;
    el.addEventListener('sc-avatar-click', () => {
      clicked = true;
    });
    const content = el.shadowRoot?.querySelector('.avatar-content');
    content?.dispatchEvent(new Event('click'));
    expect(clicked).to.equal(true);
  });

  it('does not fire click event when disabled', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar clickable disabled></sc-avatar>`
    );
    let clicked = false;
    el.addEventListener('sc-avatar-click', () => {
      clicked = true;
    });
    const content = el.shadowRoot?.querySelector('.avatar-content');
    content?.dispatchEvent(new Event('click'));
    expect(clicked).to.equal(false);
  });

  it('handles keyboard events when clickable', async () => {
    const el = await fixture<ScAvatar>(html`<sc-avatar clickable></sc-avatar>`);
    let clicked = false;
    el.addEventListener('sc-avatar-click', () => {
      clicked = true;
    });
    const content = el.shadowRoot?.querySelector('.avatar-content');
    content?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(clicked).to.equal(true);
  });

  it('sets tabindex when clickable and focus-enabled', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar clickable focus-enabled></sc-avatar>`
    );
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('removes tabindex when disabled', async () => {
    const el = await fixture<ScAvatar>(
      html`<sc-avatar clickable disabled></sc-avatar>`
    );
    expect(el.getAttribute('tabindex')).to.equal(null);
  });
});
