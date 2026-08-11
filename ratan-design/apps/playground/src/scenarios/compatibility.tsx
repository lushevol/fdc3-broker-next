import { version as reactVersion } from 'react';

export function supportsReactVersion(version: string) {
  const [majorText, minorText] = version.split('.');
  const major = Number(majorText);
  const minor = Number(minorText);
  return (major === 18 && minor >= 2) || major === 19;
}

export function CompatibilityScenario() {
  return (
    <section aria-labelledby="compatibility-heading">
      <h2 id="compatibility-heading">Packed-package React compatibility</h2>
      <p data-testid="react-runtime">Runtime: React {reactVersion}</p>
      <p role="status">{supportsReactVersion(reactVersion) ? 'Supported runtime' : 'Unsupported runtime'}</p>
      <ul><li>React 18.2 cohort</li><li>React 19 cohort</li></ul>
    </section>
  );
}
