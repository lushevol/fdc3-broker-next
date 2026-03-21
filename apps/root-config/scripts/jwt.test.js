const { generateJWT } = require('./jwt');

describe('generateJWT', () => {
  it('generates a backend-compatible RS512 token payload for local auth flows', () => {
    const now = Math.floor(Date.now() / 1000);
    const token = generateJWT({
      sub: '1481696',
      iat: now,
      auth_time: now,
      exp: now + 3600,
      max_age: now + 3600,
      id: 'LOCAL-SESSION-ID',
      oud: '{"uid":"1481696"}',
    });

    const [encodedHeader, encodedPayload] = token.split('.');
    const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf8'));
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));

    expect(header.alg).toBe('RS512');
    expect(payload.iss).toBe('single-ui-bff');
    expect(payload.jti).toBe('single-ui-bff-id');
    expect(payload.auth_time).toBe(now);
    expect(payload.max_age).toBe(now + 3600);
  });
});
