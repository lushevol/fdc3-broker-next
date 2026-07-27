import type { ComponentType } from 'react';
import { z } from 'zod';

export const APPLICATION_CONTRACT_VERSION = '1.0.0' as const;
export const APPEARANCE_CONTRACT_VERSION = '1.0.0' as const;
export const IDENTITY_CONTRACT_VERSION = '1.0.0' as const;

export const appearanceSnapshotSchema = z.object({
  scheme: z.enum(['light', 'dark']),
  preference: z.enum(['light', 'dark', 'system']),
  density: z.enum(['compact', 'comfortable']),
  locale: z.string().min(1),
  direction: z.enum(['ltr', 'rtl']),
  contractVersion: z.literal(APPEARANCE_CONTRACT_VERSION),
}).strict();

const identityPermissionSchema = z.string().trim().min(1);

export const identitySnapshotSchema = z.discriminatedUnion('state', [
  z.object({
    state: z.literal('anonymous'),
    contractVersion: z.literal(IDENTITY_CONTRACT_VERSION),
  }).strict(),
  z.object({
    state: z.literal('authenticated'),
    userId: z.string().trim().min(1),
    permissions: z.array(identityPermissionSchema).superRefine((permissions, context) => {
      if (new Set(permissions).size !== permissions.length) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: 'Permissions must be unique' });
      }
    }),
    contractVersion: z.literal(IDENTITY_CONTRACT_VERSION),
  }).strict(),
]);

export const platformCapabilitySchema = z.enum([
  'navigation',
  'notifications',
  'telemetry',
  'workspace',
  'appearance',
  'identity',
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
  identityContractVersion: z.string().min(1).optional(),
  capabilities: z.array(platformCapabilitySchema),
}).strict();

export const applicationRegistrySchema = z
  .object({ applications: z.array(applicationRegistryEntrySchema).min(1) })
  .strict()
  .superRefine(({ applications }, context) => {
    const ids = new Set<string>();
    const paths = new Set<string>();
    for (const application of applications) {
      if (ids.has(application.id)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate application id: ${application.id}` });
      }
      if (paths.has(application.basePath)) {
        context.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate base path: ${application.basePath}` });
      }
      ids.add(application.id);
      paths.add(application.basePath);
    }
  });

export type PlatformCapabilityName = z.infer<typeof platformCapabilitySchema>;
export type AppearanceSnapshot = Readonly<z.infer<typeof appearanceSnapshotSchema>>;
type ParsedIdentitySnapshot = z.infer<typeof identitySnapshotSchema>;
export type IdentitySnapshot =
  | Readonly<Extract<ParsedIdentitySnapshot, { state: 'anonymous' }>>
  | Readonly<
      Omit<Extract<ParsedIdentitySnapshot, { state: 'authenticated' }>, 'permissions'>
      & { readonly permissions: readonly string[] }
    >;
export type ApplicationRegistryEntry = z.infer<typeof applicationRegistryEntrySchema>;
export type ApplicationRegistry = z.infer<typeof applicationRegistrySchema>;

export interface NavigationCapability {
  navigate(path: string): void;
}

export interface NotificationCapability {
  show(message: string): void;
}

export interface TelemetryCapability {
  track(event: string, data?: Readonly<Record<string, unknown>>): void;
}

export interface WorkspaceCapability {
  closeCurrent(): void;
}

export interface AppearanceCapability {
  getSnapshot(): AppearanceSnapshot;
  subscribe(listener: (snapshot: AppearanceSnapshot) => void): () => void;
}

export interface IdentityCapability {
  getSnapshot(): IdentitySnapshot;
  subscribe(listener: (snapshot: IdentitySnapshot) => void): () => void;
}

export interface PlatformCapabilities {
  readonly navigation: NavigationCapability;
  readonly notifications: NotificationCapability;
  readonly telemetry: TelemetryCapability;
  readonly workspace: WorkspaceCapability;
  readonly appearance: AppearanceCapability;
  readonly identity?: IdentityCapability;
}

export interface ApplicationProps {
  readonly instanceId: string;
  readonly basePath: string;
  readonly capabilities: PlatformCapabilities;
}

export interface ApplicationManifest {
  readonly id: string;
  readonly displayName: string;
  readonly contractVersion: string;
  readonly appearanceContractVersion: string;
  readonly identityContractVersion?: string;
  readonly designSystemVersion?: string;
}

export interface FederatedApplicationModule {
  readonly manifest: ApplicationManifest;
  readonly Application: ComponentType<ApplicationProps>;
  readonly mount?: (input: ApplicationProps & { readonly root: HTMLElement }) => void | Promise<void>;
  readonly unmount?: (instanceId: string) => void | Promise<void>;
}

export type FederatedCompatibilityCode =
  | 'MODULE_MISSING'
  | 'APPLICATION_EXPORT_MISSING'
  | 'MANIFEST_MISSING'
  | 'APPLICATION_ID_MISMATCH'
  | 'APPLICATION_CONTRACT_UNSUPPORTED'
  | 'APPEARANCE_CONTRACT_UNSUPPORTED'
  | 'IDENTITY_CONTRACT_UNSUPPORTED';

export class FederatedCompatibilityError extends Error {
  readonly name = 'FederatedCompatibilityError';

  constructor(
    readonly code: FederatedCompatibilityCode,
    message: string,
    readonly details: Readonly<Record<string, string | undefined>> = {},
  ) {
    super(message);
  }
}

function compatibilityError(
  code: FederatedCompatibilityCode,
  message: string,
  details?: Readonly<Record<string, string | undefined>>,
): never {
  throw new FederatedCompatibilityError(code, message, details);
}

export function assertCompatibleApplicationModule(
  candidate: unknown,
  registryEntry: ApplicationRegistryEntry,
): FederatedApplicationModule {
  if (!candidate || typeof candidate !== 'object') {
    return compatibilityError('MODULE_MISSING', 'Federated application module is missing');
  }

  const applicationModule = candidate as Partial<FederatedApplicationModule>;
  if (typeof applicationModule.Application !== 'function') {
    return compatibilityError(
      'APPLICATION_EXPORT_MISSING',
      'Federated application module must expose an Application component',
    );
  }
  if (!applicationModule.manifest || typeof applicationModule.manifest !== 'object') {
    return compatibilityError('MANIFEST_MISSING', 'Federated application module must expose a manifest');
  }

  const manifest = applicationModule.manifest;
  if (manifest.id !== registryEntry.id) {
    return compatibilityError(
      'APPLICATION_ID_MISMATCH',
      `Federated application identity mismatch: expected ${registryEntry.id}, received ${manifest.id}`,
      { expected: registryEntry.id, received: manifest.id },
    );
  }
  if (
    manifest.contractVersion !== APPLICATION_CONTRACT_VERSION
    || registryEntry.contractVersion !== APPLICATION_CONTRACT_VERSION
  ) {
    return compatibilityError(
      'APPLICATION_CONTRACT_UNSUPPORTED',
      `Unsupported application contract version: ${manifest.contractVersion ?? registryEntry.contractVersion}`,
      {
        supported: APPLICATION_CONTRACT_VERSION,
        manifest: manifest.contractVersion,
        registry: registryEntry.contractVersion,
      },
    );
  }
  if (
    manifest.appearanceContractVersion !== APPEARANCE_CONTRACT_VERSION
    || registryEntry.appearanceContractVersion !== APPEARANCE_CONTRACT_VERSION
  ) {
    return compatibilityError(
      'APPEARANCE_CONTRACT_UNSUPPORTED',
      `Unsupported appearance contract version: ${manifest.appearanceContractVersion ?? registryEntry.appearanceContractVersion}`,
      {
        supported: APPEARANCE_CONTRACT_VERSION,
        manifest: manifest.appearanceContractVersion,
        registry: registryEntry.appearanceContractVersion,
      },
    );
  }
  if (
    registryEntry.capabilities.includes('identity')
    && (
      manifest.identityContractVersion !== IDENTITY_CONTRACT_VERSION
      || registryEntry.identityContractVersion !== IDENTITY_CONTRACT_VERSION
    )
  ) {
    return compatibilityError(
      'IDENTITY_CONTRACT_UNSUPPORTED',
      `Unsupported identity contract version: ${manifest.identityContractVersion ?? registryEntry.identityContractVersion ?? 'missing'}`,
      {
        supported: IDENTITY_CONTRACT_VERSION,
        manifest: manifest.identityContractVersion,
        registry: registryEntry.identityContractVersion,
      },
    );
  }
  return applicationModule as FederatedApplicationModule;
}

export function findApplicationForPath(
  applications: readonly ApplicationRegistryEntry[],
  path: string,
): ApplicationRegistryEntry | undefined {
  return applications.find(({ basePath }) => path === basePath || path.startsWith(`${basePath}/`));
}
