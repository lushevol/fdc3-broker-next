import { html } from 'lit';
import { fixture, expect, elementUpdated } from '@open-wc/testing';
import { ScIconCard } from '../../../src/components/ScCard/ScIconCard.js';
import '../../../elements/sc-icon-card.js';

describe('ScIconCard', () => {
  it('should pass accessibility tests', async () => {
    const el = await fixture<ScIconCard>(html`<sc-icon-card></sc-icon-card>`);

    expect(el).to.be.accessible();
  });

  it('renders default card', async () => {
    const el = await fixture<ScIconCard>(html`<sc-icon-card></sc-icon-card>`);

    expect(el.size).to.equal('full');
    expect(el.src).to.equal('');
    expect(el.title).to.equal('');
    expect(el.width).to.equal('100%');
    expect(el.height).to.equal('auto');
  });

  it('renders half size card', async () => {
    const el = document.createElement('sc-icon-card');
    el.setAttribute('size', 'half');
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(el.getAttribute('size')).to.equal('half');
  });

  it('renders one-third size card', async () => {
    const el = document.createElement('sc-icon-card');
    el.setAttribute('size', 'one-third');
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(el.getAttribute('size')).to.equal('one-third');
  });

  it('renders one-fourth size card', async () => {
    const el = document.createElement('sc-icon-card');
    el.setAttribute('size', 'one-fourth');
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(el.getAttribute('size')).to.equal('one-fourth');
  });

  it('renders title out card', async () => {
    const el = document.createElement('sc-icon-card');
    el.setAttribute('layout', 'title-out');
    document.body.appendChild(el);
    await elementUpdated(el);
    expect(el.getAttribute('layout')).to.equal('title-out');
    const container = document.querySelector(
      '.sc-icon-card-container .sc-icon-card-title'
    );
    expect(container).to.equal(null);
  });

  it('renders icon card', async () => {
    const el = await fixture<ScIconCard>(html`
      <sc-icon-card
        mode='default'
        src='images/logo.svg'
        title='my card'
        title-size='xxs'
        body='test'
        space-size='xxs'
        image-align='left'
        text-align='left'
        selected
        hover-highlight
        no-border
        layout='title-in'
        size='full'
      ></sc-icon-card>
    `);
    fixture<ScIconCard>(html`
      <sc-icon-card
        mode='default'
        src='images/logo.svg'
        title='my card'
        title-size='xs'
        body='test'
        space-size='xs'
        image-align='center'
        text-align='center'
        layout='title-out'
        size='half'
      ></sc-icon-card>
    `);
    fixture<ScIconCard>(html`
      <sc-icon-card
        mode='default'
        src='images/logo.svg'
        title='my card'
        title-size='sm'
        body='test'
        space-size='sm'
        image-align='right'
        text-align='right'
        layout='content-cover'
        size='one-third'
      ></sc-icon-card>
    `);
    fixture<ScIconCard>(html`
      <sc-icon-card
        mode='default'
        src='images/logo.svg'
        title='my card'
        title-size='md'
        body='test'
        space-size='md'
        image-align='justify'
        text-align='justify'
        size='one-fourth'
      ></sc-icon-card>
    `);
    fixture<ScIconCard>(html`
      <sc-icon-card
        mode='icon'
        icon='bell--line'
        icon-size='xxs'
        title='my card'
        title-size='lg'
        space-size='lg'
        size='custom'
        width='100%'
        height='auto'
      ></sc-icon-card>
    `);
    fixture<ScIconCard>(html`
      <sc-icon-card
        mode='icon'
        icon='bell--line'
        icon-size='xs'
        title='my card'
      ></sc-icon-card>
    `);
    fixture<ScIconCard>(html`
      <sc-icon-card
        mode='icon'
        title='my card'
        height='100px'        
      ></sc-icon-card>
    `);

    expect(el.size).to.equal('full');
    expect(el.src).to.equal('images/logo.svg');
    expect(el.title).to.equal('my card');
  });

  it('handles sc-action event', async () => {
    const el = await fixture<ScIconCard>(html`
      <sc-icon-card
        title="Test Title"
        sub-title="Test Subtitle"
        body="Test Body"
      ></sc-icon-card>
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
