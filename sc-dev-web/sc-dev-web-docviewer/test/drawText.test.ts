import { expect } from '@open-wc/testing';
import { DrawText } from '../src/utils/drawText.js';

describe('DrawText', () => {
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  });

  afterEach(() => {
    document.body.removeChild(canvas);
  });
  it('should draw left aligned text', () => {
    const html = '<p style="text-align: left;">align left</p>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
    expect(text.height).to.be.greaterThan(0);
  });

  it('should draw center aligned text', () => {
    const html = '<p style="text-align: center;">align center</p>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
    expect(text.height).to.be.greaterThan(0);
  });

  it('should draw right aligned text', () => {
    const html = '<p style="text-align: right;">align right</p>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
    expect(text.height).to.be.greaterThan(0);
  });

  it('should draw mixed alignments and normal', () => {
    const html = `
      <p style="text-align: left;">left</p>
      <p style="text-align: center;">center</p>
      <p style="text-align: right;">right</p>
      <p>normal</p>
    `;
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.height).to.be.greaterThan(0);
  });

  it('should initialize and draw empty content', () => {
    const text = new DrawText(ctx, 0, 0, '', '#ff0000', 10);
    text.draw();
    expect(text.ctx).to.equal(ctx);
    expect(text.width).to.be.a('number');
    expect(text.height).to.be.a('number');
  });

  it('should draw plain text', () => {
    const text = new DrawText(ctx, 10, 10, 'hello world', '#000', 20);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
    expect(text.height).to.be.greaterThan(0);
    expect(text.contains(15, 15)).to.be.true;
    expect(text.contains(0, 0)).to.be.false;
  });

  it('should draw bold text', () => {
    const text = new DrawText(ctx, 0, 0, '<b>bold</b>', '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should draw italic text', () => {
    const text = new DrawText(ctx, 0, 0, '<i>italic</i>', '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should draw underlined and strikethrough text', () => {
    const text = new DrawText(ctx, 0, 0, '<u>underline</u> <s>strike</s>', '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should draw subscript and superscript', () => {
    const text = new DrawText(ctx, 0, 0, 'H<sub>2</sub>O and x<sup>2</sup>', '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should draw colored and background text', () => {
    const text = new DrawText(ctx, 0, 0, '<span style="color: #f00; background-color: #eee">color</span>', '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should handle multiple block elements', () => {
    const html = '<div>line1</div><div>line2</div><div>line3</div>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.height).to.be.greaterThan(0);
  });

  it('should ignore empty and whitespace nodes', () => {
    const html = '<div>   </div><div>\n</div><div>not empty</div>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.height).to.be.greaterThan(0);
  });

  it('should handle nested styles', () => {
    const html = '<b><i><u>nested</u></i></b>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should handle font size and weight from style', () => {
    const html = '<span style="font-size: 30px; font-weight: bold">big bold</span>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should handle contains for out-of-bounds', () => {
    const text = new DrawText(ctx, 50, 50, 'test', '#000', 18);
    text.draw();
    expect(text.contains(0, 0)).to.be.false;
    expect(text.contains(1000, 1000)).to.be.false;
  });

  it('should handle special tags and edge cases', () => {
    const html = '<h4>h4</h4><p>p</p><div>div</div><span>span</span>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.height).to.be.greaterThan(0);
  });

  it('should handle random id generation', () => {
    const text = new DrawText(ctx, 0, 0, 'id test', '#000', 18);
    expect(text.id).to.be.a('string');
  });

  it('should handle empty string and only tags', () => {
    const text = new DrawText(ctx, 0, 0, '<div></div>', '#000', 18);
    text.draw();
    expect(text.height).to.be.a('number');
  });

  it('should handle deeply nested elements', () => {
    const html = '<div><span><b><i>deep</i></b></span></div>';
    const text = new DrawText(ctx, 0, 0, html, '#000', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should handle color fallback', () => {
    const text = new DrawText(ctx, 0, 0, 'fallback', '', 18);
    text.draw();
    expect(text.width).to.be.greaterThan(0);
  });

  it('should handle minimum font size', () => {
    const text = new DrawText(ctx, 0, 0, 'min size', '#000', 1);
    text.draw();
    expect(text.size).to.equal(16);
  });
});
