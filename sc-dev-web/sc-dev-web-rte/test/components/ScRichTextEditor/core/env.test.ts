import { expect } from '@open-wc/testing';

describe('env', () => {
  const originalUserAgent = navigator.userAgent;
  const originalExecCommand = document.execCommand;
  beforeEach(() => {
    jest.resetModules();
  });
  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    // @ts-ignore
    document.execCommand = originalExecCommand;
  });

  it('should correctly identify a Chrome browser', async () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      configurable: true,
    });
    const { default: env } = await import(
      '../../../../src/components/ScRichTextEditor/core/env.js'
    );
    expect(env.isChrome).to.be.true;
    expect(env.isSafari).to.be.false;
  });

  it('should correctly identify a Safari browser (without Chrome in the name)', async () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1',
      configurable: true,
    });
    const { default: env } = await import(
      '../../../../src/components/ScRichTextEditor/core/env.js'
    );
    expect(env.isSafari).to.be.true;
    expect(env.isChrome).to.be.false;
  });

  it('should correctly identify an Edge browser', async () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edge/18.19044',
      configurable: true,
    });
    const { default: env } = await import(
      '../../../../src/components/ScRichTextEditor/core/env.js'
    );
    expect(env.isEdge).to.be.true;
    expect(env.isWebkit).to.be.false;
  });

  it('should correctly identify support for document features', async () => {
    const { default: env } = await import(
      '../../../../src/components/ScRichTextEditor/core/env.js'
    );
    expect(env.isSupportExec).to.be.a('boolean');
    expect(env.isW3CRangeSupport).to.be.a('boolean');
  });

  it('should correctly identify when execCommand is not supported', async () => {
    // @ts-ignore
    delete document.execCommand;
    const { default: env } = await import(
      '../../../../src/components/ScRichTextEditor/core/env.js'
    );
    expect(env.isSupportExec).to.be.false;
  });
});
