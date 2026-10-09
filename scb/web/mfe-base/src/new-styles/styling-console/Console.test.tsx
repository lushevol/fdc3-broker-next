import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Console } from './Console';
import { DEFAULT_STYLE_SETTINGS, type StyleSettings } from './settings';

function renderConsole(settings: StyleSettings = DEFAULT_STYLE_SETTINGS) {
  const onChange = vi.fn();
  const onReset = vi.fn();
  const view = render(<Console settings={settings} onChange={onChange} onReset={onReset} />);
  fireEvent.click(screen.getByRole('button', { name: 'Styling console' }));
  return { ...view, onChange, onReset, dialog: screen.getByRole('dialog', { name: 'Styling console' }) };
}

describe('local styling console', () => {
  it('opens a named drawer and closes through the close control and Escape', async () => {
    render(<Console settings={DEFAULT_STYLE_SETTINGS} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name: 'Styling console' });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Styling console' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Close styling console' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Styling console' })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: 'Styling console' }));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('exposes named controls and reports changes without touching saved preferences', () => {
    const { onChange, onReset, dialog } = renderConsole();
    const editor = within(dialog);
    fireEvent.click(editor.getByRole('checkbox', { name: 'Apply to Portal' }));
    expect(onChange).toHaveBeenLastCalledWith({ applyToPortal: !DEFAULT_STYLE_SETTINGS.applyToPortal });
    fireEvent.click(editor.getByRole('button', { name: 'Dark' }));
    expect(onChange).toHaveBeenLastCalledWith({ mode: 'dark' });
    fireEvent.click(editor.getByRole('button', { name: 'Legacy' }));
    expect(onChange).toHaveBeenLastCalledWith({ designGeneration: 'legacy' });
    fireEvent.change(editor.getByRole('spinbutton', { name: 'Font size (px)' }), { target: { value: '17' } });
    expect(onChange).toHaveBeenLastCalledWith({ fontSize: 17 });
    fireEvent.change(editor.getByRole('combobox', { name: 'Font family' }), { target: { value: 'inter' } });
    expect(onChange).toHaveBeenLastCalledWith({ fontFamily: 'inter' });
    fireEvent.change(editor.getByLabelText('Primary color'), { target: { value: '#129876' } });
    expect(onChange).toHaveBeenLastCalledWith({ primaryColor: '#129876' });
    fireEvent.change(editor.getByLabelText('Primary color swatch'), { target: { value: '#654321' } });
    expect(onChange).toHaveBeenLastCalledWith({ primaryColor: '#654321' });
    fireEvent.change(editor.getByRole('spinbutton', { name: 'Radius (px)' }), { target: { value: '6' } });
    expect(onChange).toHaveBeenLastCalledWith({ radius: 6 });
    fireEvent.click(editor.getByRole('button', { name: 'Medium' }));
    expect(onChange).toHaveBeenLastCalledWith({ controlSize: 'medium' });
    fireEvent.click(editor.getByRole('button', { name: 'Reset styles' }));
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('keeps intermediate numeric edits local and clamps only when committed', () => {
    const { onChange, dialog } = renderConsole();
    const font = within(dialog).getByRole('spinbutton', { name: 'Font size (px)' });
    fireEvent.change(font, { target: { value: '1' } });
    expect(font).toHaveValue(1);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(font, { target: { value: '18' } });
    expect(font).toHaveValue(18);
    expect(onChange).toHaveBeenLastCalledWith({ fontSize: 18 });
    onChange.mockClear();
    fireEvent.change(font, { target: { value: '25' } });
    expect(font).toHaveValue(25);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(font);
    expect(font).toHaveValue(20);
    expect(onChange).toHaveBeenLastCalledWith({ fontSize: 20 });
    onChange.mockClear();
    fireEvent.change(font, { target: { value: '4' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(font);
    expect(font).toHaveValue(10);
    expect(onChange).toHaveBeenLastCalledWith({ fontSize: 10 });
    onChange.mockClear();
    const radius = within(dialog).getByRole('spinbutton', { name: 'Radius (px)' });
    fireEvent.change(radius, { target: { value: '19' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(radius, { key: 'Enter' });
    expect(radius).toHaveValue(16);
    expect(onChange).toHaveBeenLastCalledWith({ radius: 16 });
  });

  it('restores blank and invalid numeric drafts without emitting a change', () => {
    const { onChange, dialog } = renderConsole();
    const font = within(dialog).getByRole('spinbutton', { name: 'Font size (px)' });
    fireEvent.change(font, { target: { value: '' } });
    expect(font).toHaveValue(null);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(font);
    expect(font).toHaveValue(DEFAULT_STYLE_SETTINGS.fontSize);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(font, { target: { value: '1e309' } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(font, { key: 'Enter' });
    expect(font).toHaveValue(DEFAULT_STYLE_SETTINGS.fontSize);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(font, { target: { value: '15' } });
    expect(onChange).toHaveBeenLastCalledWith({ fontSize: 15 });
  });

  it('synchronizes numeric drafts with reset settings, including an unchanged default', () => {
    const settings = { ...DEFAULT_STYLE_SETTINGS, fontSize: 18, radius: 12 };
    const { onChange, onReset, rerender, dialog } = renderConsole(settings);
    const font = within(dialog).getByRole('spinbutton', { name: 'Font size (px)' });
    const radius = within(dialog).getByRole('spinbutton', { name: 'Radius (px)' });
    fireEvent.change(font, { target: { value: '1' } });
    fireEvent.change(radius, { target: { value: '99' } });
    rerender(<Console settings={DEFAULT_STYLE_SETTINGS} onChange={onChange} onReset={onReset} />);
    expect(font).toHaveValue(DEFAULT_STYLE_SETTINGS.fontSize);
    expect(radius).toHaveValue(DEFAULT_STYLE_SETTINGS.radius);
    fireEvent.change(font, { target: { value: '1' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Reset styles' }));
    expect(within(dialog).getByRole('spinbutton', { name: 'Font size (px)' })).toHaveValue(DEFAULT_STYLE_SETTINGS.fontSize);
    expect(onReset).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps incomplete hex edits local until valid', () => {
    const { onChange, dialog } = renderConsole();
    const color = within(dialog).getByLabelText('Primary color');
    fireEvent.change(color, { target: { value: '#12' } });
    expect(onChange).not.toHaveBeenCalled();
    expect(color).toHaveValue('#12');
    fireEvent.blur(color);
    expect(color).toHaveValue(DEFAULT_STYLE_SETTINGS.primaryColor);
    fireEvent.change(color, { target: { value: '#abcdef' } });
    expect(onChange).toHaveBeenLastCalledWith({ primaryColor: '#abcdef' });
    fireEvent.blur(color);
    expect(color).toHaveValue('#abcdef');
    onChange.mockClear();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Light' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the editor appearance fixed while the package preview changes generation and mode', () => {
    const settings: StyleSettings = { ...DEFAULT_STYLE_SETTINGS, mode: 'dark', designGeneration: 'legacy', fontSize: 20 };
    const { dialog, rerender } = renderConsole(settings);
    const editorRoot = dialog.closest('.ratan-design-root');
    expect(editorRoot).toHaveAttribute('data-mode', 'light');
    expect(editorRoot).toHaveAttribute('data-generation', 'webkit');
    const preview = within(dialog).getByRole('region', { name: 'Preview' });
    expect(preview.querySelector('.ratan-design-root')).toHaveAttribute('data-mode', 'dark');
    expect(preview.querySelector('.ratan-design-root')).toHaveAttribute('data-generation', 'legacy');
    const editorHeading = within(dialog).getByRole('heading', { name: 'Styling console' });
    const before = window.getComputedStyle(editorHeading).fontSize;
    rerender(<Console settings={{ ...settings, mode: 'light', designGeneration: 'webkit', fontSize: 10 }} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(window.getComputedStyle(editorHeading).fontSize).toBe(before);
    expect(preview.querySelector('.ratan-design-root')).toHaveAttribute('data-generation', 'webkit');
  });

  it('scopes fixed editor tokens while the nested preview uses customized values', () => {
    const settings = { ...DEFAULT_STYLE_SETTINGS, applyToPortal: true, fontSize: 20, radius: 16, primaryColor: '#654321', fontFamily: 'arial' as const };
    const { dialog, rerender } = renderConsole(settings);
    const editorRoot = dialog.closest('.ratan-design-root') as HTMLElement;
    expect(window.getComputedStyle(editorRoot).getPropertyValue('--sc-form-input-border-radius')).toBe(`${DEFAULT_STYLE_SETTINGS.radius}px`);
    expect(window.getComputedStyle(editorRoot).getPropertyValue('--sc-font-size')).toBe(`${DEFAULT_STYLE_SETTINGS.fontSize}px`);
    expect(window.getComputedStyle(editorRoot).getPropertyValue('--sc-button-primary-background-color')).toBe(DEFAULT_STYLE_SETTINGS.primaryColor);
    const previewRoot = within(dialog).getByRole('region', { name: 'Preview' }).querySelector('.ratan-design-root') as HTMLElement;
    expect(window.getComputedStyle(previewRoot).getPropertyValue('--sc-form-input-border-radius')).toBe('16px');
    expect(window.getComputedStyle(previewRoot).getPropertyValue('--sc-font-size')).toBe('20px');
    rerender(<Console settings={{ ...settings, fontSize: 10, radius: 0 }} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(window.getComputedStyle(editorRoot).getPropertyValue('--sc-form-input-border-radius')).toBe(`${DEFAULT_STYLE_SETTINGS.radius}px`);
    expect(window.getComputedStyle(editorRoot).getPropertyValue('--sc-font-size')).toBe(`${DEFAULT_STYLE_SETTINGS.fontSize}px`);
    expect(window.getComputedStyle(previewRoot).getPropertyValue('--sc-form-input-border-radius')).toBe('0px');
    expect(window.getComputedStyle(previewRoot).getPropertyValue('--sc-font-size')).toBe('10px');
  });

  it('uses interactive package controls in the preview and resets their sample state', () => {
    const { dialog } = renderConsole();
    const preview = within(within(dialog).getByRole('region', { name: 'Preview' }));
    fireEvent.change(preview.getByRole('textbox', { name: 'Reference' }), { target: { value: 'INV-123' } });
    expect(preview.getByRole('textbox', { name: 'Reference' })).toHaveValue('INV-123');
    fireEvent.change(preview.getByRole('combobox', { name: 'Currency' }), { target: { value: 'GBP' } });
    expect(preview.getByRole('combobox', { name: 'Currency' })).toHaveValue('GBP');
    fireEvent.click(preview.getByRole('checkbox', { name: 'Notifications' }));
    expect(preview.getByRole('checkbox', { name: 'Notifications' })).toBeChecked();
    fireEvent.click(preview.getByRole('button', { name: 'Save' }));
    expect(preview.getByRole('status')).toHaveTextContent('Saved');
    fireEvent.click(preview.getByRole('button', { name: 'Clear' }));
    expect(preview.getByRole('textbox', { name: 'Reference' })).toHaveValue('');
    expect(preview.getByRole('combobox', { name: 'Currency' })).toHaveValue('USD');
    expect(preview.getByRole('checkbox', { name: 'Notifications' })).not.toBeChecked();
    expect(preview.getByRole('status')).toBeEmptyDOMElement();
  });
});
