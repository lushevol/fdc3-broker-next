import type { Entity, User } from '../../web/mfe-base-origin/src/hooks/model/root';
import type { PresentedTiles } from '../../web/mfe-base-origin/src/new-styles/drawer-presentation';
import type { Workspace } from '../../web/mfe-base-origin/src/hooks/model/workspaces';

export type PrototypeTheme = 'dark' | 'light';
export type PrototypeState =
  | 'login'
  | 'empty'
  | 'workspace'
  | 'avatar'
  | 'profile'
  | 'profile-role'
  | 'profile-actions'
  | 'drawer';
export interface EvidenceRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface PrototypeReference {
  frame: string;
  file: string;
  theme: PrototypeTheme;
  state: PrototypeState;
  owner: 'Login' | 'Home' | 'Avatar' | 'Profile' | 'Drawer';
  region: EvidenceRegion;
}

export const referenceViewport = { width: 1512, height: 982 };
export const prototypeViewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'compact-desktop', width: 1280, height: 900 },
  { name: 'short-desktop', width: 1280, height: 600 },
  { name: 'wide-desktop', width: 1920, height: 1080 },
] as const;
export const prototypeClock = {
  shell: '2026-09-21T06:45:00Z',
  profile: '2026-09-21T01:06:00Z',
};

const shellRegion = { x: 0, y: 0, width: 1512, height: 94 };
const drawerRegion = { x: 617, y: 98, width: 895, height: 884 };
const avatarRegion = { x: 952, y: 63, width: 548, height: 240 };
const profileRegion = { x: 356, y: 203, width: 800, height: 576 };
const expandedProfileRegion = { x: 356, y: 91, width: 800, height: 800 };

export const prototypeReferences: readonly PrototypeReference[] = [
  {
    frame: '04',
    file: 'Frame-04-Home-Page-Light.png',
    theme: 'dark',
    state: 'empty',
    owner: 'Home',
    region: { x: 0, y: 94, width: 1512, height: 888 },
  },
  {
    frame: '05',
    file: 'Frame-05-Cashflow-Blotter-Page-Dark.png',
    theme: 'dark',
    state: 'workspace',
    owner: 'Home',
    region: shellRegion,
  },
  {
    frame: '06',
    file: 'Frame-06-Cashflow-Blotter-Page-Dark-2.png',
    theme: 'dark',
    state: 'drawer',
    owner: 'Drawer',
    region: drawerRegion,
  },
  {
    frame: '07',
    file: 'Frame-07-Home-Page-Light-2.png',
    theme: 'light',
    state: 'avatar',
    owner: 'Avatar',
    region: avatarRegion,
  },
  {
    frame: '08',
    file: 'Frame-08-Home-Page-Light-3.png',
    theme: 'light',
    state: 'profile',
    owner: 'Profile',
    region: profileRegion,
  },
  {
    frame: '09',
    file: 'Frame-09-Home-Page-Light-4.png',
    theme: 'light',
    state: 'profile-role',
    owner: 'Profile',
    region: expandedProfileRegion,
  },
  {
    frame: '10',
    file: 'Frame-10-Home-Page-Light-5.png',
    theme: 'light',
    state: 'profile-actions',
    owner: 'Profile',
    region: expandedProfileRegion,
  },
  {
    frame: '11',
    file: 'Frame-11-Login-Page.png',
    theme: 'light',
    state: 'login',
    owner: 'Login',
    region: { x: 0, y: 0, ...referenceViewport },
  },
  {
    frame: '13',
    file: 'Frame-13-Home-Page-Dark.png',
    theme: 'dark',
    state: 'avatar',
    owner: 'Avatar',
    region: avatarRegion,
  },
  {
    frame: '14',
    file: 'Frame-14-Home-Page-Dark-2.png',
    theme: 'dark',
    state: 'profile',
    owner: 'Profile',
    region: profileRegion,
  },
  {
    frame: '15',
    file: 'Frame-15-Home-Page-Dark-4.png',
    theme: 'dark',
    state: 'profile-role',
    owner: 'Profile',
    region: expandedProfileRegion,
  },
  {
    frame: '16',
    file: 'Frame-16-Home-Page-Dark-5.png',
    theme: 'dark',
    state: 'profile-actions',
    owner: 'Profile',
    region: expandedProfileRegion,
  },
  {
    frame: '17',
    file: 'Frame-17-Home-Page-2-Dark.png',
    theme: 'dark',
    state: 'drawer',
    owner: 'Drawer',
    region: drawerRegion,
  },
  {
    frame: '18',
    file: 'Frame-18-Home-Page-2-Light.png',
    theme: 'light',
    state: 'drawer',
    owner: 'Drawer',
    region: drawerRegion,
  },
];

const authTime = Date.parse('2026-09-21T01:05:06Z') / 1000;
const subjectActions = [
  'F_Exception_Additional_Info_Update',
  'F_Custom_Query_Builder',
  'F_Custom_View_Builder_Private',
  'F_Custom_View_Builder_Public',
  'F_Export_Data',
  'F_Manually_Close_Exception',
  'Access_FMO_POST_TRADE_PORTAL',
];
export const expandedRole = 'X_RATANONE';
export const expandedSubject = 'RATAN_FM_COO_EXCEPTION';

function buildEntities(stress: boolean): Entity[] {
  const subjects = [
    expandedSubject,
    'RATAN_TRADE_BLOTTER',
    'RATAN_RULE_ENGINE',
    'RATAN_FM_COO_RULE',
    'RATAN_STRATEGIC_CASHFLOW_BLOTTER',
  ].map((name, index) => ({
    id: index + 1,
    name,
    actions: (index === 0 ? subjectActions : ['UI_Read_Access', 'F_Export_Data']).map(
      (action, actionIndex) => ({
        name: action,
        id: index * 100 + actionIndex + 1,
        entitlementId: actionIndex + 1,
      }),
    ),
  }));
  const entities: Entity[] = [
    {
      id: 1,
      applicationName: 'RATAN',
      name: 'FMO PORTAL ADMIN',
      roleId: 1,
      roleName: 'RATAN_PROD',
      subjects: [],
    },
    {
      id: 2,
      applicationName: 'RATAN',
      name: expandedRole,
      roleId: 2,
      roleName: 'FMO_COO_SUP',
      subjects,
    },
    {
      id: 3,
      applicationName: 'FLOW_ZERO',
      name: 'FLOW_ZERO',
      roleId: 3,
      roleName: 'QA',
      subjects: [],
    },
    {
      id: 4,
      applicationName: '55508-FMCES',
      name: 'FMCES',
      roleId: 4,
      roleName: 'FMCES_ADMIN',
      subjects: [],
    },
  ];
  if (stress)
    entities.push({
      id: 5,
      applicationName: 'RATAN',
      name: 'RATAN_DATA_ENTITLEMENT',
      roleId: 5,
      roleName: 'CROSS_BORDER_SETTLEMENT_READ_ONLY',
      subjects: [
        {
          id: 20,
          name: 'LONG_CROSS_BORDER_ENTITLEMENT_SUBJECT_NAME',
          actions: [{ id: 20, entitlementId: 20, name: 'F_View_Regional_Settlement_Data' }],
        },
      ],
    });
  return entities;
}

function buildDrawers(): PresentedTiles[] {
  const tile = (id: number, title: string, tilePath: string, subtitle?: string) => ({
    id,
    title,
    subtitle,
    container: '@fm/ratan_container',
    module: '/cashflow_blotter_cn',
    tile: tilePath,
    imageDarkTheme: '',
    imageLightTheme: '',
    emailSupport: 'portal-prototype@example.test',
    entity: [expandedRole],
    subject: 'RATAN_STRATEGIC_CASHFLOW_BLOTTER',
  });
  return [
    {
      id: 1,
      label: 'Trade Processing',
      tiles: [{ ...tile(1, 'Trade Blotter', '/trade'), presentation: { pattern: 'chevron' } }],
    },
    {
      id: 2,
      label: 'Settlement',
      tiles: [
        {
          ...tile(2, 'Cashflow Blotter', '/cashflow_cn', '[FX & Equity]'),
          presentation: { pattern: 'wave' },
        },
        {
          ...tile(3, 'Cashflow Blotter', '/cashflow_open_search', '[Open Search]'),
          presentation: { pattern: 'dots' },
        },
        {
          ...tile(4, 'Cashflow Blotter', '/cashflow_cn_location'),
          presentation: { pattern: 'chevron' },
        },
        {
          ...tile(5, 'Group Blotter', '/cashflow_group_management'),
          presentation: { pattern: 'rings' },
        },
        {
          ...tile(6, 'Cashflow Dashboard', '/cashflow_cn_dashboard'),
          presentation: { pattern: 'wave' },
        },
      ],
    },
    {
      id: 3,
      label: 'Exception Management',
      tiles: [
        {
          ...tile(7, 'Validation Exceptions', '/validation_exceptions'),
          presentation: { pattern: 'wave' },
        },
        {
          ...tile(8, 'Settlement Exceptions', '/settlement_exceptions'),
          presentation: { pattern: 'dots' },
        },
      ],
    },
  ];
}

/** Candidate presentation data only: Stage 7 must define the real launch-parameter contract. */
const locationCandidates = [4, 5, 6].map((tileId) => ({
  tileId,
  choices: [
    { label: 'Global', key: 'global' },
    { label: 'Indonesia', key: 'indonesia' },
  ],
}));

/** Uses the current serialized OUD/auth response contract; never bypasses login controllers. */
export function buildPrototypeAuth(clock: keyof typeof prototypeClock, stress = false) {
  const entities = buildEntities(stress);
  const entitlements: NonNullable<User['entitlements']> = {};
  for (const entity of entities) {
    entitlements[`${entity.name}:${entity.roleName}`] = Object.fromEntries(
      entity.subjects.map((subject) => [subject.name, subject.actions.map(({ name }) => name)]),
    );
  }
  const fullName = stress
    ? 'Yating, Yang — Global Markets Operations and Settlement Administration'
    : 'Yating, Yang';
  const userInfo = JSON.stringify({
    sub: '8227715',
    fullName,
    auth_time: authTime,
    entitlements,
    oud: JSON.stringify({
      userId: '8227715',
      fullName,
      firstName: 'Yating',
      lastName: 'Yang',
      emailId: stress ? 'yating.yang.global.markets.operations@example.test' : 'Yating.yang@sc.com',
      country: 'CN',
    }),
  });
  const exp =
    Date.parse(clock === 'profile' ? '2026-09-21T01:23:00Z' : '2026-09-22T01:23:00Z') / 1000;
  const token = `${Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url')}.${Buffer.from(
    JSON.stringify({ sub: '8227715', iat: authTime, exp }),
  ).toString('base64url')}.`;
  return {
    body: { result: 'success', userInfo, entities, drawers: buildDrawers() },
    token,
    locationCandidates,
  };
}

export function buildPrototypeStorage(
  theme: PrototypeTheme,
  stress = false,
): Record<string, string> {
  const labels = stress
    ? [
        'Cashflow Blotter',
        'Flowzero',
        'Workspace 2',
        ...Array.from(
          { length: 7 },
          (_, index) => `Workspace ${index + 3} — Regional Settlement Operations`,
        ),
      ]
    : ['Cashflow Blotter', 'Flowzero', 'Workspace 2'];
  const workspaces: Workspace[] = labels.map((label, index) => ({
    id: `portal-prototype-workspace-${index + 1}`,
    label,
    isActive: false,
    containers: [],
  }));
  return { SET_THEME: theme, SET_TIME_TYPE: 'utc', SET_WORKSPACES: JSON.stringify(workspaces) };
}

export function clampPrototypeRegion(
  region: EvidenceRegion,
  viewport: { width: number; height: number },
): EvidenceRegion | null {
  if (
    ![region.x, region.y, region.width, region.height, viewport.width, viewport.height].every(
      Number.isFinite,
    )
  )
    return null;
  const x = Math.max(0, region.x);
  const y = Math.max(0, region.y);
  const width = Math.min(viewport.width, region.x + region.width) - x;
  const height = Math.min(viewport.height, region.y + region.height) - y;
  return width > 0 && height > 0 ? { x, y, width, height } : null;
}
