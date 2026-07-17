import type { ComponentType } from 'react';
import { z } from 'zod';

export const APPLICATION_CONTRACT_VERSION = '1.0.0' as const;
export const APPEARANCE_CONTRACT_VERSION = '1.0.0' as const;

export const appearanceSnapshotSchema = z.object({
  scheme: z.enum(['light', 'dark']),
  preference: z.enum(['light', 'dark', 'system']),
  density: z.enum(['compact', 'comfortable']),
  locale: z.string().min(1),
  direction: z.enum(['ltr', 'rtl']),
  contractVersion: z.literal(APPEARANCE_CONTRACT_VERSION),
});

export const platformCapabilitySchema = z.enum([
  'navigation',
  'notifications',
  'telemetry',
  'workspace',
  'appearance',
]);

const basePathSchema = z
  .string()
  .startsWith('/')
  .refine((value) => value !== '/' && !value.endsWith('/'), {
    message: 'Base path must identify an application and omit a trailing slash',
  });

export const applicationRegistryEntrySchema = z.object({
  id: z.string().min(1).regex(/^[a-z][a-z0-9-]*$/),
  displayName: z.string().min(1),
  remoteName: z.string().min(1).regex(/^[A-Za-z][A-Za-z0-9_]*$/),
  manifestUrl: z.string().url(),
  exposedModule: z.string().regex(/^\.\/[A-Za-z0-9/_-]+$/),
  basePath: basePathSchema,
  contractVersion: z.string().min(1),
  appearanceContractVersion: z.string().min(1),
  capabilities: z.array(platformCapabilitySchema),
});

export const applicationRegistrySchema = z
  .object({ applications: z.array(applicationRegistryEntrySchema).min(1) })
  .superRefine(({ applications }, context) => {
    const ids = new Set<string>();
    const basePaths = new Set<string>();
    for (const application of applications) {
      if (ids.has(application.id) || basePaths.has(application.basePath)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Application IDs and base paths must be unique',
        });
      }
      ids.add(application.id);
      basePaths.add(application.basePath);
    }
  });

export type PlatformCapabilityName = z.infer<typeof platformCapabilitySchema>;
export type AppearanceSnapshot = z.infer<typeof appearanceSnapshotSchema>;
export type ApplicationRegistryEntry = z.infer<typeof applicationRegistryEntrySchema>;
export type ApplicationRegistry = z.infer<typeof applicationRegistrySchema>;

export interface NavigationCapability {
  navigate(path: string): void;
}

export interface NotificationCapability {
  show(message: string): void;
}

export interface TelemetryCapability {
  track(event: string, data?: Record<string, unknown>): void;
}

export interface WorkspaceCapability {
  closeCurrent(): void;
}

export interface AppearanceCapability {
  getSnapshot(): AppearanceSnapshot;
  subscribe(listener: (snapshot: AppearanceSnapshot) => void): () => void;
}

export interface PlatformCapabilities {
  navigation: NavigationCapability;
  notifications: NotificationCapability;
  telemetry: TelemetryCapability;
  workspace: WorkspaceCapability;
  appearance: AppearanceCapability;
}

export interface ApplicationProps {
  instanceId: string;
  basePath: string;
  capabilities: PlatformCapabilities;
}

export interface ApplicationManifest {
  id: string;
  displayName: string;
  contractVersion: string;
  appearanceContractVersion: string;
}

export interface FederatedApplicationModule {
  manifest: ApplicationManifest;
  Application: ComponentType<ApplicationProps>;
}

export function assertCompatibleApplicationModule(
  candidate: unknown,
  registryEntry: ApplicationRegistryEntry,
): FederatedApplicationModule {
  if (!candidate || typeof candidate !== 'object') {
    throw new Error('Federated application module is missing');
  }

  const module = candidate as Partial<FederatedApplicationModule>;
  if (typeof module.Application !== 'function') {
    throw new Error('Federated application module must expose an Application component');
  }
  if (!module.manifest || typeof module.manifest !== 'object') {
    throw new Error('Federated application module must expose a manifest');
  }
  if (module.manifest.id !== registryEntry.id) {
    throw new Error(
      `Federated application identity mismatch: expected ${registryEntry.id}, received ${module.manifest.id}`,
    );
  }
  if (
    module.manifest.contractVersion !== APPLICATION_CONTRACT_VERSION ||
    registryEntry.contractVersion !== APPLICATION_CONTRACT_VERSION
  ) {
    throw new Error(
      `Unsupported application contract version: ${module.manifest.contractVersion ?? registryEntry.contractVersion}`,
    );
  }
  if (
    module.manifest.appearanceContractVersion !== APPEARANCE_CONTRACT_VERSION ||
    registryEntry.appearanceContractVersion !== APPEARANCE_CONTRACT_VERSION
  ) {
    throw new Error(
      `Unsupported appearance contract version: ${module.manifest.appearanceContractVersion ?? registryEntry.appearanceContractVersion}`,
    );
  }
  return module as FederatedApplicationModule;
}

export function findApplicationForPath(
  applications: ApplicationRegistryEntry[],
  path: string,
): ApplicationRegistryEntry | undefined {
  return applications.find(
    ({ basePath }) => path === basePath || path.startsWith(`${basePath}/`),
  );
}
