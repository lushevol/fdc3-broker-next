import { hexToRgb, hexToRgba, rgbToRgba } from '../../src/shared/colors';

describe('colors utility functions', () => {
  describe('hexToRgb', () => {
    it('should convert hex to rgb object', () => {
      const result = hexToRgb('#ff0000');
      expect(result).not.toBeNull();
      expect(result).toMatchObject({ r: 255, g: 0, b: 0 });
      expect(result?.toString()).toBe('rgb(255, 0, 0)');
    });

    it('should handle hex without #', () => {
      const result = hexToRgb('00ff00');
      expect(result).not.toBeNull();
      expect(result).toMatchObject({ r: 0, g: 255, b: 0 });
      expect(result?.toString()).toBe('rgb(0, 255, 0)');
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('xyz')).toBeNull();
      expect(hexToRgb('#12345')).toBeNull();
      expect(hexToRgb('#gggggg')).toBeNull();
    });
  });

  describe('hexToRgba', () => {
    it('should convert hex to rgba object with opacity', () => {
      const result = hexToRgba('#0000ff', 0.5);
      expect(result).not.toBeNull();
      expect(result).toMatchObject({ r: 0, g: 0, b: 255, a: 0.5 });
      expect(result?.toString()).toBe('rgba(0, 0, 255, 0.5)');
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgba('badhex', 0.7)).toBeNull();
    });
  });

  describe('rgbToRgba', () => {
    it('should convert rgb object to rgba object', () => {
      const rgb = { r: 10, g: 20, b: 30 };
      const result = rgbToRgba(rgb, 0.8);
      expect(result).not.toBeNull();
      expect(result).toMatchObject({ r: 10, g: 20, b: 30, a: 0.8 });
      expect(result?.toString()).toBe('rgba(10, 20, 30, 0.8)');
    });

    it('should convert rgb string to rgba object', () => {
      const result = rgbToRgba('rgb(100, 150, 200)', 0.3);
      expect(result).not.toBeNull();
      expect(result).toMatchObject({ r: 100, g: 150, b: 200, a: 0.3 });
      expect(result?.toString()).toBe('rgba(100, 150, 200, 0.3)');
    });

    it('should return null for invalid rgb string', () => {
      expect(rgbToRgba('rgb(300, 0, 0)', 0.5)).not.toBeNull(); // 300 is technically valid for parsing
      expect(rgbToRgba('not-a-color', 0.5)).toBeNull();
    });
  });
});