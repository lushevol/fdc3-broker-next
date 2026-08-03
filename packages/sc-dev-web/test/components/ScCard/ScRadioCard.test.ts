import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScRadioCard } from '../../../src/components/ScCard/ScRadioCard.js';
import '../../../elements/sc-radio-card.js';

const title = 'This is the title of card';
const subTitle = 'This is the sub title of card';
const body = 'This is the body of card';

describe('ScRadioCard', () => {
  it('renders default card', async () => {
    const el = await fixture<ScRadioCard>(html`<sc-radio-card></sc-radio-card>`);

    expect(el.checked).to.equal(false);
    expect(el.disabled).to.equal(false);
  });

  it('renders checked status', async () => {
    const el = await fixture<ScRadioCard>(
      html`
        <sc-radio-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          checked
        >
      </sc-radio-card>
      `
    );
    expect(el.checked).to.equal(true);
  });

  it('renders disabled status', async () => {
    const el = await fixture<ScRadioCard>(
      html`
        <sc-radio-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          disabled
        >
      </sc-radio-card>
      `
    );
    expect(el.disabled).to.equal(true);
  });

  it('radio card click', async () => {
    const el = await fixture<ScRadioCard>(
      html`
        <sc-radio-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
        >
      </sc-radio-card>
      `
    );
    const checked = el.checked;
    el.onRadioCardClick(new MouseEvent('mousedown'));
    expect(el.checked).to.equal(!checked);
  });

  it('radio card clickable', async () => {
    const el = await fixture<ScRadioCard>(
      html`
        <sc-radio-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          clickable=${true}
        >
      </sc-radio-card>
      `
    );
    const checked = el.checked;
    el.onRadioCardClick(new MouseEvent('mousedown'));
    expect(el.checked).to.equal(checked);
  });

  it('fires sc-change event when clickable is true and radio is clicked', async () => {
    const el = await fixture<ScRadioCard>(
      html`
        <sc-radio-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          clickable
        >
        </sc-radio-card>
      `
    );
  
    el.onRadioClick(new MouseEvent('mousedown'));
    expect(el.checked).to.equal(true);
  });

  it('handles sc-action event', async () => {
    const el = await fixture<ScRadioCard>(html`
      <sc-radio-card
        title="Test Title"
        sub-title="Test Subtitle"
        body="Test Body"
      ></sc-radio-card>
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
