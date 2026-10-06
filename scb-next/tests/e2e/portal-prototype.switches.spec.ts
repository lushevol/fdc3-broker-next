import { writeFile } from 'node:fs/promises';
import type { Locator } from '@playwright/test';
import { expect, test } from './portal-prototype.fixture';

async function switchAppearance(input: Locator) {
  return input
    .locator('xpath=ancestor::span[contains(@class,"MuiSwitch-root")][1]')
    .evaluate((element) => {
      const track = element.querySelector('.MuiSwitch-track');
      const thumb = element.querySelector('.MuiSwitch-thumb');
      const base = element.querySelector('.MuiSwitch-switchBase');
      const input = element.querySelector('input');
      const label = element.closest('section')?.querySelector('span[class*="-label"]');
      if (!track || !thumb || !base || !input || !label)
        throw new Error('The switch must expose its input, track, thumb and label.');
      const rootBounds = element.getBoundingClientRect();
      const trackBounds = track.getBoundingClientRect();
      const thumbBounds = thumb.getBoundingClientRect();
      const inputBounds = input.getBoundingClientRect();
      const trackStyle = getComputedStyle(track);
      const baseStyle = getComputedStyle(base);
      const thumbStyle = getComputedStyle(thumb);
      return {
        root: { width: rootBounds.width, height: rootBounds.height },
        track: {
          x: trackBounds.x - rootBounds.x,
          y: trackBounds.y - rootBounds.y,
          width: trackBounds.width,
          height: trackBounds.height,
          border: trackStyle.borderWidth,
          background: trackStyle.backgroundColor,
        },
        thumb: {
          left: thumbBounds.left - trackBounds.left,
          right: trackBounds.right - thumbBounds.right,
          top: thumbBounds.top - trackBounds.top,
          bottom: trackBounds.bottom - thumbBounds.bottom,
        },
        input: {
          x: inputBounds.x - rootBounds.x,
          y: inputBounds.y - rootBounds.y,
          width: inputBounds.width,
          height: inputBounds.height,
        },
        baseBackground: baseStyle.backgroundColor,
        focusVisible: base.classList.contains('Mui-focusVisible'),
        thumbShadow: thumbStyle.boxShadow,
        labelColor: getComputedStyle(label).color,
      };
    });
}

for (const viewport of [
  { width: 1512, height: 982 },
  { width: 390, height: 844 },
]) {
  test(`${viewport.width}px header switches retain aligned thumbs and stable hover geometry`, async ({
    page,
    portal,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await portal.open('empty', 'dark');
    const metrics = [];
    for (const { name, theme } of [
      { name: 'Theme Switch', theme: 'dark' },
      { name: 'Time Switch', theme: 'dark' },
      { name: 'Time Switch', theme: 'light' },
    ] as const) {
      await page.getByRole('checkbox', { name: 'Theme Switch' }).setChecked(theme === 'light');
      const input = page.getByRole('checkbox', { name, exact: true });
      for (const checked of [false, true]) {
        await input.setChecked(checked);
        await page.mouse.move(0, 0);
        await page.waitForTimeout(250);
        const before = await switchAppearance(input);
        const root = input.locator('xpath=ancestor::span[contains(@class,"MuiSwitch-root")][1]');
        const bounds = await root.boundingBox();
        if (!bounds) throw new Error('The switch must have visible bounds.');
        await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        const frames = await root.evaluate(async (element) => {
          const track = element.querySelector('.MuiSwitch-track');
          if (!track) throw new Error('The switch must have a track.');
          const samples = [];
          for (let index = 0; index < 12; index += 1) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            const style = getComputedStyle(track);
            samples.push({ border: style.borderWidth, background: style.backgroundColor });
          }
          return samples;
        });
        await page.waitForTimeout(250);
        const hovered = await switchAppearance(input);
        metrics.push({ name, theme, checked, before, hovered });
        expect.soft(before.root).toEqual({ width: 32, height: 14 });
        expect.soft(before.input).toEqual({ x: 0, y: 0, width: 32, height: 14 });
        expect.soft(before.track.width, `${name} ${checked}: track width`).toBe(32);
        expect.soft(before.track.height, `${name} ${checked}: track height`).toBe(14);
        expect.soft(before.thumb.top, `${name} ${checked}: top inset`).toBe(1);
        expect.soft(before.thumb.bottom, `${name} ${checked}: bottom inset`).toBe(1);
        expect.soft(checked ? before.thumb.right : before.thumb.left).toBe(1);
        expect
          .soft(hovered.track, `${name} ${checked}: hover preserves the track`)
          .toEqual(before.track);
        expect
          .soft(hovered.thumb, `${name} ${checked}: hover preserves the thumb`)
          .toEqual(before.thumb);
        expect.soft(hovered.input).toEqual(before.input);
        for (const frame of frames) {
          expect.soft(frame, `${name} ${checked}: hover frames remain stable`).toEqual({
            border: before.track.border,
            background: before.track.background,
          });
        }
        expect
          .soft(hovered.baseBackground, `${name} ${checked}: no hover halo`)
          .toBe('rgba(0, 0, 0, 0)');
      }
      await page.mouse.move(0, 0);
      await page.keyboard.press('Tab');
      await input.focus();
      await expect(input).toBeFocused();
      await input.press('Space');
      await expect(input).not.toBeChecked();
      await page.waitForTimeout(250);
      const focused = await switchAppearance(input);
      expect.soft(focused.root).toEqual({ width: 32, height: 14 });
      expect.soft(focused.focusVisible).toBe(true);
      expect.soft(focused.thumbShadow).not.toBe('none');
      expect
        .soft(focused.labelColor, `${name}: focus preserves readable header text`)
        .toBe('rgb(229, 241, 252)');
      expect.soft(focused.track.border, `${name}: focus preserves the border`).toBe('0px');
      expect.soft(focused.thumb.top).toBe(1);
      expect.soft(focused.thumb.bottom).toBe(1);
      expect.soft(focused.thumb.left).toBe(1);
      metrics.push({ name, theme, checked: false, before: focused, hovered: focused });
      const root = input.locator('xpath=ancestor::span[contains(@class,"MuiSwitch-root")][1]');
      const bounds = await root.boundingBox();
      if (!bounds) throw new Error('The switch must have visible bounds.');
      await page.mouse.click(bounds.x + bounds.width - 0.5, bounds.y + bounds.height / 2);
      await expect(input).toBeChecked();
      await page.mouse.click(bounds.x + 0.5, bounds.y + bounds.height / 2);
      await expect(input).not.toBeChecked();
    }
    const metricsPath = testInfo.outputPath('switch-metrics.json');
    await writeFile(metricsPath, JSON.stringify(metrics, null, 2));
    await testInfo.attach('switch-metrics', { path: metricsPath, contentType: 'application/json' });
    await page.screenshot({ path: testInfo.outputPath('header-switches.png') });
  });
}
