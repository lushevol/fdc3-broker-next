import { applicationRegistrySchema, type ApplicationRegistry } from '@fm/platform-contracts';

type RegistryFetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Pick<Response, 'ok' | 'status' | 'json'>>;

export async function loadApplicationRegistry(fetcher: RegistryFetcher = fetch): Promise<ApplicationRegistry> {
  const response = await fetcher('/registry.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Application registry request failed with status ${response.status}`);
  return applicationRegistrySchema.parse(await response.json());
}
