import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import  '../../../elements/sc-slider.js';
import { ScSlider } from '../../../src/components/ScSlider/ScSlider.js';
import { nothing } from 'lit';

describe('ScSlider', () => {
  it('renders with default properties', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider></sc-slider>`);
    expect(el.value).to.equal('');
    expect(el.type).to.equal('number');
    expect(el.step).to.equal(1);
    expect(el.min).to.equal(0);
    expect(el.max).to.equal(100);
  });

  it('renders with type="range" and value as array', async () => {
    const el = await fixture<ScSlider>(
      html`<sc-slider type="range" .value=${[10, 50]}></sc-slider>`
    );
    expect(el.isRangeType()).to.be.true;
    expect(el.value).to.deep.equal([10, 50]);
  });

  it('renders with type="string" and stops', async () => {
    const el = await fixture<ScSlider>(html`
      <sc-slider type="string">
        <sc-slider-stop value="a">A</sc-slider-stop>
        <sc-slider-stop value="b">B</sc-slider-stop>
      </sc-slider>
    `);
    await el.updateComplete;
    expect(el.isStringType()).to.be.true;
    expect(el.stops.length).to.equal(2);
    expect(el.stops[0].value).to.equal('a');
    expect(el.stops[1].value).to.equal('b');
  });

  it('calls syncValue and emits sc-change on moveHandle in realtime mode', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider type="range" realtime></sc-slider>`);
    const spy = sinon.spy(el, 'syncValue');
    el.moveHandle(0, 15);
    el.moveHandle(1, 25);
    expect(spy.called).to.be.true;
  });

  it('does not move handle if disabled', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider disabled></sc-slider>`);
    const prevPositions = [...el['_positions']];
    el.moveHandle(1, 50);
    expect(el['_positions']).to.deep.equal(prevPositions);
  });

  it('getPositionPercent returns correct percentage', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider min="0" max="200"></sc-slider>`);
    expect(el.getPositionPercent(100)).to.equal(50);
    expect(el.getPositionPercent(0)).to.equal(0);
    expect(el.getPositionPercent(200)).to.equal(100);
  });

  it('getStopValue returns stop value for string type', async () => {
    const el = await fixture<ScSlider>(html`
      <sc-slider type="string">
        <sc-slider-stop value="foo">Foo</sc-slider-stop>
        <sc-slider-stop value="bar">Bar</sc-slider-stop>
      </sc-slider>
    `);
    await el.updateComplete;
    expect(el.getStopValue(1)).to.equal('bar');
  });

  it('getStopLabel returns stop label for string type', async () => {
    const el = await fixture<ScSlider>(html`
      <sc-slider type="string">
        <sc-slider-stop value="foo">Foo</sc-slider-stop>
        <sc-slider-stop value="bar">Bar</sc-slider-stop>
      </sc-slider>
    `);
    await el.updateComplete;
    expect(el.getStopLabel(0)).to.equal('Foo');
    expect(el.getStopLabel(1)).to.equal('Bar');
  });

  it('syncValue emits sc-change event', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider></sc-slider>`);
    el['_positions'][1] = 42;
    setTimeout(() => el.syncValue());
    const event = await oneEvent(el, 'sc-change');
    expect(event.detail.value).to.equal(42);
  });

  it('handles keydown events for arrow keys', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider stop-step="10"></sc-slider>`);
    const moveSpy = sinon.spy(el, 'moveHandle');
    const handle = el.shadowRoot?.querySelector('.slider-handle.handle-1') as HTMLElement | null;
    handle?.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true, ctrlKey: true }));
    handle?.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', bubbles: true, ctrlKey: true }));
    expect(moveSpy.calledTwice).to.be.true;
  });

  it('handles keyup events for arrow keys', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider></sc-slider>`);
    const moveSpy = sinon.spy(el, 'syncValue');
    const handle = el.shadowRoot?.querySelector('.slider-handle.handle-1') as HTMLElement | null;
    handle?.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true, ctrlKey: true }));
    handle?.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight', bubbles: true, ctrlKey: true }));
    expect(moveSpy.called).to.be.true;
  });

  it('normalizePosition rounds off step values', async ()=>{
    const el = await fixture<ScSlider>(html`<sc-slider step="10"></sc-slider>`);
    expect(el.normalizePosition(43)).to.equal(40);
    expect(el.getPositionFromGlobal(98)).to.equal(100);
  });

  it('getPositionFromGlobal clamps values within min/max', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider min="10" max="20"></sc-slider>`);
    // Mock bounding rect using sinon stub for the _slider getter
    sinon.stub(el as any, '_slider').get(() => ({
      getBoundingClientRect: () => ({ left: 0, width: 100 }),
    }));
    expect(el.getPositionFromGlobal(-100)).to.equal(10);
    expect(el.getPositionFromGlobal(200)).to.equal(20);
  });

  it('renderInput returns nothing for string type', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider type="string"></sc-slider>`);
    expect(el.renderInput(0)).to.equal(nothing);
    expect(el.renderInput(1)).to.equal(nothing);
  });
  
  it('renderInput renders for number type', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider type="number"></sc-slider>`);
    expect(el.renderInput(0)).to.equal(nothing);
    expect(el.renderInput(1)).to.not.equal(nothing);
  });
  
  it('renderInput renders for range type', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider type="range"></sc-slider>`);
    expect(el.renderInput(0)).to.not.equal(nothing);
    expect(el.renderInput(1)).to.not.equal(nothing);
  });
  
  it('renders readonly', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider readonly value="42"></sc-slider>`);
    // Check if the rendered HTML contains "42" for readonly
    expect(el.shadowRoot?.innerHTML).to.include('42');
  });
  
  it('renderStepStops renders', async () => {
    const el = await fixture<ScSlider>(html`<sc-slider stop-step="10"></sc-slider>`);
    expect(el.renderStepStops()).to.not.equal(nothing);
  });
});