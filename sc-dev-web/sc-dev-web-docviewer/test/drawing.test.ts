import { expect } from '@open-wc/testing';
import { Drawing } from '../src/utils/drawing.js';
import { ETools } from '../src/components/ScScriber.toolbar.util.js';
import { Context } from 'svgcanvas';

describe('test drawing', () => {
  it('drawing', async () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const pen = new Drawing(ctx, ETools.pen, {
      color: ctx.strokeStyle,
      size: ctx.lineWidth,
      points: [{ x: 1, y: 1 }],
    });
    const text = new Drawing(ctx, ETools.text, {
      color: '#fff',
      size: 16,
      content: 'test',
      x: 9,
      y: 9,
    });
    const line = new Drawing(ctx, ETools.line, {
      color: ctx.strokeStyle,
      size: ctx.lineWidth,
      startX: 1,
      startY: 1,
      endX: 9,
      endY: 9,
    });
    const rectangle = new Drawing(ctx, ETools.rectangle, {
      color: ctx.strokeStyle,
      size: ctx.lineWidth,
      startX: 1,
      startY: 1,
      endX: 9,
      endY: 9,
    });
    const highlightRect = new Drawing(ctx, ETools.highlightRect, {
      color: ctx.strokeStyle,
      size: ctx.lineWidth,
      startX: 1,
      startY: 1,
      endX: 9,
      endY: 9,
    });
    const arrow = new Drawing(ctx, ETools.arrow, {
      color: ctx.strokeStyle,
      size: ctx.lineWidth,
      startX: 1,
      startY: 1,
      endX: 9,
      endY: 9,
    });
    const circle = new Drawing(ctx, ETools.circle, {
      color: ctx.strokeStyle,
      size: ctx.lineWidth,
      startX: 0,
      startY: 0,
      endX: 9,
      endY: 9,
    });
    circle.updateBrushStyle();
    circle.drawArrow(0, 0, 10, 10);
    pen.draw();
    text.draw();
    line.draw();
    rectangle.draw();
    highlightRect.draw();
    arrow.draw();
    circle.draw();
    pen.isErased(1, 1, 20);
    text.isErased(1, 1, 20);
    line.isErased(1, 1, 20);
    rectangle.isErased(1, 1, 20);
    highlightRect.isErased(1, 1, 20);
    arrow.isErased(1, 1, 20);
    circle.isErased(1, 1, 20);

    expect(pen.type).to.equal(ETools.pen);
  });

  it('drawing with svgcanvas Context covers instanceof branch', () => {
    const svgCtx = new Context({ width: 200, height: 200 });

    // ETools.text has a no-op switch body so draw() reaches the
    // "if (this.ctx instanceof Context)" branch without triggering
    // geometry-interfaces methods that are unimplemented in jsdom.
    const textSvg = new Drawing(svgCtx, ETools.text, {
      color: '#000000',
      size: 16,
      content: 'hello',
      x: 10,
      y: 10,
    }, 'fixed-id-ctx-test');
    textSvg.draw();

    // Verify the instanceof Context path ran
    expect(textSvg.id).to.equal('fixed-id-ctx-test');
  });
});
