import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Input, Label, LabelMenuItem, ResetButton, SearchInput, Select } from '../src';
import { Box, Chip, Divider, InputAdornment, MenuItem, Stack, Typography } from '../src/primitives';
import { Add, PersonOutlined } from '../src/icons';

const variants = ['outlined', 'filled', 'standard'] as const;
const fieldGridSx = {
  display: 'grid',
  gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
  gap: 3,
} as const;
const options = ['Alpha', 'Beta', 'Gamma'];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack spacing={2}>
      <Typography component="h2" variant="h6">
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

const meta = {
  title: 'Components/Fields',
  component: Input,
  subcomponents: { Select, SearchInput, Label, LabelMenuItem },
  tags: ['autodocs'],
  args: {
    label: 'Display name',
    variant: 'outlined',
    labelPosition: 'top',
    size: 'small',
    placeholder: 'Enter a name',
    helperText: 'A short, descriptive name',
    disabled: false,
    required: false,
    error: false,
    fullWidth: true,
  },
  argTypes: {
    label: { control: 'text' },
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
    labelPosition: { control: 'inline-radio', options: ['top', 'left'] },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    multiline: { control: 'boolean' },
    rows: { control: { type: 'number', min: 1, max: 6 } },
    hidden: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
    onChange: { action: 'changed' },
    onBlur: { action: 'blurred' },
    onFocus: { action: 'focused' },
    inputRef: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Form building blocks with MUI 5 props. Input additionally bridges slotProps to the legacy InputProps/inputProps API; explicit slot values win. All controls are named, keep host-owned validation/state outside the package, and follow the selected toolbar appearance.',
      },
    },
  },
  decorators: [
    (Story) => (
      <Box sx={{ p: 3, maxWidth: '64rem' }}>
        <Story />
      </Box>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const InputVariantsSizesAndLabelPositions: Story = {
  render: () => (
    <Stack spacing={4}>
      {variants.map((variant) => (
        <Section key={variant} title={`${variant} fields`}>
          <Box sx={fieldGridSx}>
            {(['small', 'medium'] as const).flatMap((size) =>
              (['top', 'left'] as const).map((labelPosition) => (
                <Input
                  key={`${size}-${labelPosition}`}
                  variant={variant}
                  size={size}
                  labelPosition={labelPosition}
                  label={`${size} / ${labelPosition}`}
                  defaultValue="Editable value"
                  helperText="Visible associated helper text"
                  fullWidth
                />
              )),
            )}
          </Box>
        </Section>
      ))}
    </Stack>
  ),
  parameters: { controls: { disable: true } },
};

export const InputValidationAndAvailability: Story = {
  render: () => (
    <Box sx={fieldGridSx}>
      <Input variant="outlined" label="Required value" required helperText="A value is required" />
      <Input
        variant="outlined"
        label="Invalid value"
        required
        error
        defaultValue="Incomplete"
        helperText="Enter at least three words"
      />
      <Input variant="outlined" label="Disabled empty" disabled placeholder="Unavailable" />
      <Input
        variant="outlined"
        label="Disabled populated"
        disabled
        defaultValue="Preserved value"
      />
      <Input
        variant="outlined"
        label="Read-only value"
        defaultValue="Selectable and focusable"
        slotProps={{ input: { readOnly: true } }}
        helperText="Read-only fields remain keyboard focusable"
      />
      <Input
        variant="outlined"
        label="Required read-only"
        required
        defaultValue="Fixed value"
        inputProps={{ readOnly: true }}
      />
      <Input
        variant="outlined"
        label="Legacy disabled, slot enabled"
        disabled
        InputProps={{ disabled: true }}
        slotProps={{ input: { disabled: false }, htmlInput: { required: true } }}
        helperText="Modern slot values take precedence"
      />
      <Input
        variant="outlined"
        label="Native slot disabled"
        slotProps={{ htmlInput: { disabled: true } }}
        defaultValue="Disabled through slotProps"
      />
    </Box>
  ),
  parameters: { controls: { disable: true } },
};

export const InputAdornmentsTypesAndMultiline: Story = {
  render: () => (
    <Box sx={fieldGridSx}>
      <Input
        variant="outlined"
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="name@example.test"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlined />
              </InputAdornment>
            ),
          },
        }}
      />
      <Input
        variant="outlined"
        label="Distance"
        type="number"
        defaultValue="12"
        slotProps={{
          input: { endAdornment: <InputAdornment position="end">km</InputAdornment> },
          htmlInput: { min: 0, step: 0.5 },
        }}
      />
      <Input
        variant="outlined"
        label="Website"
        defaultValue="example.test"
        slotProps={{
          input: {
            startAdornment: <InputAdornment position="start">https://</InputAdornment>,
            endAdornment: <InputAdornment position="end">/</InputAdornment>,
          },
        }}
      />
      <Input
        variant="outlined"
        label="Password"
        type="password"
        autoComplete="new-password"
        defaultValue="sample-only"
        helperText="Example text only"
      />
      <Input
        variant="outlined"
        label="Fixed-height notes"
        multiline
        rows={3}
        defaultValue={'First line\nSecond line\nThird line'}
      />
      <Input
        variant="outlined"
        label="Growing notes"
        multiline
        minRows={2}
        maxRows={5}
        helperText="Grows to five lines, then scrolls"
      />
      <Input
        variant="outlined"
        label="A longer descriptive field label for a narrow layout"
        defaultValue="A long editable value remains contained in the input"
        helperText="Helper text can wrap across several lines without hiding the field or its accessible label."
      />
      <Input
        variant="outlined"
        label="Character limit"
        slotProps={{ htmlInput: { maxLength: 12 }, formHelperText: { component: 'p' } }}
        helperText="Maximum 12 characters"
      />
    </Box>
  ),
  parameters: { controls: { disable: true } },
};

function InputRefsDemo() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const nativeRef = React.useRef<HTMLInputElement>(null);
  const [visible, setVisible] = React.useState(true);
  const [report, setReport] = React.useState('Refs have not been inspected.');
  const [value, setValue] = React.useState('Select this text');
  return (
    <Stack spacing={2}>
      <Input
        ref={rootRef}
        inputRef={nativeRef}
        variant="outlined"
        label="Ref target"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        hidden={!visible}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button
          onClick={() => {
            nativeRef.current?.focus();
            nativeRef.current?.select();
            setReport(
              `Root: ${rootRef.current?.tagName}; native: ${nativeRef.current?.tagName}; selected: ${nativeRef.current?.value}`,
            );
          }}
          disabled={!visible}
        >
          Focus and select via inputRef
        </Button>
        <Button onClick={() => setVisible((current) => !current)}>
          {visible ? 'Hide field' : 'Show field'}
        </Button>
      </Box>
      <Typography role="status">{report}</Typography>
      <Typography variant="body2">
        hidden retains the mounted value. The root ref targets the wrapper; inputRef targets the
        native input.
      </Typography>
    </Stack>
  );
}

export const InputRefsAndHiddenState: Story = {
  render: () => <InputRefsDemo />,
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Focus and select via inputRef' }));
    await expect(canvas.getByLabelText('Ref target')).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('Root: DIV; native: INPUT');
    await userEvent.click(canvas.getByRole('button', { name: 'Hide field' }));
    await expect(canvas.getByLabelText('Ref target')).not.toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show field' }));
    await expect(canvas.getByLabelText('Ref target')).toHaveValue('Select this text');
  },
};

function SelectMatrix() {
  const [value, setValue] = React.useState('Alpha');
  return (
    <Stack spacing={4}>
      {variants.map((variant) => (
        <Section key={variant} title={`${variant} selects`}>
          <Box sx={fieldGridSx}>
            {(['small', 'medium'] as const).flatMap((size) =>
              (['top', 'left'] as const).map((labelPosition) => (
                <Select
                  key={`${size}-${labelPosition}`}
                  variant={variant}
                  size={size}
                  labelPosition={labelPosition}
                  label={`${variant} ${size} ${labelPosition}`}
                  value={value}
                  onChange={(event) => setValue(String(event.target.value))}
                >
                  {options.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )),
            )}
          </Box>
        </Section>
      ))}
      <Typography role="status">Shared selection: {value}</Typography>
    </Stack>
  );
}

export const SelectVariantsSizesAndLabels: Story = {
  render: () => <SelectMatrix />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'All examples share controlled state so the selected option can be compared across sizes, variants and label placement. Menus portal into the active provider.',
      },
    },
  },
};

function SelectionModesDemo() {
  const [single, setSingle] = React.useState('');
  const [multiple, setMultiple] = React.useState<string[]>(['Alpha']);
  const [native, setNative] = React.useState('Beta');
  const selectRef = React.useRef<HTMLDivElement>(null);
  const [refResult, setRefResult] = React.useState('Ref not inspected');
  const updateMultiple = (value: unknown) =>
    setMultiple(typeof value === 'string' ? value.split(',') : (value as string[]));
  return (
    <Stack spacing={3}>
      <Box sx={fieldGridSx}>
        <Select
          ref={selectRef}
          label="Choose an option"
          variant="outlined"
          value={single}
          displayEmpty
          onChange={(event) => setSingle(String(event.target.value))}
          renderValue={(value) => (value ? String(value) : 'All options')}
        >
          <MenuItem value="">All options</MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
          <MenuItem value="unavailable" disabled>
            Unavailable option
          </MenuItem>
        </Select>
        <Select
          label="Multiple options"
          variant="outlined"
          multiple
          value={multiple}
          onChange={(event) => updateMultiple(event.target.value)}
          renderValue={(value) => (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {(value as string[]).map((option) => (
                <Chip key={option} label={option} size="small" />
              ))}
            </Box>
          )}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Select
          label="Native options"
          variant="outlined"
          native
          value={native}
          onChange={(event) => setNative(String(event.target.value))}
        >
          <optgroup label="Available">
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </optgroup>
          <optgroup label="Unavailable">
            <option value="archived" disabled>
              Archived
            </option>
          </optgroup>
        </Select>
        <Select
          label="Required selection"
          variant="outlined"
          required
          error
          value=""
          onChange={() => undefined}
        >
          <MenuItem value="">Choose an option</MenuItem>
          <MenuItem value="Alpha">Alpha</MenuItem>
        </Select>
        <Select label="Disabled selection" variant="outlined" disabled value="Alpha">
          <MenuItem value="Alpha">Alpha</MenuItem>
        </Select>
        <Select label="Read-only selection" variant="outlined" readOnly value="Beta">
          <MenuItem value="Beta">Beta</MenuItem>
        </Select>
        <Select label="Long option" variant="outlined" defaultValue="long" sx={{ minWidth: 0 }}>
          <MenuItem value="long">A longer option name that remains inside its field</MenuItem>
          <MenuItem value="short">Short option</MenuItem>
        </Select>
      </Box>
      <Button
        onClick={() => {
          selectRef.current?.focus();
          setRefResult(`Public ref focus() called: ${Boolean(selectRef.current)}`);
        }}
      >
        Focus select by ref
      </Button>
      <Typography role="status">
        Single: {single || 'all'}; multiple: {multiple.join(', ') || 'none'}; native: {native}.{' '}
        {refResult}
      </Typography>
      <Typography variant="body2">
        Custom selects support arrow-key navigation, Enter selection and Escape dismissal. Native
        selects follow browser keyboard behavior. Required and error flags are presentation; the
        host supplies validation policy.
      </Typography>
    </Stack>
  );
}

export const SelectModesAvailabilityAndRef: Story = {
  render: () => <SelectionModesDemo />,
  parameters: { controls: { disable: true } },
};

function SearchInputDemo() {
  const [query, setQuery] = React.useState('Initial query');
  const [clears, setClears] = React.useState(0);
  const [readOnly, setReadOnly] = React.useState(false);
  return (
    <Stack spacing={3}>
      <SearchInput
        label="Search items"
        variant="outlined"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        handleClear={() => {
          setQuery('');
          setClears((count) => count + 1);
        }}
        clearButtonLabel="Clear item query"
        slotProps={{ input: { readOnly } }}
        helperText="Search and clear adornments are owned by SearchInput"
      />
      <Button onClick={() => setReadOnly((current) => !current)}>
        {readOnly ? 'Enable editing' : 'Make search read-only'}
      </Button>
      <Box sx={fieldGridSx}>
        <SearchInput
          label="Disabled search"
          variant="outlined"
          disabled
          value="Unavailable"
          handleClear={() => undefined}
        />
        <SearchInput
          label="Read-only search"
          variant="outlined"
          value="Fixed query"
          inputProps={{ readOnly: true }}
          handleClear={() => undefined}
        />
        <SearchInput
          label="Search with an error"
          variant="outlined"
          error
          required
          helperText="Enter a search phrase"
          value=""
          handleClear={() => undefined}
          onChange={() => undefined}
        />
        <SearchInput
          label="Localized clear label"
          variant="outlined"
          defaultValue="Sample query"
          clearButtonLabel="Effacer la recherche"
          handleClear={() => undefined}
          slotProps={{ input: { readOnly: true } }}
        />
      </Box>
      <Typography role="status">
        Query: {query || 'empty'}; clears: {clears}; read-only: {String(readOnly)}
      </Typography>
    </Stack>
  );
}

export const SearchInputClearAndAvailability: Story = {
  render: () => <SearchInputDemo />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'handleClear is a host callback; the host updates the controlled value. Disabled/read-only settings through either modern or legacy props also disable clear. Customize clearButtonLabel for each field or locale.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear item query' }));
    await expect(canvas.getByLabelText('Search items')).toHaveValue('');
    await userEvent.type(canvas.getByLabelText('Search items'), 'New query');
    await userEvent.click(canvas.getByRole('button', { name: 'Make search read-only' }));
    await expect(canvas.getByRole('button', { name: 'Clear item query' })).toBeDisabled();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Query: New query; clears: 1; read-only: true',
    );
  },
};

function CompactLabelDemo() {
  const [group, setGroup] = React.useState('Group by');
  const [sort, setSort] = React.useState('name');
  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3 }}>
        <Label
          label="Group by"
          value={group}
          onChange={(event) => setGroup(String(event.target.value))}
        >
          <LabelMenuItem value="Name">Name</LabelMenuItem>
          <LabelMenuItem value="Category">Category</LabelMenuItem>
          <LabelMenuItem value="Unavailable" disabled>
            Unavailable grouping
          </LabelMenuItem>
          <Divider />
          <LabelMenuItem value="Created" divider>
            <Add fontSize="small" sx={{ mr: 1 }} />
            Created date
          </LabelMenuItem>
        </Label>
        <Label
          label="Sort"
          aria-label="Sort direction"
          value={sort}
          onChange={(event) => setSort(String(event.target.value))}
        >
          <LabelMenuItem value="name">Name ascending</LabelMenuItem>
          <LabelMenuItem value="recent">Most recent first</LabelMenuItem>
        </Label>
        <Label label="Unavailable grouping" disabled>
          <LabelMenuItem value="Name">Name</LabelMenuItem>
        </Label>
      </Box>
      <Typography role="status">
        Group: {group}; sort: {sort}
      </Typography>
      <Typography variant="body2">
        Label renders a compact selector, with a disabled menu heading and a hidden placeholder
        matching its label. LabelMenuItem accepts ordinary menu-item props, icons, disabled state
        and dividers. Explicit ARIA naming overrides the label-derived name.
      </Typography>
    </Stack>
  );
}

export const LabelAndMenuItemCombinations: Story = {
  render: () => <CompactLabelDemo />,
  parameters: { controls: { disable: true } },
};

function ControlledFormDemo() {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [attempted, setAttempted] = React.useState(false);
  const [result, setResult] = React.useState('Nothing submitted');
  const nameInvalid = attempted && name.trim().length === 0;
  const categoryInvalid = attempted && category.length === 0;
  return (
    <Stack
      component="form"
      noValidate
      spacing={3}
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
        setResult(
          name.trim() && category
            ? `Submitted: ${name.trim()} / ${category}`
            : 'Complete the required fields',
        );
      }}
      onReset={() => {
        setName('');
        setCategory('');
        setAttempted(false);
        setResult('Form reset');
      }}
    >
      <Input
        variant="outlined"
        label="Item name"
        value={name}
        required
        error={nameInvalid}
        helperText={nameInvalid ? 'Enter an item name' : 'Required'}
        onChange={(event) => setName(event.target.value)}
      />
      <Select
        variant="outlined"
        label="Item category"
        value={category}
        required
        error={categoryInvalid}
        onChange={(event) => setCategory(String(event.target.value))}
      >
        <MenuItem value="">Choose a category</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button type="submit" variant="contained">
          Submit values
        </Button>
        <ResetButton type="reset">Reset values</ResetButton>
      </Box>
      <Typography role="status">{result}</Typography>
    </Stack>
  );
}

export const ControlledFormValidationAndReset: Story = {
  render: () => <ControlledFormDemo />,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'A local controlled form illustrates validation, submission and reset without embedding business rules in the shared components. Error messages and result state are observable.',
      },
    },
  },
};
