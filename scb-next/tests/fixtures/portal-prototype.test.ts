import { describe, expect, it } from 'vitest';
import {
  buildPrototypeAuth,
  buildPrototypeStorage,
  clampPrototypeRegion,
  prototypeReferences,
  prototypeViewports,
  referenceViewport,
} from './portal-prototype';

describe('Portal prototype reference contract', () => {
  it('maps each of the 14 supplied frames to a Base-owned state and native region', () => {
    expect(prototypeReferences.map(({ frame }) => frame).sort()).toEqual([
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
    ]);
    expect(new Set(prototypeReferences.map(({ file }) => file)).size).toBe(14);
    for (const reference of prototypeReferences) {
      expect(clampPrototypeRegion(reference.region, referenceViewport)).toEqual(reference.region);
      expect(reference.owner).toMatch(/^(Login|Home|Avatar|Profile|Drawer)$/);
    }
    expect(prototypeReferences.find(({ frame }) => frame === '04')?.theme).toBe('dark');
  });

  it('keeps four native functional roles and matching nested actions in the auth response', () => {
    const { body, token } = buildPrototypeAuth('profile');
    expect(body.entities).toHaveLength(4);
    const user = JSON.parse(body.userInfo);
    expect(JSON.parse(user.oud)).toMatchObject({
      fullName: 'Yating, Yang',
      userId: '8227715',
      country: 'CN',
    });
    for (const entity of body.entities) {
      for (const subject of entity.subjects) {
        expect(user.entitlements[`${entity.name}:${entity.roleName}`][subject.name]).toEqual(
          subject.actions.map(({ name }) => name),
        );
      }
    }
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    expect(payload.exp).toBeGreaterThan(Date.parse('2026-09-21T01:06:00Z') / 1000);
    expect(payload.exp).toBe(Date.parse('2026-09-21T01:23:00Z') / 1000);
  });

  it('adds a separate data-entitlement role and long identity only for stress evidence', () => {
    const reference = buildPrototypeAuth('shell');
    const stress = buildPrototypeAuth('shell', true);
    expect(reference.body.entities).toHaveLength(4);
    expect(stress.body.entities).toHaveLength(5);
    expect(stress.body.entities.at(-1)?.name).toBe('RATAN_DATA_ENTITLEMENT');
    expect(JSON.parse(stress.body.userInfo).fullName.length).toBeGreaterThan(
      JSON.parse(reference.body.userInfo).fullName.length,
    );
    expect(buildPrototypeAuth('shell')).toEqual(reference);
  });

  it('provides populated category data without interpreting entitlement entities as locations', () => {
    const { body, locationCandidates } = buildPrototypeAuth('shell');
    expect(body.drawers.map(({ label }) => label)).toEqual([
      'Trade Processing',
      'Settlement',
      'Exception Management',
    ]);
    expect(body.drawers.find(({ label }) => label === 'Settlement')?.tiles).toHaveLength(5);
    expect(locationCandidates.map(({ choices }) => choices.map(({ label }) => label))).toEqual([
      ['Global', 'Indonesia'],
      ['Global', 'Indonesia'],
      ['Global', 'Indonesia'],
    ]);
    for (const category of body.drawers) {
      for (const tile of category.tiles) {
        expect(tile.entity).toEqual(['X_RATANONE']);
        expect(tile).not.toHaveProperty('locations');
      }
    }
  });

  it('seeds stable workspaces and preferences without bypassing login or overwriting auth state', () => {
    const storage = buildPrototypeStorage('light');
    expect(storage.SET_THEME).toBe('light');
    expect(storage.SET_TIME_TYPE).toBe('utc');
    expect(storage).not.toHaveProperty('SET_USER');
    expect(storage).not.toHaveProperty('SET_TOKEN');
    expect(JSON.parse(storage.SET_WORKSPACES).map(({ label }: { label: string }) => label)).toEqual(
      ['Cashflow Blotter', 'Flowzero', 'Workspace 2'],
    );
    expect(JSON.parse(buildPrototypeStorage('dark', true).SET_WORKSPACES)).toHaveLength(10);
  });

  it('assigns decorative card patterns explicitly without defining unsupported location launches', () => {
    const tiles = buildPrototypeAuth('shell').body.drawers.flatMap((category) => category.tiles);
    expect(tiles.map((tile) => tile.presentation?.pattern)).toEqual([
      'chevron',
      'wave',
      'dots',
      'chevron',
      'rings',
      'wave',
      'wave',
      'dots',
    ]);
    expect(tiles.every((tile) => !tile.presentation?.launchOptions?.length)).toBe(true);
  });

  it('covers narrow, tablet, compact, short and wide layouts independently from native references', () => {
    expect(prototypeViewports.map(({ name }) => name)).toEqual([
      'mobile',
      'tablet',
      'compact-desktop',
      'short-desktop',
      'wide-desktop',
    ]);
    expect(referenceViewport).toEqual({ width: 1512, height: 982 });
  });

  it('clamps evidence clips to the viewport and rejects empty or invalid clips', () => {
    expect(
      clampPrototypeRegion({ x: -5, y: 80, width: 200, height: 80 }, { width: 100, height: 100 }),
    ).toEqual({ x: 0, y: 80, width: 100, height: 20 });
    expect(
      clampPrototypeRegion({ x: 120, y: 0, width: 10, height: 10 }, { width: 100, height: 100 }),
    ).toBeNull();
    expect(
      clampPrototypeRegion({ x: 0, y: 0, width: 0, height: 10 }, referenceViewport),
    ).toBeNull();
    expect(
      clampPrototypeRegion({ x: Number.NaN, y: 0, width: 10, height: 10 }, referenceViewport),
    ).toBeNull();
  });
});
