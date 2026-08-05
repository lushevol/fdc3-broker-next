import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';

import type { ScScriber } from '../src/components/ScScriber.js';
// eslint-disable-next-line no-duplicate-imports
import '../src/components/ScScriber.js';
import {
  Color,
  ETools,
  Size,
  Thickness,
} from '../src/components/ScScriber.toolbar.util.js';
import { DrawText } from '../src/utils/drawText.js';

function makePointerEvent(type: string, init: PointerEventInit & { offsetX?: number; offsetY?: number } = {}) {
  const event = new PointerEvent(type, init);
  Object.defineProperty(event, 'offsetX', {
    configurable: true,
    value: init.offsetX ?? 0,
  });
  Object.defineProperty(event, 'offsetY', {
    configurable: true,
    value: init.offsetY ?? 0,
  });
  return event;
}

function mockSvgContext(el: ScScriber) {
  const ctx = el.ctx as any;
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const svg = ctx.getSvg();
  svg.appendChild(group);
  ctx.__currentElement = group;
  ctx.__closestGroupOrSvg = jest.fn(() => group);
  ctx.beginPath = jest.fn();
  ctx.moveTo = jest.fn();
  ctx.lineTo = jest.fn();
  ctx.stroke = jest.fn();
  ctx.save = jest.fn();
  ctx.restore = jest.fn();
  ctx.closePath = jest.fn();
  ctx.arc = jest.fn();
  ctx.strokeRect = jest.fn();
  ctx.clearRect = jest.fn();
  ctx.resetTransform = jest.fn();
  ctx.scale = jest.fn();
  ctx.__clearCanvas = jest.fn();
  return { ctx, group, svg };
}

describe('test scriber com', () => {
  beforeEach(() => {
    HTMLElement.prototype.setPointerCapture = jest.fn();
  });
  afterEach(() => {
    HTMLElement.prototype.setPointerCapture = () => {};
  });

  it('color scriber', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    await el.updateComplete;
    const { ctx, group } = mockSvgContext(el);
    const size = new Size(() => {});
    const color = new Color(() => {});
    size.setConfiguration(ETools.pen, 5);
    color.setConfiguration(ETools.pen, '#123456');
    el.resetCanvas();
    el.setTool(ETools.arrow);
    el.setToolStyle(size);
    el.setToolStyle(color);
    el.active = true;
    el.handleToolbarStylesChange();
    el.drawArrow(10, 10, 20, 20);
    expect(ctx.strokeStyle).to.equal('#123456');
    expect(el.canvasWrap.classList.contains('drawing')).to.equal(true);
    expect(el.handleDragStart()).to.equal(false);
    el.activeTool = ETools.arrow;
    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 2, offsetY: 3 }));
    el._lastSvgGrp = { remove: jest.fn() } as any;
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 10, offsetY: 12 }));
    expect(el._lastSvgGrp).to.equal(group);
    el.handlePointerup();
    expect(el._lastSvgGrp).to.equal(undefined);
    el.activeTool = ETools.circle;
    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 4, offsetY: 5 }));
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 9, offsetY: 11 }));
    el.handlePointerup();
    el.activeTool = ETools.eraser;
    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 6, offsetY: 6 }));
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 7, offsetY: 8 }));
    el.handlePointerup();
    el.eraseAtPosition(10, 10);
    el.eraseAlongPath(10, 10, 10, 10);
    el.activeTool = ETools.line;
    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 1, offsetY: 1 }));
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 3, offsetY: 4 }));
    el.handlePointerup();
    el.activeTool = ETools.line;
    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 2, offsetY: 2 }));
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 5, offsetY: 6 }));
    el.handlePointerup();
    el.activeTool = ETools.rectangle;
    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 10, offsetY: 12 }));
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 4, offsetY: 6 }));
    el.handlePointerup();
    el.activeTool = ETools.text;
    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 8, offsetY: 9 }));
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 9, offsetY: 10 }));
    el.handlePointerup();
    el.handleTextBlur();
    el.makeTextInputBlur();
    el.makeTextInputFocus();
    el.hideTextMaker();
    el.resetDrawingTextState();
    el.refreshCanvas();
    el.getEraserSize();
    el.updateEraser(10, 10);
    el.handleDeleteText();
    el.handleTextDown(new PointerEvent(''));
    el.handleTextMove(new PointerEvent(''));
    el.handleTextup();
    el.handleInput(
      new CustomEvent('sc-select', {
        detail: {
          value: 'label',
        },
      })
    );
    expect(Boolean(el.getIsDrawingTextReady())).to.equal(false);
  });

  it('should update scale dimension', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 100, height: 100 }}></sc-scriber>`
    );
    mockSvgContext(el);
    el.resize(100, 100, 10);
    expect(el.style.getPropertyValue('--sc-scale-width')).to.equal('100px');
    expect(el.style.getPropertyValue('--sc-scale-height')).to.equal('100px');
    expect(el.style.getPropertyValue('--sc-scale-left')).to.equal('10px');
  });

  it('should sync root context size and append svg on connect', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    const { ctx, svg } = mockSvgContext(el);

    el.resize(75, 55, 0);
    await el.sync();

    expect(ctx.width).to.equal(75);
    expect(ctx.height).to.equal(55);
    expect(svg.getAttribute('viewBox')).to.equal('0 0 75 55');
    expect(el.canvasWrap.contains(svg)).to.equal(true);
  });

  it('should handle history change and emit event', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    let i = 1;
    function fn() {
      i++;
    }
    el.addEventListener('sc-history-change', fn);
    el.handleHistoryChange();
    expect(i).to.equal(2);
  });

  it('should handle toolbar styles change when not active', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    el.active = false;
    el.handleToolbarStylesChange();
    expect(el.active).to.equal(false);
  });

  it('should handle pointer events for text tool', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    mockSvgContext(el);
    el.activeTool = ETools.text;
    jest.spyOn(el, 'textMaker', 'get').mockReturnValue(document.createElement('div'));
    jest.spyOn(el, 'textMakerInput', 'get').mockReturnValue(document.createElement('input') as any);
    jest.spyOn(el, 'scriberRoot', 'get').mockReturnValue(document.createElement('div'));
    el.textValue = 'test';
    el.textHistory = [];
    el.handlePointerDown(new PointerEvent(''));
    el.handlePointerMove(new PointerEvent(''));
    el.handlePointerup();
    el.handleTextBlur();
    el.handleTextDown(new PointerEvent(''));
    el.handleTextMove(new PointerEvent(''));
    el.handleTextup();
  });

  it('should handle text input and blur', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    mockSvgContext(el);
    el.textValue = 'test';
    el.activeDrawingText = undefined;
    el.handleTextBlur();
    el.handleInput(new CustomEvent('sc-change', { detail: { text: 'abc' } }));
    expect(el.textValue).to.equal('abc');
  });

  it('should handle delete text', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    mockSvgContext(el);
    el.textHistory = [];
    el.history = [];
    el.activeDrawingText = undefined;
    el.handleDeleteText();
    expect(el.textHistory.length).to.equal(0);
    expect(el.history.length).to.equal(0);
  });

  it('should handle get eraser size', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    expect(el.getEraserSize()).to.be.greaterThan(0);
  });

  it('should update eraser', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    el.activeTool = ETools.eraser;
    jest.spyOn(el, 'eraser', 'get').mockReturnValue(document.createElement('div'));
    el.updateEraser(10, 10);
    expect(el.eraser.style.getPropertyValue('width')).to.contain('px');
  });

  it('should handle contains and movement logic', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    el.activeTool = ETools.text;
    mockSvgContext(el);
    const textMaker = document.createElement('div');
    Object.defineProperty(textMaker, 'offsetWidth', { configurable: true, value: 40 });
    Object.defineProperty(textMaker, 'offsetHeight', { configurable: true, value: 20 });
    const textMakerInput = document.createElement('input') as any;
    const scriberRoot = document.createElement('div');
    Object.defineProperty(scriberRoot, 'offsetWidth', { configurable: true, value: 100 });
    Object.defineProperty(scriberRoot, 'offsetHeight', { configurable: true, value: 80 });
    jest.spyOn(el, 'textMaker', 'get').mockReturnValue(textMaker);
    jest.spyOn(el, 'textMakerInput', 'get').mockReturnValue(textMakerInput);
    jest.spyOn(el, 'scriberRoot', 'get').mockReturnValue(scriberRoot);
    el.textValue = 'test';
    el.textHistory = [];
    el.activeDrawingText = new DrawText(el.ctx, 10, 10, 'test', '#000000', 4);
    el.history = [{ id: el.activeDrawingText.id, data: { x: 10, y: 10 }, draw: jest.fn() } as any];
    el.textHistory = [el.activeDrawingText];

    const movement = document.createElement('div');
    movement.className = 'movement';
    const inner = document.createElement('div');
    movement.appendChild(inner);
    const downEvent = makePointerEvent('pointerdown', { pointerId: 7 });
    Object.defineProperty(downEvent, 'target', { configurable: true, value: inner });
    el.handleTextDown(downEvent);

    expect(el.isMoveingText).to.equal(true);

    el.handleTextMove(makePointerEvent('pointermove', { offsetX: 90, offsetY: 60 }));
    el.handleTextup();

    expect(el.isMoveingText).to.equal(false);
    expect(el.activeDrawingText.x).to.be.greaterThan(0);
    expect(el.activeDrawingText.y).to.be.greaterThan(0);
  });

  it('should render', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 20, height: 20 }}></sc-scriber>`
    );
    expect(el.render()).to.be.instanceOf(Object);
  });

  it('should add and reuse svg layer via addSvgLayer', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 100, height: 100 }}></sc-scriber>`
    );
    await el.updateComplete;
    mockSvgContext(el);

    const container = document.createElement('div');
    document.body.appendChild(container);

    // First call: creates Context and appends SVG into container
    el.addSvgLayer(ETools.highlightRect, container);
    expect(container.children.length).to.be.greaterThan(0);

    // Second call with same container: no-op (SVG already parented here)
    el.addSvgLayer(ETools.highlightRect, container);
    expect(container.children.length).to.equal(1);

    // Call with a different container: moves SVG to new container.
    // Pre-populate it so the while(hasChildNodes) loop body is exercised.
    const container2 = document.createElement('div');
    container2.appendChild(document.createElement('span'));
    document.body.appendChild(container2);
    el.addSvgLayer(ETools.highlightRect, container2);
    expect(container2.children.length).to.be.greaterThan(0);

    document.body.removeChild(container);
    document.body.removeChild(container2);
  });

  it('should handle highlightRect tool with styles and pointer events', async () => {
    const el = await fixture<ScScriber>(
      html`<sc-scriber .dimension=${{ width: 100, height: 100 }}></sc-scriber>`
    );
    await el.updateComplete;
    const { ctx } = mockSvgContext(el);

    const colorWithConfig = new Color(() => {});
    colorWithConfig.setConfiguration(ETools.pen, '#ff0000');
    const thicknessWithConfig = new Thickness(() => {});
    thicknessWithConfig.setConfiguration(ETools.pen, 3);
    const colorDefault = new Color(() => {});
    const thicknessDefault = new Thickness(() => {});

    el.setToolStyle(colorWithConfig);
    el.setToolStyle(thicknessWithConfig);
    el.setToolStyle(colorDefault);
    el.setToolStyle(thicknessDefault);
    el.active = true;
    el.activeTool = ETools.highlightRect;
    el.handleToolbarStylesChange();
    expect(ctx.strokeStyle).to.equal('#000000');
    expect(ctx.lineWidth).to.equal(1);

    el.handlePointerDown(makePointerEvent('pointerdown', { offsetX: 5, offsetY: 6 }));
    el.handlePointerMove(makePointerEvent('pointermove', { offsetX: 15, offsetY: 18 }));
    el.handlePointerup();

    expect(el.activeTool).to.equal(ETools.highlightRect);
    expect(el.activeDrawing).to.equal(undefined);
    expect(el.history.length).to.equal(0);
  });
});
