import { useState } from 'react';
import { Button } from '@fm/ratan-design/button';
import { DatePicker } from '@fm/ratan-design/date-picker';
import { TextInput } from '@fm/ratan-design/text-input';
import { applyDocumentMode, type ColorMode, type FontMode, type Theme } from '../theme.js';

export function ThemeModesScenario() {
  const [theme, setTheme] = useState<Theme>('standard');
  const [mode, setMode] = useState<ColorMode>('light');
  const [font, setFont] = useState<FontMode>('default');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const [locale, setLocale] = useState('en-SG');

  const update = (next: Partial<{ theme: Theme; mode: ColorMode; font: FontMode; direction: 'ltr' | 'rtl'; locale: string }>) => {
    const settings = { theme, mode, font, direction, locale, ...next };
    setTheme(settings.theme);
    setMode(settings.mode);
    setFont(settings.font);
    setDirection(settings.direction);
    setLocale(settings.locale);
    applyDocumentMode(settings);
  };

  return (
    <section aria-labelledby="theme-heading">
      <h2 id="theme-heading">Document-global theme, mode, direction, and locale</h2>
      <div className="playground-controls">
        <label>Theme<select value={theme} onChange={(event) => update({ theme: event.target.value as Theme })}><option value="standard">Standard</option><option value="cpbb">CPBB</option></select></label>
        <label>Mode<select value={mode} onChange={(event) => update({ mode: event.target.value as ColorMode })}><option value="light">Light</option><option value="dark">Dark</option></select></label>
        <label>Font<select value={font} onChange={(event) => update({ font: event.target.value as FontMode })}><option value="default">Default</option><option value="inter">Inter</option><option value="roboto-mono">Roboto Mono</option><option value="dyslexic">Dyslexic</option></select></label>
        <label>Direction<select value={direction} onChange={(event) => update({ direction: event.target.value as 'ltr' | 'rtl' })}><option value="ltr">LTR</option><option value="rtl">RTL</option></select></label>
        <label>Locale<select value={locale} onChange={(event) => update({ locale: event.target.value })}><option value="en-SG">en-SG</option><option value="ar-AE">ar-AE</option></select></label>
      </div>
      <div className="playground-preview">
        <Button variant="primary">Primary action</Button>
        <TextInput label="Account" defaultValue="SG-1024" />
        <DatePicker label="Settlement" defaultValue="2026-08-06" locale={locale} />
      </div>
    </section>
  );
}
