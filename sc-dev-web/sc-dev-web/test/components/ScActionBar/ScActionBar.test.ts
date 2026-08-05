import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScActionBar } from '../../../src/components/ScActionBar/ScActionBar.js';
import { mockMatchMedia } from '../../shared/mediaQuery.js';
import '../../../elements/sc-action-bar.js';
import { mockAnimation } from '../../shared/animation.js';
import { ScMenuItem } from '../../../src/components/ScMenu/ScMenuItem.js';

const defaultConfig = {
    'left-back': {
        back: {
            mode: 'href',
            to: '#',
            label: 'Back',
            disabled: false,
        },
    },   
    'left-actions': [
        {
            text: 'title-1',
        },
        {
            buttonDropdown: {
                value: '',
                name: 'My View',
                iconName: 'file-text--line',
                disabled: false,
                width: '90px',
                'option-width': '120px',
                data: [
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                    { label: 'Option 3', value: '3' },
                ],
                'sc-select': (e:CustomEvent)=>{
                    console.log('My View sc-select test ', e.detail);
                },
            },
        },
        {
            button: {
                type: 'link',
                leftIcon: 'alert-circle--line',
                disabled: false,
                buttonText: 'Show Tips',
                width: '120px',
                tooltipText: 'show tips',
                click: (e:CustomEvent)=>{
                    console.log('Show Tips click ', e.detail);
                },
            },
        },
    ],
    'right-helper': {
        label: 'Last saved: 3 hours ago',
        tooltip: 'Tooltip content here',
        required: false,
    },
    'right-groups': [
        {
            button: {
                type: 'link',
                disabled: false,
                width: '80px',
                buttonText: 'Save Draft',
                click: (e:CustomEvent)=>{
                    console.log('Save Draft click ', e);
                },
            },
        },
        {
            button: {
                type: 'secondary',
                disabled: false,
                width: '80px',
                buttonText: 'Cancel',
                click: (e:CustomEvent)=>{
                    console.log('Cancel click ', e);
                },
            },
        },
        {
            button: {
                type: 'primary',
                disabled: false,
                // width: '80px',
                buttonText: 'Submit',
                click: (e:CustomEvent)=>{
                    console.log('Submit click ', e);
                },
            },
        },
        
    ],
} as any;
describe('ScActionBar', () => {
  beforeEach(()=>{
    mockAnimation();
  });
  it('renders with default properties', async () => {
    const el = await fixture<ScActionBar>(html`<sc-action-bar .config=${defaultConfig}></sc-action-bar>`);
    expect(el).to.not.equal(null);
    const container = el.shadowRoot?.querySelector('.action-bar-container');
    expect(container).to.exist;
    expect(container?.classList.contains('bottom-border')).to.be.true;
  });

  it('renders with breadcrumb', async () => {
    const customizeConfig = {
        'left-back': {
            breadcrumb: {
                data: [
                    { name: 'Home', href: '#', target: '_blank' },
                    { name: 'Section', href: '#', target: '_blank' },
                    { name: 'Sub-section', href: '#', target: '_blank' },
                ],
            },
        },
        'right-groups': [...defaultConfig['right-groups']],
        'left-actions': [
            {
                text: 'title-2',
            },
        ],
    };
    const el = await fixture<ScActionBar>(html`<sc-action-bar .config=${customizeConfig}></sc-action-bar>`);
    expect(el).to.not.equal(null);
    const container = el.shadowRoot?.querySelector('.action-bar-container');
    expect(container).to.exist;
    expect(container?.classList.contains('bottom-border')).to.be.true;
  });

  it('renders with customize properties', async () => {
    const customizeConfig = {
        ...defaultConfig,
        'left-back': null,
        'left-actions': [
            {
                button: {
                    type: 'link',
                    leftIcon: 'alert-circle--line',
                    disabled: true,
                    buttonText: 'Show Tips',
                    width: '120px',
                    tooltipText: 'show tips',
                    click: (e:CustomEvent)=>{
                        console.log('Show Tips click ', e.detail);
                    },
                },
            },
        ],
        'right-helper': {
            label: 'Last saved: 3 hours ago',
            tooltip: '',
            required: false,
        },
        'right-groups': [
            {
                button: null,
            },
        ],
    };
    const el = await fixture<ScActionBar>(html`<sc-action-bar .config=${customizeConfig}></sc-action-bar>`);
    expect(el).to.not.equal(null);
    el.hideBottomBorder = true;
    el.hideShadow = false;
    const container = el.shadowRoot?.querySelector('.action-bar-container');
    expect(container).to.exist;
    expect(container?.classList.contains('bottom-border')).to.be.true;
  });

  it('hides back button when hide-back is true', async () => {
    const el = await fixture<ScActionBar>(html`<sc-action-bar .hide-back=${true}></sc-action-bar>`);
    const backSlot = el.shadowRoot?.querySelector('slot[name="left-back"]');
    expect(backSlot).to.not.exist;
  });

  it('renders left actions when hide-left-actions is false', async () => {
    const el = await fixture<ScActionBar>(html`<sc-action-bar ?hide-left-actions=${false}>
      <div slot="left-actions">Custom Left Action</div>
    </sc-action-bar>`);
    const leftActionsSlot = el.shadowRoot?.querySelector('slot[name="left-actions"]');
    expect(leftActionsSlot).to.exist;
  });

  it('does not render right helper when hide-right-helper is true', async () => {
    const el = await fixture<ScActionBar>(html`<sc-action-bar ?hide-right-helper=${true}></sc-action-bar>`);
    const rightHelperSlot = el.shadowRoot?.querySelector('slot[name="right-helper"]');
    expect(rightHelperSlot).to.not.exist;
  });

  it('applies z-index property', async () => {
    const el = await fixture<ScActionBar>(html`<sc-action-bar z-index="500"></sc-action-bar>`);
    await el.updateComplete;
    const container = el.shadowRoot?.querySelector('.action-bar-container');
    expect(container).to.have.attribute('style').equal('z-index:500;');
  });

  it('renders custom content in slots', async () => {
    const el = await fixture<ScActionBar>(html`<sc-action-bar>
      <div slot="left-actions">Custom Left Actions</div>
      <div slot="right-helper">Custom Right Helper</div>
      <div slot="right-groups">Custom Right Groups</div>
    </sc-action-bar>`);
    const leftActionsSlot = el.shadowRoot?.querySelector('slot[name="left-actions"]');
    const rightHelperSlot = el.shadowRoot?.querySelector('slot[name="right-helper"]');
    const rightGroupsSlot = el.shadowRoot?.querySelector('slot[name="right-groups"]');
    expect(leftActionsSlot).to.exist;
    expect(rightHelperSlot).to.exist;
    expect(rightGroupsSlot).to.exist;
  });

  it('renders with no-sticky attribute', async () => {
    const el = await fixture<ScActionBar>(html`<sc-action-bar no-sticky></sc-action-bar>`);
    const container = el.shadowRoot?.querySelector('.action-bar-container');
    expect(container?.classList.contains('action-bar-container-sticky')).to.be.false;
  });
  
  it('renders in mobile', async () => {
    mockMatchMedia();
    const el = await fixture<ScActionBar>(html`<sc-action-bar .config=${defaultConfig}></sc-action-bar>`);
    await el.updateComplete;
    expect(!!el.querySelector('.left-actions.mobile')).to.equal(false);
    mockMatchMedia.toggle(el.mediaQuery.mobileSm.media);
    el.requestUpdate();
    await el.updateComplete;
    expect(el.isMobile).to.equal(true);
    expect(!!el.shadowRoot?.querySelector('.left-actions.mobile')).to.equal(true);
    expect(el.rightDropdown).to.exist;
    const button = el.rightDropdown?.querySelector('sc-icon-button');
    button?.click();
    await el.updateComplete;
    expect(el.rightDropdown.open).to.equal(true);
    const menu = el.shadowRoot?.querySelector('sc-menu');
    expect(menu).to.exist;
    const menuItems: NodeListOf<ScMenuItem> | undefined = el.shadowRoot?.querySelectorAll('.right-group-menu-item');
    expect(menuItems?.length).to.equal(2);
    menuItems?.[0]?.click();
    await el.updateComplete;
    expect(el.rightDropdown.open).to.equal(false);
  });
});
