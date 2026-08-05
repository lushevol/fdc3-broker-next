import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDropdownOption } from '@scdevkit/webkit';
import { ScEmployeeCard } from '../../../src/components/ScEmployee/ScEmployeeCard.js';
import '../../../elements/sc-employee.js';


describe('ScEmployeeCard', () => {
  it('renders default employee card', async () => {
    const el = await fixture<ScEmployeeCard>(html`<sc-employee-card id='1626487'></sc-employee-card>`);
    expect(el.id).to.equal('1626487');
    expect(el.data).to.equal(undefined);
    expect(el.mode).to.equal('normal');
    expect(JSON.stringify(el.fields)).to.equal(
      JSON.stringify(['id', 'avatar', 'businessTitle', 'department', 'email', 'phone'])
    );
    expect(el.actions).to.equal(undefined);
  });

  it('renders custom fields', async () => {
    const fields = ['location', 'phone', 'email'];
    const data = {
      location: 'New York',
      phone: '123-456-7890',
      email: 'test@example.com',
    };

    const el = await fixture<ScEmployeeCard>(
      html`<sc-employee-card .fields=${fields} .data=${data}></sc-employee-card>`
    );

    const fieldItems = el.shadowRoot?.querySelectorAll('.field-item');
    expect(fieldItems?.length).to.equal(3); 
  });

  it('renders compact mode', async () => {
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' mode=compact fields='[]'></sc-employee-card>
    `);
    expect(el.mode).to.equal('compact');
    const fieldItems: NodeListOf<Element> | undefined = el.shadowRoot?.querySelectorAll('.field-item');
    expect(fieldItems && Array.from(fieldItems).length).to.equal(0);
  });

  it('renders tag mode', async () => {
    const el = await fixture<ScEmployeeCard>(html`<sc-employee-card id='1626487' mode=tag></sc-employee-card>`);
    expect(el.mode).to.equal('tag');
    const avatarEles: NodeListOf<Element> | undefined = el.shadowRoot?.querySelectorAll('sc-avatar[size=sm]');
    expect(avatarEles && Array.from(avatarEles).length).to.equal(1);
  });

  it('renders with link property', async () => {
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' mode='tag' link></sc-employee-card>
    `);
    expect(el.link).to.be.true;
    const cardElement = el.shadowRoot?.querySelector('.link-tag-card');
    expect(cardElement).to.exist;
  });

  it('renders with transparent property', async () => {
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' mode='tag' transparent></sc-employee-card>
    `);
    expect(el.transparent).to.be.true;
    const cardElement = el.shadowRoot?.querySelector('.transparent-tag-card');
    expect(cardElement).to.exist;
  });

  it('renders with vertical and center-aligned properties', async () => {
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' vertical center-aligned></sc-employee-card>
    `);
    expect(el.vertical).to.be.true;
    expect(el.centerAligned).to.be.true;
    const cardElement = el.shadowRoot?.querySelector('.center-aligned');
    expect(cardElement).to.exist;
  });

  it('renders with disabled property', async () => {
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' mode='compact' disabled></sc-employee-card>
    `);
    expect(el.disabled).to.be.true;
    const cardElement = el.shadowRoot?.querySelector('.disabled');
    expect(cardElement).to.exist;
  });

  it('renders with center-aligned property', async () => {
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' mode='compact' vertical center-aligned></sc-employee-card>
    `);
    expect(el.centerAligned).to.be.true;
    const cardElement = el.shadowRoot?.querySelector('.center-aligned');
    expect(cardElement).to.exist;
  });

  it('renders custom actions', async () => {
    const actions = [html`<div>Edit</div>`];
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' .actions=${actions}></sc-employee-card>
    `);
    const options: NodeListOf<ScDropdownOption> | undefined = 
      el.shadowRoot?.querySelector('sc-dropdown-input')?.querySelectorAll('sc-dropdown-option');
    expect(options && Array.from(options).length).to.equal(0);
  });

  it('override the default actions', async () => {
    const actions = [html`<div>Edit</div>`];
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id='1626487' override-default-action .actions=${actions}></sc-employee-card>
    `);
    const options: NodeListOf<ScDropdownOption> | undefined = 
      el.shadowRoot?.querySelector('sc-dropdown-input')?.querySelectorAll('sc-dropdown-option');
    expect(options && Array.from(options).length).to.equal(0);
  });

  it('opens profile URL on card click when not disabled', async () => {
    const id = '1626487';
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id=${id}></sc-employee-card>
    `);

    const originalWindowOpen = window.open;
    let openedUrl: string | null = null;
    window.open = (url?: string | URL, target?: string, features?: string) => {
      openedUrl = url?.toString() || null;
      return null;
    };

    const scCard = el.shadowRoot?.querySelector('sc-card');
    scCard?.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(openedUrl).to.equal(`/profile/${id}`);
    window.open = originalWindowOpen;
  });

  it('does not open profile URL when disabled', async () => {
    const id = '1626487';
    const el = await fixture<ScEmployeeCard>(html`
      <sc-employee-card id=${id} ?disabled=${true}></sc-employee-card>
    `);

    const originalWindowOpen = window.open;
    let openedUrl: string | null = null;
    window.open = (url?: string | URL, target?: string, features?: string) => {
      openedUrl = url?.toString() || null;
      return null;
    };

    const scCard = el.shadowRoot?.querySelector('sc-card');
    scCard?.dispatchEvent(new CustomEvent('sc-card-click', { detail: { value: true } }));

    expect(openedUrl).to.be.null;
    window.open = originalWindowOpen;
  });
});