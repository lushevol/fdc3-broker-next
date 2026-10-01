import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '../src/primitives';
import { CheckCircleOutlined, PersonOutlined } from '../src/icons';
import { createTheme, type Theme } from '../src/theme';

// Host-owned sample contrast policy for raw MUI primitives, not package overrides.
const contrastPalette = createTheme({ palette: { contrastThreshold: 4.5 } }).palette;
const avatarSx = (theme: Theme) => ({
  bgcolor: theme.palette.primary.main,
  color: contrastPalette.getContrastText(theme.palette.primary.main),
});

const meta = {
  title: 'Foundation/Layout primitives',
  component: Paper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Exact MUI layout exports from ratan-design-origin/primitives. Resize the viewport and use the appearance toolbar to compare responsive layouts across all four themes.',
      },
    },
  },
} satisfies Meta<typeof Paper>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ResponsiveGrid: Story = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Responsive layout
      </Typography>
      <Grid container spacing={2}>
        {[12, 6, 6, 4, 4, 4].map((width, index) => (
          <Grid item xs={12} sm={width} key={index}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography>
                Panel {index + 1} · 12 columns on mobile, {width} on tablet
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  ),
};

export const StackAndDividers: Story = {
  render: () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2">
        Stack, Box and Divider
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        divider={<Divider orientation="vertical" flexItem />}
      >
        {['First', 'Second', 'Third'].map((label) => (
          <Box key={label} sx={{ p: 2, flex: 1, bgcolor: 'action.hover' }}>
            {label}
          </Box>
        ))}
      </Stack>
      <Divider textAlign="left">Named section</Divider>
      <Typography>
        Rows become a column on narrow viewports. Box accepts semantic elements and responsive sx.
      </Typography>
    </Stack>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2">
        Paper elevations and borders
      </Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
        {[0, 1, 4, 8].map((elevation) => (
          <Paper key={elevation} elevation={elevation} sx={{ p: 3 }}>
            Elevation {elevation}
          </Paper>
        ))}
        <Paper variant="outlined" sx={{ p: 3 }}>
          Outlined
        </Paper>
        <Paper variant="outlined" square sx={{ p: 3 }}>
          Square
        </Paper>
      </Stack>
    </Stack>
  ),
};

const mediaIllustration = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="240" viewBox="0 0 640 240"><rect width="640" height="240" fill="#0b5278"/><circle cx="500" cy="80" r="120" fill="#047b98"/><path d="M0 240L240 40L400 240" fill="#85c4dd"/></svg>')}`;
export const CardsAndMedia: Story = {
  render: () => (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 320 }}>
        <CardMedia
          component="img"
          image={mediaIllustration}
          height="120"
          alt="Abstract blue geometric landscape"
        />
        <CardContent>
          <Typography variant="h6" component="h2">
            Image card
          </Typography>
          <Typography paragraph>
            Self-contained media and content using an embedded illustration.
          </Typography>
          <Button variant="outlined">Explore example</Button>
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ maxWidth: 320 }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={avatarSx} role="img" aria-label="Example user">
              AL
            </Avatar>
            <Typography variant="h6" component="h2">
              Outlined card
            </Typography>
          </Stack>
          <Typography sx={{ mt: 2 }}>
            Cards can combine text, avatars and actions without application dependencies.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  ),
};

export const TypographyScale: Story = {
  render: () => (
    <Stack spacing={1} sx={{ p: 3 }}>
      {(
        [
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'subtitle1',
          'subtitle2',
          'body1',
          'body2',
          'caption',
          'overline',
        ] as const
      ).map((variant) => (
        <Typography key={variant} variant={variant} component="div">
          {variant} · The quick brown fox 0123456789
        </Typography>
      ))}
      <Typography
        noWrap
        sx={{ maxWidth: 260 }}
        title="This long line is truncated only visually, preserving its complete accessible text."
      >
        This long line is truncated only visually, preserving its complete accessible text.
      </Typography>
      <Typography color="text.secondary">
        Secondary text follows the selected appearance.
      </Typography>
    </Stack>
  ),
};

function IdentityAndTagsDemo() {
  const [tags, setTags] = React.useState(['Removable', 'Another tag']);
  const [selected, setSelected] = React.useState(false);
  return (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar sx={avatarSx} role="img" aria-label="Initials avatar">
          AL
        </Avatar>
        <Avatar sx={avatarSx} role="img" variant="rounded" aria-label="Rounded avatar">
          <PersonOutlined />
        </Avatar>
        <Avatar
          role="img"
          variant="square"
          sx={[avatarSx, { width: 56, height: 56 }]}
          aria-label="Square avatar"
        >
          XY
        </Avatar>
      </Stack>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={1}>
        {(['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'] as const).map(
          (color) => (
            <Chip
              key={color}
              color={color}
              label={color}
              sx={
                color === 'default'
                  ? undefined
                  : (theme) => ({
                      color: contrastPalette.getContrastText(theme.palette[color].main),
                    })
              }
            />
          ),
        )}
      </Stack>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        <Chip label="Outlined small" size="small" variant="outlined" />
        <Chip label="Disabled action" clickable disabled />
        <Chip label="With icon" icon={<CheckCircleOutlined />} />
        <Chip
          label={selected ? 'Selected' : 'Click to select'}
          aria-pressed={selected}
          color={selected ? 'primary' : 'default'}
          onClick={() => setSelected(!selected)}
        />
        {tags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            onDelete={() => setTags(tags.filter((item) => item !== tag))}
          />
        ))}
        <Button onClick={() => setTags(['Removable', 'Another tag'])}>Reset tags</Button>
      </Stack>
    </Stack>
  );
}
export const AvatarsAndChips: Story = {
  render: () => <IdentityAndTagsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Raw primitive samples use host-owned Avatar colors and a 4.5 contrastThreshold for filled Chip text. This demonstrates supported sx customization without changing historical package themes. The disabled example is an unavailable action, not a faded informational tag.',
      },
    },
  },
};
