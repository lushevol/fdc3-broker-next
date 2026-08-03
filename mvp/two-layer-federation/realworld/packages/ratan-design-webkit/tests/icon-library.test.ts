import { describe, expect, it } from 'vitest';
import { resolvePlaceholderIcon } from '../src/assets/icons/placeholder.js';

describe('generated WebKit icons', () => {
  it('resolves the portal icon names to distinct scalable SVG assets', () => {
    const names = [
      'cross',
      'notification',
      'edit',
      'trash--line',
      'person--line',
      'checkmark-circle--line',
      'info-circle--line',
      'denied',
      'alert-triangle--line',
      'alert-circle--line',
    ];
    const icons = names.map(resolvePlaceholderIcon);

    expect(new Set(icons).size).toBe(names.length);
    icons.forEach((icon) => {
      expect(icon).toMatch(/^data:image\/svg\+xml,/);
      expect(decodeURIComponent(icon)).toContain('viewBox="0 0 24 24"');
    });
  });
});
