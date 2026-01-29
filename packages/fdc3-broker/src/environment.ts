/**
 * Environment Detection Utilities
 *
 * Detects runtime environment (browser vs OpenFin).
 * @see research.md#L572-L587
 */

/**
 * Check if OpenFin is available
 * @returns true if running in OpenFin environment
 */
export function isOpenFinAvailable(): boolean {
  try {
    const fin = (globalThis as any).fin;
    console.log('DEBUG: isOpenFinAvailable', {
      finType: typeof fin,
      hasDesktop: fin ? typeof fin.desktop : 'N/A',
    });
    // const fin = (globalThis as any).fin; // Removed duplicate declaration
    return (
      typeof fin !== 'undefined' &&
      typeof fin === 'object' &&
      fin !== null &&
      typeof fin.desktop !== 'undefined' &&
      fin.desktop !== null
    );
  } catch {
    return false;
  }
}

/**
 * Get runtime environment
 * @returns 'openfin' if in OpenFin, 'browser' otherwise
 */
export async function getRuntimeEnvironment(): Promise<'browser' | 'openfin'> {
  if (isOpenFinAvailable()) {
    return 'openfin';
  }
  return 'browser';
}

/**
 * Check if PostMessage API is available for cross-domain communication
 * @returns true if postMessage API is available in browser
 */
export function isPostMessageAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.postMessage === 'function';
}

/**
 * Declare global fin type for OpenFin
 */
declare global {
  // eslint-disable-next-line no-var
  var fin: any;
}
