import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Logger, LogLevel } from '../src/logger';

describe('Logger', () => {
  let debug: ReturnType<typeof vi.spyOn>;
  let info: ReturnType<typeof vi.spyOn>;
  let warn: ReturnType<typeof vi.spyOn>;
  let error: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debug = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    info = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should respect enabled state and log level thresholds', () => {
    const logger = new Logger(true, LogLevel.WARN);

    logger.debug('debug hidden');
    logger.info('info hidden');
    logger.warn('warn shown', { channelId: 'red' });
    logger.error('error shown', new Error('boom'), { appId: 'chart-app' });

    expect(debug).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledWith('[FDC3:WARN] warn shown', { channelId: 'red' });
    expect(error).toHaveBeenCalledWith('[FDC3:ERROR] error shown', expect.any(Error), {
      appId: 'chart-app',
    });
  });

  it('should emit debug and info messages at DEBUG level', () => {
    const logger = new Logger(true, LogLevel.DEBUG);

    logger.debug('debug shown');
    logger.info('info shown');

    expect(debug).toHaveBeenCalledWith('[FDC3:DEBUG] debug shown', '');
    expect(info).toHaveBeenCalledWith('[FDC3:INFO] info shown', '');
  });

  it('should not emit normal logs while disabled', () => {
    const logger = new Logger(false, LogLevel.DEBUG);

    logger.debug('debug hidden');
    logger.info('info hidden');
    logger.warn('warn hidden');
    logger.error('error hidden');

    expect(debug).not.toHaveBeenCalled();
    expect(info).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it('should always emit security events', () => {
    const logger = new Logger(false, LogLevel.ERROR);

    logger.security('unauthorized-intent', { intent: 'ViewChart' });

    expect(warn).toHaveBeenCalledWith('[FDC3:SECURITY] unauthorized-intent', {
      intent: 'ViewChart',
    });
  });

  it('should allow enabling logging and changing levels after construction', () => {
    const logger = new Logger(false, LogLevel.ERROR);

    logger.setEnabled(true);
    logger.setLevel(LogLevel.DEBUG);
    logger.debug('now visible');

    expect(debug).toHaveBeenCalledWith('[FDC3:DEBUG] now visible', '');
  });
});
