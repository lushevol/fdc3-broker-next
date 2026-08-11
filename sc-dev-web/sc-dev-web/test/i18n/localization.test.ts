import { expect } from '@open-wc/testing';
import { locales, getLocale } from '../../src/i18n/localization.js';

describe('Localization', () => {
  it('should have locales defined', () => {
    const localNames = Object.keys(locales);
    getLocale();
    expect(localNames.length).to.equal(2);
  });
});