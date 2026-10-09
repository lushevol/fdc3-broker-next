import React from 'react';
import { Button, Input, RatanDesignProvider, Select, ToggleButton } from 'ratan-design-origin';
import { Adjust, Close, Refresh } from 'ratan-design-origin/icons';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Switch,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from 'ratan-design-origin/primitives';
import { createRatanTheme, styled } from 'ratan-design-origin/theme';
import { createStylePreviewTheme, createStylePreviewVariables } from './preview-theme';
import { DEFAULT_STYLE_SETTINGS, STYLE_FONTS, STYLE_LIMITS, type StyleSettings } from './settings';
import { consoleUiTokens as ui } from './ui-tokens';
import { PortalGenerationSwitch, type PortalGenerationControl } from './PortalGenerationSwitch';

const EDITOR_THEME = createRatanTheme({ mode: 'light', designGeneration: 'webkit' });
const COLOR_HEX = /^#[0-9a-f]{6}$/i;
const currencies = ['USD', 'GBP', 'SGD'] as const;
const EditorProvider = styled(RatanDesignProvider)({
  '&&&': createStylePreviewVariables(DEFAULT_STYLE_SETTINGS),
});
const PreviewProvider = styled(RatanDesignProvider, {
  shouldForwardProp: (prop) => prop !== 'settings',
})<{ settings: StyleSettings }>(({ settings }) => ({
  '&&&': createStylePreviewVariables(settings),
}));
const segmentStyles = {
  flex: 1,
  minWidth: 0,
  minHeight: ui.controlHeight,
  fontSize: ui.type.caption,
  padding: `${ui.space.small / 2}px ${ui.space.medium}px`,
  '&.Mui-selected': { transform: 'none' },
};
const fieldRowStyles = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
  gap: `${ui.space.large}px`,
  alignItems: 'start',
};

export interface ConsoleProps {
  portalGeneration?: PortalGenerationControl;
  settings: StyleSettings;
  onChange: (patch: Partial<StyleSettings>) => void;
  onReset: () => void;
}

function NumericField({
  label,
  value,
  limits,
  onChange,
  resetRevision,
}: {
  label: string;
  value: number;
  limits: { min: number; max: number };
  onChange: (value: number) => void;
  resetRevision: number;
}) {
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => setDraft(String(value)), [value, resetRevision]);
  const commitDraft = () => {
    const parsed = Number(draft);
    if (draft.trim() === '' || !Number.isFinite(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = Math.min(limits.max, Math.max(limits.min, parsed));
    setDraft(String(next));
    if (next !== value) onChange(next);
  };
  return (
    <Input
      label={label}
      variant="outlined"
      size="small"
      type="number"
      fullWidth
      value={draft}
      inputProps={{ min: limits.min, max: limits.max, step: 1 }}
      onChange={(event) => {
        const text = event.target.value;
        setDraft(text);
        if (text.trim() === '') return;
        const next = Number(text);
        if (Number.isFinite(next) && next >= limits.min && next <= limits.max) onChange(next);
      }}
      onBlur={commitDraft}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          commitDraft();
        }
      }}
    />
  );
}

function Segments<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  const labelId = React.useId();
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        id={labelId}
        component="div"
        sx={{ fontSize: ui.type.caption, marginBottom: `${ui.space.small}px` }}
      >
        {label}
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={value}
        aria-labelledby={labelId}
        size="small"
        sx={{ width: '100%' }}
        onChange={(_event, next: T | null) => {
          if (next !== null) onChange(next);
        }}
      >
        {options.map((option) => (
          <ToggleButton key={option.value} value={option.value} sx={segmentStyles}>
            {option.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

function PackagePreview({ settings }: { settings: StyleSettings }) {
  const [reference, setReference] = React.useState('');
  const [currency, setCurrency] = React.useState('USD');
  const [notifications, setNotifications] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const headingId = React.useId();
  const theme = React.useMemo(
    () =>
      createStylePreviewTheme(
        createRatanTheme({
          mode: settings.mode,
          designGeneration: settings.designGeneration,
        }),
        settings,
      ),
    [settings],
  );
  return (
    <Box component="section" aria-labelledby={headingId} sx={{ minWidth: 0 }}>
      <Typography
        id={headingId}
        component="h3"
        sx={{ fontSize: ui.type.body, fontWeight: 600, marginBottom: `${ui.space.medium}px` }}
      >
        Preview
      </Typography>
      <PreviewProvider
        baseTheme={theme}
        mode={settings.mode}
        designGeneration={settings.designGeneration}
        settings={settings}
      >
        <Box
          sx={{
            display: 'grid',
            gap: `${ui.space.large}px`,
            padding: `${ui.space.large}px`,
            minWidth: 0,
          }}
        >
          <Box>
            <Typography variant="h6" component="h4">
              Payment details
            </Typography>
            <Typography variant="body1">Settlement instruction</Typography>
            <Typography variant="caption">Updated today</Typography>
          </Box>
          <Input
            label="Reference"
            variant="outlined"
            size={settings.controlSize}
            fullWidth
            value={reference}
            onChange={(event) => {
              setReference(event.target.value);
              setSaved(false);
            }}
          />
          <Select
            label="Currency"
            variant="outlined"
            size={settings.controlSize}
            native
            value={currency}
            onChange={(event) => {
              setCurrency(String(event.target.value));
              setSaved(false);
            }}
          >
            {currencies.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
          <Box
            component="label"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: `${ui.space.small}px`,
            }}
          >
            <Typography variant="body2">Notifications</Typography>
            <Switch
              size="small"
              checked={notifications}
              inputProps={{ 'aria-label': 'Notifications' }}
              onChange={(_event, checked) => setNotifications(checked)}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: `${ui.space.small}px`, flexWrap: 'wrap' }}>
            <Button variant="contained" size={settings.controlSize} onClick={() => setSaved(true)}>
              Save
            </Button>
            <Button
              variant="outlined"
              size={settings.controlSize}
              onClick={() => {
                setReference('');
                setCurrency('USD');
                setNotifications(false);
                setSaved(false);
              }}
            >
              Clear
            </Button>
          </Box>
          <Typography variant="caption" role="status" sx={{ minHeight: '1.5em' }}>
            {saved ? 'Saved' : ''}
          </Typography>
        </Box>
      </PreviewProvider>
    </Box>
  );
}

export function Console({ settings, onChange, onReset, portalGeneration }: ConsoleProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [resetRevision, setResetRevision] = React.useState(0);
  const [colorText, setColorText] = React.useState(settings.primaryColor);
  const titleId = React.useId();
  React.useEffect(() => setColorText(settings.primaryColor), [settings.primaryColor]);
  return (
    <EditorProvider baseTheme={EDITOR_THEME} mode="light" designGeneration="webkit">
      {portalGeneration && !open && <PortalGenerationSwitch {...portalGeneration} />}
      <Tooltip title="Styling console" placement="left">
        <IconButton
          ref={triggerRef}
          aria-label="Styling console"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: ui.space.large,
            right: ui.space.large,
            width: ui.triggerSize,
            height: ui.triggerSize,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            border: 1,
            borderColor: 'divider',
            borderRadius: `${ui.radius}px`,
            boxShadow: 2,
            zIndex: (theme) => theme.zIndex.drawer - 1,
            visibility: open ? 'hidden' : 'visible',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          <Adjust fontSize="small" />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        SlideProps={{ onExited: () => triggerRef.current?.focus() }}
        ModalProps={{ BackdropProps: { invisible: true } }}
        PaperProps={{
          role: 'dialog',
          'aria-labelledby': titleId,
          'aria-modal': true,
          sx: {
            width: `min(${ui.width}px, 100vw)`,
            maxWidth: '100vw',
            height: '100dvh',
            maxHeight: '100dvh',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: 'background.paper',
            fontSize: ui.type.body,
            borderRadius: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: `${ui.space.small}px`,
            padding: `${ui.space.medium}px ${ui.space.large}px`,
            flexShrink: 0,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography
            id={titleId}
            component="h2"
            sx={{
              fontSize: ui.type.heading,
              lineHeight: ui.lineHeight,
              fontWeight: 600,
              flex: 1,
              minWidth: 0,
            }}
          >
            Styling console
          </Typography>
          <Tooltip title="Reset styles">
            <IconButton
              aria-label="Reset styles"
              onClick={() => {
                setResetRevision((current) => current + 1);
                onReset();
              }}
              sx={{ width: ui.iconSize, height: ui.iconSize }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close styling console">
            <IconButton
              aria-label="Close styling console"
              onClick={() => setOpen(false)}
              sx={{ width: ui.iconSize, height: ui.iconSize }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: `${ui.space.section}px`,
            padding: `${ui.space.large}px`,
            overflowY: 'auto',
            minHeight: 0,
            minWidth: 0,
          }}
        >
          <Box>
            <Typography
              component="div"
              sx={{
                fontSize: ui.type.caption,
                color: 'text.secondary',
                marginBottom: `${ui.space.small}px`,
              }}
            >
              Portal &amp; package controls
            </Typography>
            <Box
              component="label"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: `${ui.space.small}px`,
              }}
            >
              <Typography sx={{ fontSize: ui.type.body }}>Apply to Portal</Typography>
              <Switch
                size="small"
                checked={settings.applyToPortal}
                inputProps={{ 'aria-label': 'Apply to Portal' }}
                onChange={(_event, checked) => onChange({ applyToPortal: checked })}
              />
            </Box>
          </Box>
          <Box sx={fieldRowStyles}>
            <Segments
              label="Mode"
              value={settings.mode}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
              onChange={(mode) => onChange({ mode })}
            />
            <Segments
              label="Generation"
              value={settings.designGeneration}
              options={[
                { value: 'webkit', label: 'WebKit' },
                { value: 'legacy', label: 'Legacy' },
              ]}
              onChange={(designGeneration) => onChange({ designGeneration })}
            />
          </Box>
          <Select
            label="Font family"
            variant="outlined"
            size="small"
            native
            value={settings.fontFamily}
            onChange={(event) =>
              onChange({ fontFamily: event.target.value as StyleSettings['fontFamily'] })
            }
          >
            {Object.entries(STYLE_FONTS).map(([value, font]) => (
              <option key={value} value={value}>
                {font.label}
              </option>
            ))}
          </Select>
          <Box sx={fieldRowStyles}>
            <NumericField
              resetRevision={resetRevision}
              label="Font size (px)"
              value={settings.fontSize}
              limits={STYLE_LIMITS.fontSize}
              onChange={(fontSize) => onChange({ fontSize })}
            />
            <NumericField
              resetRevision={resetRevision}
              label="Radius (px)"
              value={settings.radius}
              limits={STYLE_LIMITS.radius}
              onChange={(radius) => onChange({ radius })}
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `${ui.swatchWidth}px minmax(0, 1fr)`,
              gap: `${ui.space.medium}px`,
              alignItems: 'end',
            }}
          >
            <Input
              variant="outlined"
              size="small"
              type="color"
              value={settings.primaryColor}
              inputProps={{ 'aria-label': 'Primary color swatch' }}
              sx={{
                '& input': {
                  padding: `${ui.space.small / 2}px`,
                  height: ui.controlHeight - ui.space.small,
                  cursor: 'pointer',
                },
              }}
              onChange={(event) => onChange({ primaryColor: event.target.value })}
            />
            <Input
              label="Primary color"
              variant="outlined"
              size="small"
              fullWidth
              value={colorText}
              inputProps={{ maxLength: 7, spellCheck: false }}
              onChange={(event) => {
                setColorText(event.target.value);
                if (COLOR_HEX.test(event.target.value))
                  onChange({ primaryColor: event.target.value });
              }}
              onBlur={() => {
                if (!COLOR_HEX.test(colorText)) setColorText(settings.primaryColor);
              }}
            />
          </Box>
          <Segments
            label="Control size"
            value={settings.controlSize}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
            ]}
            onChange={(controlSize) => onChange({ controlSize })}
          />
          <Divider />
          <PackagePreview settings={settings} />
        </Box>
      </Drawer>
    </EditorProvider>
  );
}
