import { z } from 'zod';

export const STYLE_STORAGE_KEY = 'portal.dev.style-preview.v1';
export const STYLE_LIMITS = {
  fontSize: { min: 10, max: 20 },
  radius: { min: 0, max: 16 },
} as const;
export const STYLE_FONTS = {
  prosper: { label: 'SC Prosper Sans', value: '"SC Prosper Sans", Arial, sans-serif' },
  inter: { label: 'Inter', value: 'Inter, Arial, sans-serif' },
  arial: { label: 'Arial', value: 'Arial, sans-serif' },
  dyslexic: { label: 'Open Dyslexic', value: '"Open Dyslexic", Arial, sans-serif' },
} as const;

export interface StyleSettings {
  applyToPortal: boolean;
  mode: 'light' | 'dark';
  designGeneration: 'webkit' | 'legacy';
  fontSize: number;
  fontFamily: keyof typeof STYLE_FONTS;
  primaryColor: string;
  radius: number;
  controlSize: 'small' | 'medium';
}

export const DEFAULT_STYLE_SETTINGS: StyleSettings = {
  applyToPortal: false,
  mode: 'light',
  designGeneration: 'webkit',
  fontSize: 14,
  fontFamily: 'prosper',
  primaryColor: '#0473ea',
  radius: 8,
  controlSize: 'small',
};

const boundedNumber = (limits: { min: number; max: number }, fallback: number) =>
  z
    .number()
    .finite()
    .transform((value) => Math.min(limits.max, Math.max(limits.min, value)))
    .catch(fallback);
const settingsSchema = z
  .object({
    applyToPortal: z.boolean().catch(DEFAULT_STYLE_SETTINGS.applyToPortal),
    mode: z.enum(['light', 'dark']).catch(DEFAULT_STYLE_SETTINGS.mode),
    designGeneration: z.enum(['webkit', 'legacy']).catch(DEFAULT_STYLE_SETTINGS.designGeneration),
    fontSize: boundedNumber(STYLE_LIMITS.fontSize, DEFAULT_STYLE_SETTINGS.fontSize),
    fontFamily: z
      .enum(['prosper', 'inter', 'arial', 'dyslexic'])
      .catch(DEFAULT_STYLE_SETTINGS.fontFamily),
    primaryColor: z
      .string()
      .regex(/^#[\da-f]{6}$/i)
      .transform((value) => value.toLowerCase())
      .catch(DEFAULT_STYLE_SETTINGS.primaryColor),
    radius: boundedNumber(STYLE_LIMITS.radius, DEFAULT_STYLE_SETTINGS.radius),
    controlSize: z.enum(['small', 'medium']).catch(DEFAULT_STYLE_SETTINGS.controlSize),
  })
  .catch(DEFAULT_STYLE_SETTINGS);

export const normalizeStyleSettings = (input: unknown): StyleSettings =>
  settingsSchema.parse(input);

export const isLocalStylingConsole = (development: boolean, hostname: string) =>
  development && ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname);

export function readStyleSettings(storage: Pick<Storage, 'getItem'>): StyleSettings {
  try {
    const raw = storage.getItem(STYLE_STORAGE_KEY);
    if (!raw) return DEFAULT_STYLE_SETTINGS;
    const saved: unknown = JSON.parse(raw);
    const envelope = z.object({ version: z.literal(1), settings: z.unknown() }).parse(saved);
    return normalizeStyleSettings(envelope.settings);
  } catch {
    return DEFAULT_STYLE_SETTINGS;
  }
}

export function saveStyleSettings(
  storage: Pick<Storage, 'setItem' | 'removeItem'>,
  settings: StyleSettings,
): void {
  try {
    if (JSON.stringify(settings) === JSON.stringify(DEFAULT_STYLE_SETTINGS))
      storage.removeItem(STYLE_STORAGE_KEY);
    else storage.setItem(STYLE_STORAGE_KEY, JSON.stringify({ version: 1, settings }));
  } catch {
    // Browser storage can be disabled; previews remain usable for this session.
  }
}
