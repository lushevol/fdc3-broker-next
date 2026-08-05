import { animateTo, prefersReducedMotion, stopAnimations, shimKeyframesHeightAuto } from '../../src/shared/animation.js';

describe('animation', () => {
  let element: any;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
    jest.restoreAllMocks();
  });

  describe('animateTo', () => {
    it('should resolve after animation finishes', async () => {
      const mockAnimation = {
        addEventListener: jest.fn((event, callback) => {
          if (event === 'finish') callback();
        }),
      };
      element.animate = jest.fn(() => mockAnimation as unknown as Animation);

      const keyframes = [{ opacity: 0 }, { opacity: 1 }];
      const options = { duration: 500 };

      await expect(animateTo(element, keyframes, options)).resolves.toBeUndefined();
      expect(element.animate).toHaveBeenCalledWith(keyframes, expect.objectContaining(options));
    });

    it('should throw an error if duration is Infinity', async () => {
      const keyframes = [{ opacity: 0 }, { opacity: 1 }];
      const options = { duration: Infinity };

      await expect(animateTo(element, keyframes, options)).rejects.toThrow('Promise-based animations must be finite.');
    });

    it('should resolve immediately if element does not support animations', async () => {
      element.animate = undefined;

      const keyframes = [{ opacity: 0 }, { opacity: 1 }];
      await expect(animateTo(element, keyframes)).resolves.toBe(false);
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return true if prefers-reduced-motion is enabled', () => {
      jest.spyOn(window, 'matchMedia').mockImplementation((query:string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        dispatchEvent: jest.fn(),
      } as any));

      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false if prefers-reduced-motion is not enabled', () => {
      jest.spyOn(window, 'matchMedia').mockImplementation(() => ({
        matches: false,
        media: '',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        onchange: null,
        dispatchEvent: jest.fn(),
      } as any));

      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('stopAnimations', () => {
    it('should cancel all active animations on the element', async () => {
      const mockAnimation = {
        cancel: jest.fn(),
        addEventListener: jest.fn((event, callback) => {
          if (event === 'cancel') callback();
        }),
      };
      element.getAnimations = jest.fn(() => [mockAnimation as unknown as Animation]);

      await stopAnimations(element);

      expect(mockAnimation.cancel).toHaveBeenCalled();
    });

    it('should resolve immediately if there are no animations', async () => {
      element.getAnimations = jest.fn(() => []);

      await expect(stopAnimations(element)).resolves.toEqual([]);
    });
  });

  describe('shimKeyframesHeightAuto', () => {
    it('should replace "auto" height with calculated height', () => {
      const keyframes = [{ height: 'auto' }, { height: '100px' }];
      const calculatedHeight = 200;

      const result = shimKeyframesHeightAuto(keyframes, calculatedHeight);
      expect(result).toEqual([{ height: '200px' }, { height: '100px' }]);
    });

    it('should leave other heights unchanged', () => {
      const keyframes = [{ height: '50px' }, { height: '100px' }];
      const calculatedHeight = 200;

      const result = shimKeyframesHeightAuto(keyframes, calculatedHeight);
      expect(result).toEqual(keyframes);
    });
  });
});
