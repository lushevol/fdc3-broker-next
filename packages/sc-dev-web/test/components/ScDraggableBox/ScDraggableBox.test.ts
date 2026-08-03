import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import '../../../elements/sc-draggable-box.js';
import { ScDraggableBox } from '../../../src/components/ScDraggableBox/ScDraggableBox.js';

class MockPointerEvent extends Event {
    pointerId: number;
    width: number;
    height: number;
    pressure: number;
    clientX: number;
    clientY: number;
    constructor(type:string, props:any) {
      super(type, props);
      this.pointerId = props?.pointerId || 0;
      this.width = props?.width || 1;
      this.height = props?.height || 1;
      this.pressure = props?.pressure || 0;
      this.clientX = props?.clientX || 0;
      this.clientY = props?.clientY || 0;
    }
}
describe('ScDate', () => {  
  global.PointerEvent = MockPointerEvent as any;
  it('renders draggable box', async () => {
    const el = await fixture<ScDraggableBox>(html`
        <sc-draggable-box 
            z-index=${1400}
            .position=${{ left: `${window.innerWidth / 2 - 400}px`, bottom: '100px' }}
        >
            <span>content</span>
        </sc-draggable-box>
    `);
    expect(el).to.be.instanceOf(ScDraggableBox);
    const draggableBoxDom = el.shadowRoot?.querySelector('.draggable-box');
    expect(draggableBoxDom).to.exist;
    el.draggable = false;
    draggableBoxDom?.dispatchEvent(new PointerEvent('mousedown',{
        clientX: 100,
        clientY: 100,
        bubbles: true,
    }));
    el.draggable = true;
    // touchstart
    draggableBoxDom?.dispatchEvent(new PointerEvent('touchstart',{
        clientX: 100,
        clientY: 100,
        bubbles: true,
    }));
    draggableBoxDom?.dispatchEvent(new PointerEvent('pointermove', {
        clientX: 200,
        clientY: 200,
        bubbles: true,
    }));
    // pointerup
    draggableBoxDom?.dispatchEvent(new PointerEvent('pointerup',{
        bubbles: true,
        composed: true,
    }));
  });

});
