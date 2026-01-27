/**
 * FDC3 Error Types
 *
 * Re-exports FDC3 standard errors and provides broker-specific error classes.
 * Custom error classes provide specific error types for different failure scenarios.
 *
 * @see data-model.md#L59-L65
 */

// Re-export FDC3 standard errors
export { ChannelError, ResolveError } from '@finos/fdc3';

/**
 * Error thrown when broker initialization fails
 *
 * Indicates that the FDC3 broker could not be initialized due to
 * configuration errors or missing dependencies.
 */
export class BrokerInitializationError extends Error {
  constructor(message: string) {
    super(`[Broker] Initialization failed: ${message}`);
    this.name = 'BrokerInitializationError';
  }
}

/**
 * Error thrown when entitlement validation fails
 *
 * Indicates that the user lacks permissions to perform a requested action.
 * This is thrown when entitlement checks deny access to operations like
 * sending intents, receiving intents, joining channels, or opening apps.
 */
export class EntitlementError extends Error {
  constructor(message: string) {
    super(`[Broker] Entitlement check failed: ${message}`);
    this.name = 'EntitlementError';
  }
}

/**
 * Error thrown when intent queue operations fail
 *
 * Indicates an error in queuing, delivering, or managing intents for
 * unmounted tiles.
 */
export class IntentQueueError extends Error {
  constructor(message: string) {
    super(`[Broker] Intent queue error: ${message}`);
    this.name = 'IntentQueueError';
  }
}

/**
 * Error thrown when app directory operations fail
 *
 * Indicates an error in querying or interacting with the app directory service.
 */
export class AppDirectoryError extends Error {
  constructor(message: string) {
    super(`[Broker] App Directory error: ${message}`);
    this.name = 'AppDirectoryError';
  }
}

/**
 * Error thrown when OpenFin bridge operations fail
 *
 * Indicates an error in communicating with or interoperating with OpenFin applications.
 */
export class OpenFinBridgeError extends Error {
  constructor(message: string) {
    super(`[Broker] OpenFin bridge error: ${message}`);
    this.name = 'OpenFinBridgeError';
  }
}
