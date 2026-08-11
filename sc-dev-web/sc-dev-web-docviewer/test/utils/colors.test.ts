import { expect } from '@open-wc/testing';
import { composeAlpha, parseColor } from '../../src/utils/colors.js';

describe('test colors', () => {
	it('parseColor handles hex formats', () => {
		expect(parseColor('#abc')).to.deep.equal({ r: 170, g: 187, b: 204, a: 1 });
		expect(parseColor('#abcd')).to.deep.equal({ r: 170, g: 187, b: 204, a: 221 / 255 });
		expect(parseColor('#aabbcc')).to.deep.equal({ r: 170, g: 187, b: 204, a: 1 });
		expect(parseColor('#aabbcc80')).to.deep.equal({ r: 170, g: 187, b: 204, a: 128 / 255 });
	});

	it('parseColor handles rgb formats', () => {
		expect(parseColor('rgb(1, 2, 3)')).to.deep.equal({ r: 1, g: 2, b: 3, a: 1 });
		expect(parseColor('rgba(10, 20, 30, 0.5)')).to.deep.equal({
			r: 10,
			g: 20,
			b: 30,
			a: 0.5,
		});
	});

	it('parseColor returns null for invalid input', () => {
		expect(parseColor('')).to.equal(null);
		expect(parseColor('#12')).to.equal(null);
		expect(parseColor('rgb(1, 2)')).to.equal(null);
		expect(parseColor('hsl(0, 0%, 0%)')).to.equal(null);
	});

	it('composeAlpha returns null for unknown colors', () => {
		expect(composeAlpha('hsl(0, 0%, 0%)')).to.equal(null);
	});

	it('composeAlpha uses default target alpha', () => {
		expect(composeAlpha('#000')).to.equal('rgba(0, 0, 0, 0.4)');
		expect(composeAlpha('#fff')).to.equal('rgba(255, 255, 255, 0.4)');
	});

	it('composeAlpha supports custom target alpha', () => {
		expect(composeAlpha('#808080', 0.75)).to.equal('rgba(86, 86, 86, 0.75)');
	});

	it('composeAlpha preserves visual color', () => {
		expect(composeAlpha('rgba(100, 150, 200, 0.5)')).to.equal('rgba(61, 124, 186, 0.4)');
	});
});
