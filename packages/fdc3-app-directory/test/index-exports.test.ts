import { describe, expect, it } from 'vitest';
import * as appDirectory from '../src/index';

describe('fdc3-app-directory public exports', () => {
  it('should expose the HTTP client and mock implementations', () => {
    expect(appDirectory.AppDirectoryClientImpl).toBeTypeOf('function');
    expect(appDirectory.MockAppDirectoryService).toBeTypeOf('function');
    expect(appDirectory.mockAppDirectory).toBeInstanceOf(appDirectory.MockAppDirectoryService);
  });
});
