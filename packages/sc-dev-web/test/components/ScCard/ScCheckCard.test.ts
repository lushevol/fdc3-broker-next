import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScCheckCard } from '../../../src/components/ScCard/ScCheckCard.js';
import '../../../elements/sc-check-card.js';

const title = 'This is the title of card';
const subTitle = 'This is the sub title of card';
const body = 'This is the body of card';

describe('ScCheckCard', () => {
  it('renders default card', async () => {
    const el = await fixture<ScCheckCard>(html`<sc-check-card></sc-check-card>`);

    expect(el.checked).to.equal(false);
    expect(el.disabled).to.equal(false);
  });

  it('renders checked status', async () => {
    const el = await fixture<ScCheckCard>(
      html`
        <sc-check-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          checked
        >
      </sc-check-card>
      `
    );
    expect(el.checked).to.equal(true);
  });

  it('renders disabled status', async () => {
    const el = await fixture<ScCheckCard>(
      html`
        <sc-check-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          disabled
        >
      </sc-check-card>
      `
    );
    expect(el.disabled).to.equal(true);
  });

  it('click check card', async () => {
    const el = await fixture<ScCheckCard>(
      html`
        <sc-check-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
        >
      </sc-check-card>
      `
    );
    const checked = el.checked;
    el.onCheckCardClick();
    expect(el.checked).to.equal(!checked);
  });

  it('clickable check card', async () => {
    const el = await fixture<ScCheckCard>(
      html`
        <sc-check-card
          title='${title}'
          sub-title='${subTitle}'
          body='${body}'
          clickable=${true}
        >
      </sc-check-card>
      `
    );
    const checked = el.checked;
    el.onCheckCardClick();
    expect(el.checked).to.equal(checked);
  });

  it('handles sc-action event', async () => {
    const el = await fixture<ScCheckCard>(html`
      <sc-check-card
        title="Test Title"
        sub-title="Test Subtitle"
        body="Test Body"
      ></sc-check-card>
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
