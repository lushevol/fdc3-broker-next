import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTimer } from '../../src/components/ScTimer/ScTimer.js';
import '../../elements/sc-timer.js';

describe('ScTimer', () => {
  it('renders timer', async () => {
    const el = await fixture<ScTimer>(html`<sc-timer label='Timer'></sc-timer>`);
    expect(el).to.not.equal(null);
  });

  it('renders timer with hour digit', async () => {
    const el = await fixture<ScTimer>(html`<sc-timer duration-value="15" duration-unit="second" label="Timer" 
    need-hour-digit="" size="sm" state-interval-time="5" time-out-message="Submission time out. 
    Please resubmit the form again"></sc-timer>`);
    expect(el).to.not.equal(null);
  });

  it('should calculate total duration', async () => {
    const el = await fixture<ScTimer>(html`<sc-timer></sc-timer>`);
    expect(el['getTotalDuration']({ unit: 'second', value: 30 })).to.equal(30);
    expect(el['getTotalDuration']({ unit: 'minute', value: 2 })).to.equal(120);
    expect(el['getTotalDuration']({ unit: 'hour', value: 1 })).to.equal(3600);
  });
});

