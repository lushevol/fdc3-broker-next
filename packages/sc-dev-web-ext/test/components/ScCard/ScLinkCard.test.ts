import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScLinkCard } from '../../../src/components/ScCard/ScLinkCard.js';
import '../../../elements/sc-link-card.js';
const tagsGroup = [
  {
    type: 'red',
    iconName: 'alert-circle--line',
    content: 'High risk',
  },
  {
    type: 'amber',
    iconName: 'alert-triangle--line',
    content: 'Pending approval',
  },
  {
    type: 'primary',
    iconName: 'info-circle--line',
    content: 'Information',
  },
];

describe('ScLinkCard', () => {
  it('renders default card', async () => {
    const el = await fixture<ScLinkCard>(html`<sc-link-card></sc-link-card>`);

    expect(el.title).to.equal('');
    expect(el.subTitle).to.equal('');
    expect(el.titleSize).to.equal('sm');
  });

  it('renders image card', async () => {
    const el = await fixture<ScLinkCard>(html`
      <sc-link-card 
        style="--sc-link-card-image-width:18.75rem;--sc-link-card-image-height:12.25rem;"
        title='Getting started' 
        body='test body' 
        link-text="Link address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if neededLink address can go as far as 2 lines if needed Link address can go as far as 2 lines if needed"
        href="https://www.baidu.com"
        target="_blank"
        src='images/link-card-bg.png'
        tags-group=${JSON.stringify(tagsGroup)}
      >
      </sc-link-card>
    `);
    expect(el.title).to.equal('Getting started');
    expect(el.subTitle).to.equal('');
    expect(el.titleSize).to.equal('sm');
  });

  it('handles sc-action event', async () => {
    const actions = [html`<div>Edit</div>`];
    const el = await fixture<ScLinkCard>(html`
      <sc-link-card
        title="Test Title"
        sub-title="Test Subtitle"
        body="Test Body"
        .actions=${actions}
      ></sc-link-card>
    `);

    let emittedEvent: CustomEvent | null = null;
    el.addEventListener('sc-action', (event: Event) => {
      emittedEvent = event as CustomEvent;
    });

    const mockEvent = new CustomEvent('sc-action', {
      detail: {
        target: 'test-target',
        type: 'test-type',
      },
    });

    el.handleAction(mockEvent);
    expect(emittedEvent).to.not.be.null;
    expect(emittedEvent!.detail).to.deep.equal({
      target: 'test-target',
      type: 'test-type',
    });
    await el.updateComplete;
    const mainDom = el.shadowRoot?.querySelector('.sc-link-card');
    mainDom?.dispatchEvent(new Event('click'));
  });
});
