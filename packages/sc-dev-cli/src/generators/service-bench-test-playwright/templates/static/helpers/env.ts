/**
 * Environment configuration helper.
 *
 * Priority order for base URL:
 *   1. E2E_BASE_URL  — explicit URL override
 *   2. E2E_ENV       — named environment key (see ENV_URLS below)
 *   3. default       — local → http://localhost:11001
 *
 * SSO testing (pass via E2E_BASE_URL):
 *   SIT:      https://servicebench-sit-sso.global.standardchartered.com
 *   UAT:      https://servicebench-uat-sso.global.standardchartered.com
 *   QA:       https://servicebench-qa-sso.global.standardchartered.com
 *   GDCW UAT: http://servicebench-ark-uat-sso.global.standardchartered.com
 */

export type TargetEnv =
  | 'local'
  // GDCE (Catalyst) Non-Prod
  | 'dev' | 'sit' | 'sit-stg' | 'uat' | 'uat-stg' | 'qa' | 'qa-stg' | 'pt'
  // GDCE Production
  | 'prod' | 'prod-stg' | 'prod-sg' | 'prod-hk'
  // GDCW (ARK)
  | 'gdcw-uat' | 'gdcw-prod' | 'gdcw-ark2' | 'gdcw-wat'
  // CDC (China)
  | 'cdc-uat' | 'cdc-prod';

export const ENV_URLS: Record<TargetEnv, string> = {
  local:       'http://localhost:11001',
  // GDCE Non-Prod
  dev:         'https://servicebench-dev-stg.55313.app.standardchartered.com',
  sit:         'https://servicebench-sit.global.standardchartered.com',
  'sit-stg':   'https://servicebench-sit-stg.55313.app.standardchartered.com',
  uat:         'https://servicebench-uat.global.standardchartered.com',
  'uat-stg':   'https://servicebench-uat-stg.55313.app.standardchartered.com',
  qa:          'https://servicebench-qa.global.standardchartered.com',
  'qa-stg':    'https://servicebench-qa-stg.55313.app.standardchartered.com',
  pt:          'https://servicebench-pt.global.standardchartered.com',
  // GDCE Production
  prod:        'https://servicebench.gdc.standardchartered.com',
  'prod-stg':  'https://servicebench.55313.app.standardchartered.com',
  'prod-sg':   'https://servicebench.55313.sg.app.standardchartered.com',
  'prod-hk':   'https://servicebench.55313.hk.app.standardchartered.com',
  // GDCW (ARK)
  'gdcw-uat':  'https://servicebench-ark-uat.global.standardchartered.com',
  'gdcw-prod': 'https://servicebench-uk.global.standardchartered.com',
  'gdcw-ark2': 'https://servicebench-ark2.global.standardchartered.com',
  'gdcw-wat':  'https://servicebench-wat.global.standardchartered.com',
  // CDC (China)
  'cdc-uat':   'https://servicebench-sct-uat.global.standardchartered.com',
  'cdc-prod':  'https://servicebench-cn.global.standardchartered.com',
};

const VALID_ENVS = Object.keys(ENV_URLS) as TargetEnv[];

export const env = {
  targetEnv(): TargetEnv {
    const raw = (process.env['E2E_ENV'] ?? 'local').toLowerCase();
    if (!VALID_ENVS.includes(raw as TargetEnv)) {
      throw new Error(
        `Unknown E2E_ENV="${raw}".\nValid values: ${VALID_ENVS.join(', ')}`,
      );
    }
    return raw as TargetEnv;
  },

  baseUrl(): string {
    if (process.env['E2E_BASE_URL']) return process.env['E2E_BASE_URL'];
    return ENV_URLS[this.targetEnv()];
  },

  isLocal(): boolean {
    return this.targetEnv() === 'local';
  },

  isProduction(): boolean {
    const prod: TargetEnv[] = ['prod', 'prod-stg', 'prod-sg', 'prod-hk', 'gdcw-prod', 'cdc-prod'];
    return prod.includes(this.targetEnv());
  },

  /**
   * Validates CI credentials are present.
   * Call this inside tests/auth/setup.ts before performing SC-IDP login.
   *
   * ADO pipeline injects Variables as lowercase names (test_account / test_pwd).
   * This helper accepts both UPPER_CASE (local export) and lower_case (ADO).
   */
  requireCIVars(): { account: string; pwd: string } {
    const account = process.env['TEST_ACCOUNT'] ?? process.env['test_account'];
    const pwd     = process.env['TEST_PWD']     ?? process.env['test_pwd'];
    if (!account || !pwd) {
      throw new Error(
        'TEST_ACCOUNT and TEST_PWD are required for non-local environments.\n\n' +
        'CI  : set as secret Variables on the ADO pipeline (test_account / test_pwd)\n' +
        'Local: export TEST_ACCOUNT=<bank-id> TEST_PWD=<password>',
      );
    }
    return { account, pwd };
  },
};
