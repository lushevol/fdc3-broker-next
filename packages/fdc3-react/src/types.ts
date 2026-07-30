import type { AppIdentifier } from '@finos/fdc3';
import type { AppDefinition, AppDirectoryMode } from 'ratan-fdc3-app-directory';
import type {
  OpenFinBridgeOptions,
  PostMessageBridgeOptions,
  WorkflowDefinition,
} from 'ratan-fdc3-broker';
import type { ModuleLoaderApi } from 'ratan-module-composition';

export interface FDC3PlatformAdapter {
  /** Current host authentication state. */
  isAuthenticated: boolean;
  /** Host-owned behavior for opening an application or workspace tile. */
  openApp(app: AppIdentifier): Promise<AppIdentifier>;
  /** Optional host-owned behavior for closing an application or workspace tile. */
  closeApp?(app: AppIdentifier): Promise<void>;
  /** Required business entitlement decision. There is deliberately no allow-all default. */
  validateEntitlements(tileId: string, action: string): Promise<boolean>;
  /** Optional host notification for workspace creation. */
  onWorkspaceCreated?(workspaceId: string): void;
  /** Optional host security-event sink. */
  onSecurityEvent?(event: string, data: unknown): void;
}

export interface FDC3DirectoryOptions {
  baseUrl?: string;
  getAuthToken?: () => string | Promise<string | null> | null | undefined;
  timeout?: number;
  mode?: AppDirectoryMode;
}

export interface FDC3InteropOptions {
  enableOpenFin?: boolean;
  openFin?: OpenFinBridgeOptions;
  postMessage?: Omit<PostMessageBridgeOptions, 'allowedOrigins'> & {
    allowedOrigins: string[];
  };
  forceExternalIntentSourceInstanceIds?: string[];
}

export interface FDC3RootProviderProps {
  apps: AppDefinition[];
  children: React.ReactNode;
  platform: FDC3PlatformAdapter;
  directory?: FDC3DirectoryOptions;
  interop?: FDC3InteropOptions;
  moduleLoader?: ModuleLoaderApi;
  workflows?: WorkflowDefinition[];
  userChannelIds?: string[];
  debug?: boolean;
  showConsole?: boolean;
}
