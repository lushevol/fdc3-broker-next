/**
 * Easing functions to use for web animations.
 *
 * **NOTE:** `EASING.EMPHASIZED` is approximated with unknown accuracy.
 *
 * TODO(b/241113345): replace with tokens
 */
export const EASING = {
  STANDARD: 'cubic-bezier(0.2, 0, 0, 1)',
  STANDARD_ACCELERATE: 'cubic-bezier(.3,0,1,1)',
  STANDARD_DECELERATE: 'cubic-bezier(0,0,0,1)',
  EMPHASIZED: 'cubic-bezier(.3,0,0,1)',
  EMPHASIZED_ACCELERATE: 'cubic-bezier(.3,0,.8,.15)',
  EMPHASIZED_DECELERATE: 'cubic-bezier(.05,.7,.1,1)',
  EMPHASIZED_EASE_OUT: 'ease-out',
} as const;

/**
 * Animates an element using keyframes. Returns a promise that resolves after the animation completes or gets canceled.
 */
export function animateTo(
  el: HTMLElement,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions,
) {
  return new Promise((resolve) => {
    if (options?.duration === Infinity) {
      throw new Error('Promise-based animations must be finite.');
    }

    if (el && el.animate) {
      const animation = el.animate(keyframes, {
        ...options,
        duration: prefersReducedMotion() ? 0 : options?.duration,
      });

      animation.addEventListener('cancel', resolve, { once: true });
      animation.addEventListener('finish', resolve, { once: true });
    } else {
      resolve(false);
    }
  });
}

/** Parses a CSS duration and returns the number of milliseconds. */
export function parseDuration(delay: number | string) {
  const newDelay = delay.toString().toLowerCase();

  if (newDelay.indexOf('ms') > -1) {
    return parseFloat(newDelay);
  }

  if (newDelay.indexOf('s') > -1) {
    return parseFloat(newDelay) * 1000;
  }

  return parseFloat(newDelay);
}

/** Tells if the user has enabled the "reduced motion" setting in their browser or OS. */
export function prefersReducedMotion() {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  return query.matches;
}

/**
 * Stops all active animations on the target element. Returns a promise that resolves after all animations are canceled.
 */
export function stopAnimations(el: HTMLElement) {
  const animations = el.getAnimations ? el.getAnimations() : [];
  return Promise.all(
    animations.map((animation) => {
      return new Promise((resolve) => {
        const handleAnimationEvent = requestAnimationFrame(resolve);

        animation.addEventListener('cancel', () => handleAnimationEvent, { once: true });
        animation.addEventListener('finish', () => handleAnimationEvent, { once: true });
        animation.cancel();
      });
    }),
  );
}

/**
 * We can't animate `height: auto`, but we can calculate the height and shim keyframes by replacing it with the
 * element's scrollHeight before the animation.
 */
export function shimKeyframesHeightAuto(keyframes: Keyframe[], calculatedHeight: number) {
  return keyframes.map((keyframe) => ({
    ...keyframe,
    height: keyframe.height === 'auto' ? `${calculatedHeight}px` : keyframe.height,
  }));
}
