import { expect } from '@open-wc/testing';
import { colorWithOpacity } from '../../src/shared/color.js';

describe('colorWithOpacity', () => {
  it('hex', async () => {
    const result = colorWithOpacity('#ff8000', 0.5);
    expect(result).to.equal('#ff800080');
  });
  it('rgb', async () => {
    const result = colorWithOpacity('rgb(255, 128, 0)', 0.5);
    expect(result).to.equal('rgba(255, 128, 0, 0.5)');
  });
  it('rgba', async () => {
    const result = colorWithOpacity('rgba(255, 128, 0, 0.8)', 0.5);
    expect(result).to.equal('rgba(255, 128, 0, 0.5)');
  });
  it('rgb/a', async () => {
    const result = colorWithOpacity('rgb(255 128 0 / 10%)', 0.5);
    expect(result).to.equal('rgb(255 128 0 / 50%)');
    
    const result2 = colorWithOpacity('rgb(255 128 0 / 0.1)', 0.5);
    expect(result2).to.equal('rgb(255 128 0 / 0.5)');
  });
  it('hsl', async () => {
    const result = colorWithOpacity('hsl(30, 100%, 50%)', 0.5);
    expect(result).to.equal('hsla(30, 100%, 50%, 0.5)');
  });
  it('hsla', async () => {
    const result = colorWithOpacity('hsla(30, 100%, 50%, 0.8)', 0.5);
    expect(result).to.equal('hsla(30, 100%, 50%, 0.5)');
  });
});