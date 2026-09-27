import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MuiTextField from '@mui/material/TextField';
import MuiTabs from '@mui/material/Tabs';
import MuiPersonOutlined from '@mui/icons-material/PersonOutlined';
import { Box, Tabs, TextField } from '../src/primitives';
import { PersonOutlined } from '../src/icons';
import { styled } from '../src/theme';

describe('presentation compatibility exports', () => {
  it('keeps MUI component identity for existing host theme overrides and styles', () => {
    expect(TextField).toBe(MuiTextField);
    expect(Tabs).toBe(MuiTabs);
    expect(PersonOutlined).toBe(MuiPersonOutlined);
  });

  it('keeps native field semantics and MUI class selectors through styled roots', () => {
    const Root = styled(Box)({ '& .MuiTextField-root': { width: '100%' } });
    render(
      <Root>
        <TextField label="Username" variant="outlined" InputProps={{ startAdornment: <PersonOutlined /> }} />
      </Root>,
    );

    const input = screen.getByRole('textbox', { name: 'Username' });
    expect(input).toHaveClass('MuiInputBase-input');
    expect(input.closest('.MuiTextField-root')).toBeInTheDocument();
    expect(screen.getByTestId('PersonOutlinedIcon')).toBeInTheDocument();
  });
});
