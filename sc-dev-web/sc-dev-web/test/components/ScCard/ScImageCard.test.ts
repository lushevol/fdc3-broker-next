import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScImageCard } from '../../../src/components/ScCard/ScImageCard.js';
import '../../../elements/sc-image-card.js';

describe('ScImageCard', () => {
  it('renders default card', async () => {
    const el = await fixture<ScImageCard>(html`<sc-image-card></sc-image-card>`);

    expect(el.title).to.equal('');
    expect(el.subTitle).to.equal('');
    expect(el.titleSize).to.equal('sm');
  });

  it('renders image card', async () => {
    const el = await fixture<ScImageCard>(html`
      <sc-image-card
        image-position='right'
        background-color='red'
        background-position='0px 0px'
        background-repeat='no-repeat'
        background-size='cover'
        src='images/logo.svg'        
      ></sc-image-card>
    `);

    fixture<ScImageCard>(html`
      <sc-image-card
        layout='background'
        image-position='right'
        background-color='red'
        background-position='0px 0px'
        background-repeat='no-repeat'
        background-size='cover'
        src='images/logo.svg'        
      ></sc-image-card>
    `);

    expect(el.title).to.equal('');
    expect(el.subTitle).to.equal('');
    expect(el.titleSize).to.equal('sm');
  });

  it('handles sc-action event', async () => {
    const el = await fixture<ScImageCard>(html`
      <sc-image-card
        title="Test Title"
        sub-title="Test Subtitle"
        body="Test Body"
      ></sc-image-card>
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
  });
});
