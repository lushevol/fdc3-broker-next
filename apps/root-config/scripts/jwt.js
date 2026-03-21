const crypto = require('node:crypto');

const LOCAL_BACKEND_PRIVATE_KEY_DER_BASE64 = [
  'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHn+TKWeKzANZP',
  'aYAywxFuXX5S7MpDVfiSswKTYtKw13kgY8l83WzqFHNY3Wa2tDI955DOOeYR/FzC',
  'jlUwicY9z6QRRjcYXZ8Mb8J5iJ+xetBXdHky2Yg1uHxxv4Z2P2B6OLwydyLk5ne5',
  'LM3ov5WGoGES8YAnT7h33zhqmNrF08CScdeFVlXevyQegq7P1/zJV+PPunq/y4Gl',
  'oeIg/gwDABJe/XQRlemj5FAQynAXMfMF4G9pJhKLlKHOKq6V/cibV8YEU3wloHDB',
  'erNV07mxiKbP3uG4z8F6kTfSmp7hgOl3yiiU+TfKEUjaSpCSpPZxIzO1+2mzQpMn',
  'hQnc5WMXAgMBAAECggEAc7qkvxMBNFll5T/6jHM+ZcdZ9uVEFWl/5DxXX+7IyrEA',
  'jeCL7RHJlKMqg/hHFeC9x9m5v3UdhovRkxFFHhChlzALo+AbDMsp6+HW0vJ78j6L',
  'Dkh+AxbNuqcrrh4k6+SuH+1IXdFnr2BVREtPTIHVQ+kynfLYIvI6tXP5lwLqwgiL',
  'hkFxPvn+e9NXYuqSe1ZbEM803DUkjX4AreSIZ69gd2l4y78zMnL9b1wedxaMC9q1',
  '+kI8+ZCYzbQBUVY60xSu1zTKp3xV9yZjHxBbRT/HW69N3Q1tJOHDzmkYmwJAv5h5',
  'hrnvnNMfY6uECaljUWNrB91WTWupC0ZnawHUtb+RsQKBgQD6Ek9j9smPUKZr6HO6',
  'CvSs4lpt0RZgqDeK+6RawnFnJkJAGwmfA5Qi19RIqFvEQWS0XjL64aTEakbXDsS8',
  '0jYe0L4CQllHsHt9q5QW7OS57Fmgp/sPFbV+W+bStOepsWgSyaqfY/OLgfMHEy5O',
  'f6Uh/gjjME42Z2wUSm0JwnJOIwKBgQDMW2uB0yyCDwjIcqHp9kxQHC1iFNXuK48S',
  'Foej78QmXAjQFm5jbdUJooGXPZlvkZGPvvLmthEhS0aMcJ8l67m+Rn/ut3yL8i8b',
  'xdFNr9YUByuXO+gDMDqIOPpQLIREBbv7kaAerG2+x1ZU7rTIwn1ofHq/DyTBMLOI',
  '3d3vXoOUfQKBgGVy5ig8pvpwEoO2UrSH20kDrwHcEAL4W0gT3FJBjbX17GyLS3Tq',
  'A7+65VDwlAHjMZKGoJHs1mYkY0a9pAyiDvijYGIUPpn5u6942uQOCKBwhM/LNeuh',
  't/ZiHBsg7taFtR3iGEj/SH8xIcGeA2wvFnPa1gosv54MiOkWZHPQIYUXAoGBAIPk',
  'tRxTaTR/85E7uxi/qD1EEl5tSC2x22M3O1ApXZXMbLuw3oo5xvey9KTiUvdZInN+',
  'MFOLSr8MUHov7eeRno4Z/lPaBP5lztXD9PSI+khu4El5lqMIK57j91prgOpOMSeK',
  's6dYbnRlP2kNr4yrSjl3rdlGMtilUBqT57uoapAZAoGBAIFSWPFd5u6kWuxmwZZU',
  'vIq/MK40uUoJ6AH03MgDI8NtqAgiEnyLwABu7ZQ9n9JuyJyNgm2kLwXOrc5ZD4jG',
  'a0QsTWB4DR47v8AJxSNFI+zxA67rSgIrLm9SWfa8+hQK6gthZ7uTO9/tT8UnQ2Th',
  'fskgrmLH/JOQ+yx3p0SwQC2o',
].join('');

const LOCAL_BACKEND_PRIVATE_KEY = crypto.createPrivateKey({
  key: Buffer.from(LOCAL_BACKEND_PRIVATE_KEY_DER_BASE64, 'base64'),
  format: 'der',
  type: 'pkcs8',
});

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function generateJWT(payload = {}) {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiresAt = payload.exp ?? nowInSeconds + 60 * 60;
  const sessionId = payload.id ?? crypto.randomBytes(16).toString('hex').toUpperCase();
  const header = { alg: 'RS512', typ: 'JWT' };
  const completePayload = {
    iss: 'single-ui-bff',
    jti: 'single-ui-bff-id',
    sub: '1481696',
    iat: nowInSeconds,
    auth_time: payload.auth_time ?? payload.iat ?? nowInSeconds,
    exp: expiresAt,
    max_age: payload.max_age ?? expiresAt,
    id: sessionId,
    ...payload,
  };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(completePayload));
  const signature = crypto
    .sign('RSA-SHA512', Buffer.from(`${encodedHeader}.${encodedPayload}`), LOCAL_BACKEND_PRIVATE_KEY)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

module.exports = {
  base64url,
  generateJWT,
};
