import { applicationRegistrySchema, type ApplicationRegistry } from '@fm/platform-contracts';

type RegistryFetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Pick<Response, 'ok' | 'status' | 'json'>>;

export async function loadApplicationRegistry(
  fetcher: RegistryFetcher = fetch,
): Promise<ApplicationRegistry> {
  const response = await fetcher('/registry.json', { cache: 'no-store' });
  if (!response.ok)
    throw new Error(`Application registry request failed with status ${response.status}`);
  const payload: unknown = await response.json();
  if (payload && typeof payload === 'object' && 'revisionUrl' in payload) {
    const { revisionId, revisionUrl } = payload as {
      revisionId?: unknown;
      revisionUrl?: unknown;
    };
    if (
      typeof revisionId !== 'string' ||
      typeof revisionUrl !== 'string' ||
      !/^\/registries\/revisions\/[a-z0-9.-]+\.json$/.test(revisionUrl)
    ) {
      throw new Error('Application registry pointer is invalid');
    }
    const revisionResponse = await fetcher(revisionUrl, { cache: 'force-cache' });
    if (!revisionResponse.ok) {
      throw new Error(
        `Application registry revision request failed with status ${revisionResponse.status}`,
      );
    }
    const revision: unknown = await revisionResponse.json();
    if (
      !revision ||
      typeof revision !== 'object' ||
      (revision as { revisionId?: unknown }).revisionId !== revisionId
    ) {
      throw new Error('Application registry revision does not match its pointer');
    }
    return applicationRegistrySchema.parse((revision as { registry?: unknown }).registry);
  }
  return applicationRegistrySchema.parse(payload);
}
