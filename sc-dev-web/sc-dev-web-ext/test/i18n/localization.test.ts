import { expect } from '@open-wc/testing';
import { getLocale, setLocale } from '../../src/i18n/localization.js';

describe('Localization', () => {
  it('should have locales defined', async () => {
    const locale = getLocale();
    expect(locale).to.equal('en');
    await setLocale('zh-CN');
    const newLocale = getLocale();
    expect(newLocale).to.equal('zh-CN');
  });
});