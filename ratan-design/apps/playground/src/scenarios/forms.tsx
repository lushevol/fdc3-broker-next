import { useState } from 'react';
import { Button } from '@fm/ratan-design/button';
import { DatePicker } from '@fm/ratan-design/date-picker';
import { TextInput } from '@fm/ratan-design/text-input';

export function FormsScenario() {
  const [result, setResult] = useState('Not submitted');

  return (
    <section aria-labelledby="forms-heading">
      <h2 id="forms-heading">Native form lifecycle</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const values = new FormData(event.currentTarget);
          setResult(`${String(values.get('name'))} · ${String(values.get('date'))}`);
        }}
        onReset={() => setResult('Reset')}
      >
        <TextInput name="name" label="Trade name" defaultValue="Copper" required />
        <DatePicker name="date" label="Trade date" defaultValue="2026-08-06" />
        <div className="playground-actions">
          <Button type="submit" variant="primary">Submit</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </div>
      </form>
      <output aria-live="polite">{result}</output>
    </section>
  );
}
