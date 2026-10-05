import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MuiTextField from '@mui/material/TextField';
import MuiTabs from '@mui/material/Tabs';
import MuiPersonOutlined from '@mui/icons-material/PersonOutlined';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import MuiDrawer from '@mui/material/Drawer';
import MuiDialog from '@mui/material/Dialog';
import MuiIconButton from '@mui/material/IconButton';
import MuiCssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import MuiAdd from '@mui/icons-material/Add';
import MuiBadgeOutlined from '@mui/icons-material/BadgeOutlined';
import MuiMailOutline from '@mui/icons-material/MailOutline';
import MuiVerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import { Box, CssBaseline, Dialog, Drawer, IconButton, Tabs, TextField } from '../src/primitives';
import {
  Add,
  BadgeOutlined,
  MailOutline,
  PersonOutlined,
  VerifiedUserOutlined,
} from '../src/icons';
import { DataGrid } from '../src/data-grid';
import { styled, ThemeProvider, useTheme } from '../src/theme';

describe('presentation compatibility exports', () => {
  it('keeps MUI component identity for existing host theme overrides and styles', () => {
    expect(TextField).toBe(MuiTextField);
    expect(Tabs).toBe(MuiTabs);
    expect(PersonOutlined).toBe(MuiPersonOutlined);
    expect(BadgeOutlined).toBe(MuiBadgeOutlined);
    expect(MailOutline).toBe(MuiMailOutline);
    expect(VerifiedUserOutlined).toBe(MuiVerifiedUserOutlined);
  });

  it('keeps native field semantics and MUI class selectors through styled roots', () => {
    const Root = styled(Box)({ '& .MuiTextField-root': { width: '100%' } });
    render(
      <Root>
        <TextField
          label="Username"
          variant="outlined"
          InputProps={{ startAdornment: <PersonOutlined /> }}
        />
      </Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Username' });
    expect(input).toHaveClass('MuiInputBase-input');
    expect(input.closest('.MuiTextField-root')).toBeInTheDocument();
    expect(screen.getByTestId('PersonOutlinedIcon')).toBeInTheDocument();
  });

  it('preserves shell and grid component identity and MUI theme context', () => {
    expect(Drawer).toBe(MuiDrawer);
    expect(Dialog).toBe(MuiDialog);
    expect(IconButton).toBe(MuiIconButton);
    expect(CssBaseline).toBe(MuiCssBaseline);
    expect(Add).toBe(MuiAdd);
    expect(DataGrid).toBe(MuiDataGrid);
    expect(ThemeProvider).toBe(MuiThemeProvider);
    expect(useTheme).toBeDefined();
  });
});
