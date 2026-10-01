import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '../src/primitives';
import { Add, ExpandMore } from '../src/icons';

function NavigationDemo({
  scrollable = false,
  vertical = false,
}: {
  scrollable?: boolean;
  vertical?: boolean;
}) {
  const [selected, setSelected] = React.useState(0);
  const tabs = scrollable
    ? [
        'Overview',
        'Details',
        'History',
        'Preferences',
        'Accessibility',
        'Notifications',
        'Integrations',
      ]
    : ['Overview', 'Details', 'Unavailable'];
  const id = React.useId();
  return (
    <Box sx={{ p: 3, maxWidth: 720 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography component="h2" variant="h6" sx={{ flexGrow: 1 }}>
            Example navigation
          </Typography>
          <IconButton aria-label="Add a view" color="inherit">
            <Add />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: vertical ? 'flex' : 'block', mt: 2 }}>
        <Tabs
          value={selected}
          onChange={(_event, value: number) => setSelected(value)}
          orientation={vertical ? 'vertical' : 'horizontal'}
          variant={scrollable ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Example sections"
          sx={{ flexShrink: 0 }}
        >
          {tabs.map((label, index) => (
            <Tab
              key={label}
              label={label}
              id={`${id}-tab-${index}`}
              aria-controls={`${id}-panel-${index}`}
              disabled={label === 'Unavailable'}
            />
          ))}
        </Tabs>
        {tabs.map((label, index) => (
          <Box
            key={label}
            role="tabpanel"
            hidden={index !== selected}
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            sx={{ p: 2, minWidth: 0 }}
          >
            <Typography paragraph>{label} panel. Use arrow keys to move between tabs.</Typography>
            <Button>Action in {label.toLowerCase()}</Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
const meta = {
  title: 'Foundation/Navigation primitives',
  component: NavigationDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AppBarAndTabs: Story = { args: { scrollable: false, vertical: false } };
export const ScrollableTabs: Story = { args: { scrollable: true } };
export const VerticalTabs: Story = { args: { vertical: true } };

function AccordionDemo({ multiple = false }: { multiple?: boolean }) {
  const [expanded, setExpanded] = React.useState<string | false>('display');
  const id = React.useId();
  return (
    <Stack spacing={2} sx={{ p: 3, maxWidth: 680 }}>
      <Typography variant="h5" component="h2">
        {multiple ? 'Independent expansion' : 'One expanded section'}
      </Typography>
      <Box>
        {['display', 'keyboard', 'disabled'].map((name, index) => (
          <Accordion
            key={name}
            disabled={name === 'disabled'}
            {...(multiple
              ? { defaultExpanded: index === 0 }
              : {
                  expanded: expanded === name,
                  onChange: (_event: React.SyntheticEvent, next: boolean) =>
                    setExpanded(next ? name : false),
                })}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              id={`${id}-${name}-header`}
              aria-controls={`${id}-${name}-content`}
            >
              <Typography>{name[0].toUpperCase() + name.slice(1)} options</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                Settings content for {name}. Collapsing preserves the component state.
              </Typography>
              <Button variant="outlined">Edit {name}</Button>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Stack>
  );
}
export const ControlledAccordion: Story = { render: () => <AccordionDemo /> };
export const IndependentAccordions: Story = { render: () => <AccordionDemo multiple /> };
