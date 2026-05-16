import type { ProfileLookupArgs, ProfileLookupResult } from './types';

export async function executeProfileLookup(input: unknown): Promise<ProfileLookupResult> {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const { userId } = input as ProfileLookupArgs;
  return {
    userId,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };
}
