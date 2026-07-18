export type AuthorizationLimitStatus =
  | 'CONFIRMED'
  | 'ADD_PENDING'
  | 'EDIT_PENDING'
  | 'DELETE_PENDING';

export interface AuthorizationLimitRecord {
  readonly limitationId: string;
  readonly profile: string;
  readonly currency: 'USD';
  readonly limitation: number;
  readonly status: AuthorizationLimitStatus;
  readonly version: number;
  readonly createdAt: string;
  readonly createdBy: string;
  readonly updatedAt: string;
  readonly updatedBy: string;
}

export interface AuthorizationLimitsRepository {
  list(): Promise<readonly AuthorizationLimitRecord[]>;
}

export const authorizationLimitFixtures: readonly AuthorizationLimitRecord[] = [
  ['LIM-1001', 'GLOBAL-MAKER', 5_000_000, 'CONFIRMED'],
  ['LIM-1002', 'GLOBAL-CHECKER', 10_000_000, 'CONFIRMED'],
  ['LIM-1003', 'TREASURY-ASIA', 2_500_000, 'ADD_PENDING'],
  ['LIM-1004', 'TREASURY-EMEA', 7_500_000, 'EDIT_PENDING'],
  ['LIM-1005', 'OPERATIONS-US', 1_000_000, 'CONFIRMED'],
  ['LIM-1006', 'OPERATIONS-EU', 1_500_000, 'DELETE_PENDING'],
  ['LIM-1007', 'SETTLEMENT-ASIA', 3_000_000, 'CONFIRMED'],
  ['LIM-1008', 'SETTLEMENT-EMEA', 3_500_000, 'CONFIRMED'],
  ['LIM-1009', 'CONTROL-L1', 750_000, 'CONFIRMED'],
  ['LIM-1010', 'CONTROL-L2', 1_250_000, 'ADD_PENDING'],
  ['LIM-1011', 'LIQUIDITY-US', 4_250_000, 'CONFIRMED'],
  ['LIM-1012', 'LIQUIDITY-EU', 4_500_000, 'CONFIRMED'],
].map(([limitationId, profile, limitation, status], index) => ({
  limitationId: String(limitationId),
  profile: String(profile),
  currency: 'USD' as const,
  limitation: Number(limitation),
  status: status as AuthorizationLimitStatus,
  version: 1,
  createdAt: `2026-06-${String(index + 1).padStart(2, '0')}T08:00:00Z`,
  createdBy: 'migration-fixture',
  updatedAt: `2026-07-${String(index + 1).padStart(2, '0')}T09:30:00Z`,
  updatedBy: 'cashflow-operations',
}));

export const authorizationLimitsRepository: AuthorizationLimitsRepository = {
  async list() {
    return authorizationLimitFixtures.map((record) => Object.freeze({ ...record }));
  },
};

export function formatUsdLimit(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(value);
}
