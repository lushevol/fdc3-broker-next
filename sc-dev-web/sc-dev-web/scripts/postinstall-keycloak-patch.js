// This script patches keycloak-js after every install to support encrypted tokens.
// It is referenced by the postinstall script in package.json.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keycloakLib = path.resolve(__dirname, '../node_modules/keycloak-js/lib/keycloak.js');
const patchMarkers = [
  'START: TOKEN_ENCRYPTION 1',
  'START: TOKEN_ENCRYPTION 2',
  'START: TOKEN_ENCRYPTION 3',
  'START: TOKEN_ENCRYPTION 4',
  'START: TOKEN_ENCRYPTION 5',
  'START: TOKEN_ENCRYPTION 6',
  'START: TOKEN_ENCRYPTION 7',
];

const hasAllMarkers = source => patchMarkers.every(marker => source.includes(marker));

const patchEntries = [
  {
    name: 'TOKEN_ENCRYPTION 1',
    pattern: /kc.tokenParsed[\s]+=[\s]+decodeToken\(token\);/,
    replacement: `// START: TOKEN_ENCRYPTION 1
            try {
                const parsedToken = decodeToken(token);
                kc.tokenParsed = parsedToken;
            } catch (e) {
                kc.tokenParsed = {
                    sid: kc.idTokenParsed.sid,
                    sub: kc.idTokenParsed.sub,
                    iat: kc.idTokenParsed.iat,
                    exp: kc.idTokenParsed.exp,
                };
            }
            // END: TOKEN_ENCRYPTION 1`,
  },
  {
    name: 'TOKEN_ENCRYPTION 2',
    pattern: /kc.refreshTokenParsed[\s]+=[\s]+decodeToken\(refreshToken\);/,
    replacement: `// START: TOKEN_ENCRYPTION 2
            try {
                const parsedRefreshToken = decodeToken(refreshToken);
                kc.refreshTokenParsed = parsedRefreshToken;
            } catch (e) {
                kc.refreshTokenParsed = {
                    exp: Math.round((new Date().getTime() + refreshTokenExpiry * 1000) / 1000)
                };
            }
            // END: TOKEN_ENCRYPTION 2`,
  },
  {
    name: 'TOKEN_ENCRYPTION 3',
    pattern: /authSuccess\(tokenResponse\['access_token'\],[\s]+tokenResponse\['refresh_token'\],[\s]+tokenResponse\['id_token'\],[\s]+kc.flow[\s]+===[\s]+'standard'\);/,
    replacement: `// START: TOKEN_ENCRYPTION 3
                        authSuccess(tokenResponse['access_token'], tokenResponse['refresh_token'], tokenResponse['id_token'], kc.flow === 'standard', tokenResponse['expires_in'], tokenResponse['refresh_expires_in']);
                        // END: TOKEN_ENCRYPTION 3`,
  },
  {
    name: 'TOKEN_ENCRYPTION 4',
    pattern: /function[\s]+authSuccess\(accessToken,[\s]+refreshToken,[\s]+idToken,[\s]+fulfillPromise\)[\s]+\{/,
    replacement: `// START: TOKEN_ENCRYPTION 4
        function authSuccess(accessToken, refreshToken, idToken, fulfillPromise, accessTokenExpiry, refreshTokenExpiry) {
        // END: TOKEN_ENCRYPTION 4`,
  },
  {
    name: 'TOKEN_ENCRYPTION 5',
    pattern: /setToken\(accessToken,[\s]+refreshToken,[\s]+idToken,[\s]+timeLocal\);/,
    replacement: `// START: TOKEN_ENCRYPTION 5
            setToken(accessToken, refreshToken, idToken, timeLocal, accessTokenExpiry, refreshTokenExpiry);
            // END: TOKEN_ENCRYPTION 5`,
  },
  {
    name: 'TOKEN_ENCRYPTION 6',
    pattern: /function[\s]+setToken\(token,[\s]+refreshToken,[\s]+idToken,[\s]+timeLocal\)[\s]+\{/,
    replacement: `// START: TOKEN_ENCRYPTION 6
    function setToken(token, refreshToken, idToken, timeLocal, accessTokenExpiry, refreshTokenExpiry) {
    // END: TOKEN_ENCRYPTION 6`,
  },
  {
    name: 'TOKEN_ENCRYPTION 7',
    pattern: /setToken\(tokenResponse\['access_token'\],[\s]+tokenResponse\['refresh_token'\],[\s]+tokenResponse\['id_token'\],[\s]+timeLocal\);/,
    replacement: `// START: TOKEN_ENCRYPTION 7
                                setToken(tokenResponse['access_token'], tokenResponse['refresh_token'], tokenResponse['id_token'], timeLocal, tokenResponse['expires_in'], tokenResponse['refresh_expires_in']);
                                // END: TOKEN_ENCRYPTION 7`,
  },
];

const applyPatch = source => {
  let updated = source;
  for (const entry of patchEntries) {
    if (!entry.pattern.test(updated)) {
      throw new Error(`Patch pattern not found for ${entry.name}. keycloak-js may have changed.`);
    }
    updated = updated.replace(entry.pattern, entry.replacement);
  }
  return updated;
};

try {
  if (!fs.existsSync(keycloakLib)) {
    process.exit(0);
  }

  const originalSource = fs.readFileSync(keycloakLib, 'utf8');
  if (hasAllMarkers(originalSource)) {
    process.exit(0);
  }

  const patchedSource = applyPatch(originalSource);
  fs.writeFileSync(keycloakLib, patchedSource, 'utf8');

  const updatedSource = fs.readFileSync(keycloakLib, 'utf8');
  if (!hasAllMarkers(updatedSource)) {
    console.error('[postinstall] keycloak-js patch markers not found after patching.');
    process.exit(1);
  }
} catch (e) {
  console.error('[postinstall] Failed to patch keycloak-js:', e);
  process.exit(1);
}
