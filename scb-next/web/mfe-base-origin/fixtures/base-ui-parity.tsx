import React from 'react';
import { createRoot } from 'react-dom/client';
import dayjs from 'dayjs';
import DatePicker from '../src/components/DatePicker';
import TimePicker from '../src/components/TimePicker';
import DateTimePicker from '../src/components/DateTimePicker';
import ThemeProvider from '../src/theme/Provider';
import Config from '../src/theme/Config';
import { getTheme } from '../src/theme/config/utils';

const params = new URLSearchParams(window.location.search);
const mode = params.get('mode') === 'light' ? 'light' : 'dark';
const webkit = params.get('generation') === 'webkit';
const { config } = Config(getTheme(mode, webkit));
document.documentElement.className = webkit ? `${mode} sc-mode-${mode}` : mode;

function PickerFixture() {
  const [value, setValue] = React.useState(dayjs('2024-07-17T14:30:00'));
  const [lastChange, setLastChange] = React.useState('');
  const onChange = (next: dayjs.Dayjs | null) => {
    if (next) setValue(next);
    setLastChange(next?.format('YYYY-MM-DD HH:mm') ?? 'null');
  };
  return <ThemeProvider theme={config}>
    <main style={{ padding: 24, display: 'grid', gap: 24, width: 400 }}>
      <DatePicker label="Value date" value={value} onChange={onChange} />
      <TimePicker label="Settlement time" value={value} onChange={onChange} />
      <DateTimePicker label="Settlement date and time" value={value} onChange={onChange} />
      <output aria-label="Last change">{lastChange}</output>
    </main>
  </ThemeProvider>;
}

createRoot(document.getElementById('root')!).render(<PickerFixture />);
