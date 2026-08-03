import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScContentCard } from '../../../src/components/ScCard/ScContentCard.js';
import '../../../elements/sc-content-card.js';
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
const supplementaryDetails = [
  { iconName: 'clock--line', details: '9 APIs' },
  { iconName: 'calendar--line', details: '20 September 2023' },
  { iconName: 'clock--line', details: '23 min read' },
];

describe('ScContentCard', () => {
  it('renders default card', async () => {
    const el = await fixture<ScContentCard>(html`<sc-content-card></sc-content-card>`);

    expect(el.title).to.equal('');
    expect(el.subTitle).to.equal('');
    expect(el.titleSize).to.equal('sm');
  });

  it('renders image card', async () => {
    const el = await fixture<ScContentCard>(html`
      <sc-content-card 
        title='Getting started' 
        sub-title='Architecture'
        body='test body' 
        href="https://www.baidu.com"
        src='images/link-card-bg.png'
        tags-group=${JSON.stringify(tagsGroup)}
        supplementary-details=${JSON.stringify(supplementaryDetails)}
      >
      </sc-content-card>
    `);
    el._shellClient = {
      openInSplitView: (link: any) => { console.log('Open in split view:', link); },
    };
    expect(el.title).to.equal('Getting started');
    expect(el.subTitle).to.equal('Architecture');
    expect(el.titleSize).to.equal('sm');
    el.openSplitView(el.href);
    el.openViewLink(el.href);
    el.renderDefaultActions();
  });

  it('handles sc-action event', async () => {
    const actions = [html`<div>Edit</div>`];
    const el = await fixture<ScContentCard>(html`
      <sc-content-card
        title="Test Title"
        sub-title="Test Subtitle"
        body="Test Body"
        .actions=${actions}
      ></sc-content-card>
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
    const mainDom = el.shadowRoot?.querySelector('.sc-content-card');
    mainDom?.dispatchEvent(new Event('click'));
  });
});
