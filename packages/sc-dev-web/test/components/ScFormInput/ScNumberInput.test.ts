import { html } from 'lit';
import { elementUpdated, fixture, expect } from '@open-wc/testing';
import { ScNumberInput } from '../../../src/components/ScFormInput/ScNumberInput.js';
import '../../../elements/sc-number-input.js';

describe('ScNumberInput', () => {
  it('renders default value input', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input label="Default value input label"></sc-number-input>`
    );
    expect(el.label).to.equal('Default value input label');
  });

  it('renders help text', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input help-text="This is help message">
        Value input with help message
        <div slot="help">This is help message</div>
      </sc-number-input>`
    );
    expect(el.helpText).to.equal('This is help message');
    expect(el.innerHTML.includes('This is help message')).to.equal(true);
  });

  it('renders help text by slot', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input>
        Value input with help message
        <div slot="help">This is help message</div>
      </sc-number-input>`
    );
    expect(el.innerHTML.includes('This is help message')).to.equal(true);
  });

  it('renders error text', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input error error-message="This is error message">
        Default text input label
      </sc-number-input>`
    );
    expect(el.errorMessage).to.equal('This is error message');
    expect(el.error).to.equal(true);
  });

  it('renders success text', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input success>
        Default text input label
        <div slot="success">This is success message</div>
      </sc-number-input>`
    );
    expect(el.success).to.equal(true);
  });

  it('renders min and max input', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input min="10" max="100">
        Value input with min and max
      </sc-number-input>`
    );
    expect(el.min).to.equal(10);
    expect(el.max).to.equal(100);
  });


  it('renders readonly status', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input readonly>
        Default text input label
      </sc-number-input>`
    );
    expect(el.readonly).to.equal(true);
  });

  it('arrow click', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input>
        Default text input label
      </sc-number-input>`
    );
    const arrowUpEle: HTMLElement | null | undefined = el.shadowRoot?.querySelector('.arrow-up');
    arrowUpEle?.click();
    await elementUpdated(el);
    expect(el.value).to.equal('1');
    const arrowDownEle: HTMLElement | null | undefined = el.shadowRoot?.querySelector('.arrow-down');
    arrowDownEle?.click();
    await elementUpdated(el);
    expect(el.value).to.equal('0');
  });

  it('renders number type input', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="number"></sc-number-input>`
    );
    expect(el.type).to.equal('number');
  });

  it('renders digit type input', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="digit"></sc-number-input>`
    );
    expect(el.type).to.equal('digit');
  });

  it('renders digit type input and less than 2 decimal places', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="digit" max-decimals=2 value=3.1415></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    expect(input?.value).to.equal('3.14');
  });

  it('renders digit type input and unique decimal places', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="digit" max-decimals=10 value=3.14.12.34.45></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    expect(input?.value).to.equal('3.14123445');
  });

  it('renders digit type input and format special characters', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="digit" max-decimals=10 value=3.14.0["'9></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    expect(input?.value).to.equal('3.1409');
  });

  it('renders digit type input and automatically add 0 at the beginning of the decimal place', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="digit" max-decimals=10 value=.1234></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    expect(input?.value).to.equal('0.1234');
  });

  it('Automatically clear value when changing input types', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="number" max-decimals=0 value='22'></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    el.type = 'digit';
    await elementUpdated(el);
    await el.updateComplete;
    expect(input?.value).to.equal('');
  });

  it('control value from input keydown', async () => {
    const el = await fixture<ScNumberInput>(html` <sc-number-input type="digit" max-decimals="3" min="-10"></sc-number-input>`);

    await el.updateComplete;
    const input = el.formControl;
    const cancelable = true;
    expect(input).to.exist;
    if (input) {
      input.value = '';
      let res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: 'a' }));
      expect(res).to.equal(false);

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '-' }));
      expect(res).to.equal(true);
      input.value = '-';

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '2' }));
      expect(res).to.equal(true);
      input.value = '-2';

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '.' }));
      expect(res).to.equal(true);
      input.value = '-2.';

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '3' }));
      expect(res).to.equal(true);
      input.value = '-2.3';

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: 'c', ctrlKey: true }));
      expect(res).to.equal(true);

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '*' }));
      expect(res).to.equal(false);

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '4' }));
      expect(res).to.equal(true);
      input.value = '-2.34';

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '.' }));
      expect(res).to.equal(false);

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '-' }));
      expect(res).to.equal(false);

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '5' }));
      expect(res).to.equal(true);
      input.value = '-2.345';

      res = input.dispatchEvent(new KeyboardEvent('keydown', { cancelable, key: '6' }));
      expect(res).to.equal(false);
    }
  });

  it('watch value', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="digit" max-decimals=2 value='22.555'></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    expect(input?.value).to.equal('22.55');
    el.value = '1.6789';
    await elementUpdated(el);
    await el.updateComplete;
    expect(input?.value).to.equal('1.67');
  });

  it('watch max decimals', async () => {
    const el = await fixture<ScNumberInput>(
      html` <sc-number-input type="digit" max-decimals=3 value='22.55555'></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    expect(input?.value).to.equal('22.555');
    el.maxDecimals = 1;
    await elementUpdated(el);
    await el.updateComplete;
    expect(input?.value).to.equal('22.5');
  });

  it('value clamps to max and min, allows clear and negative sign', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input min="10" max="99"></sc-number-input>`
    );
    el.value = '55';
    expect(el.value).to.equal('55');

    el.value = '123';
    await el.updateComplete;
    expect(el.value).to.equal('99');

    el.value = '5';
    await el.updateComplete;
    expect(el.value).to.equal('10');

    (el as any).min = -100;
    await el.updateComplete;
    el.value = '-';
    expect(el.value).to.equal('-');
  });

  it('input listener for number input', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input></sc-number-input>`
    );
    const input: HTMLInputElement | null | undefined = el.shadowRoot?.querySelector('input');
    expect(input).to.exist;
    if (!input) return;

    input.value = '42';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.value).to.equal('42');
  });

  it('strips leading zeros from integer value set programmatically (007 => 7)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number"></sc-number-input>`
    );
    el.value = '007';
    await elementUpdated(el);
    expect(el.value).to.equal('7');
  });

  it('collapses multiple zeros to a single zero (000 => 0)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number"></sc-number-input>`
    );
    el.value = '000';
    await elementUpdated(el);
    expect(el.value).to.equal('0');
  });

  it('strips leading zeros for digit type (0012.3 => 12.3)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="1"></sc-number-input>`
    );
    el.value = '0012.3';
    await elementUpdated(el);
    expect(el.value).to.equal('12.3');
  });

  it('preserves a single leading zero before the decimal point (0.5 stays 0.5)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="1"></sc-number-input>`
    );
    el.value = '0.5';
    await elementUpdated(el);
    expect(el.value).to.equal('0.5');
  });

  it('does not block typing 0 as first character when type is digit and min is 0.01', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="2" min="0.01"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    // Empty field — typing '0' should not be cancelled even though 0 < min (0.01)
    input.value = '';
    const notCancelled = input.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, key: '0', bubbles: true })
    );
    expect(notCancelled).to.equal(true);
  });

  it('does not immediately clamp value 0 to min while input is focused (digit type, min=0.01)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="2" min="0.01"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    // Focus the input (marks it as actively being edited)
    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await el.updateComplete;

    // Simulate typng '0' — value should stay as intermediate '0', not jump to min
    el.value = '0';
    await elementUpdated(el);

    expect(el.value).to.equal('0');
  });

  it('clamps value to min on blur when final value is below min (digit type, min=0.01)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="2" min="0.01"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await el.updateComplete;

    el.value = '0';
    await elementUpdated(el);

    // User leaves the field without finishing — onBlur must enforce min
    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await elementUpdated(el);

    expect(el.value).to.equal('0.01');
  });

  // ── Arrow button — event emission ────────────────────────────────────────

  it('emits sc-input event with the incremented value when arrow-up is clicked', async () => {
    const el = await fixture<ScNumberInput>(html`<sc-number-input></sc-number-input>`);
    let emittedValue: unknown;
    el.addEventListener('sc-input', (e: Event) => {
      emittedValue = (e as CustomEvent).detail.value;
    });

    const arrowUp = el.shadowRoot?.querySelector('.arrow-up') as HTMLElement;
    arrowUp?.click();
    await elementUpdated(el);

    expect(emittedValue).to.not.equal(undefined);
    expect(Number(emittedValue)).to.equal(1);
  });

  it('emits sc-input event with the decremented value when arrow-down is clicked', async () => {
    const el = await fixture<ScNumberInput>(html`<sc-number-input></sc-number-input>`);
    let emittedValue: unknown;
    el.addEventListener('sc-input', (e: Event) => {
      emittedValue = (e as CustomEvent).detail.value;
    });

    const arrowDown = el.shadowRoot?.querySelector('.arrow-down') as HTMLElement;
    arrowDown?.click();
    await elementUpdated(el);

    expect(emittedValue).to.not.equal(undefined);
    expect(Number(emittedValue)).to.equal(-1);
  });

  // ── Arrow button — boundary enforcement ──────────────────────────────────

  it('arrow-up does not exceed the max boundary', async () => {
    const el = await fixture<ScNumberInput>(html`<sc-number-input max="5"></sc-number-input>`);
    el.value = '5';
    await elementUpdated(el);

    const arrowUp = el.shadowRoot?.querySelector('.arrow-up') as HTMLElement;
    arrowUp?.click();
    await elementUpdated(el);

    expect(Number(el.value)).to.equal(5);
  });

  it('arrow-down does not go below the min boundary', async () => {
    const el = await fixture<ScNumberInput>(html`<sc-number-input min="0"></sc-number-input>`);
    el.value = '0';
    await elementUpdated(el);

    const arrowDown = el.shadowRoot?.querySelector('.arrow-down') as HTMLElement;
    arrowDown?.click();
    await elementUpdated(el);

    expect(Number(el.value)).to.equal(0);
  });

  it('arrow-up from empty field starts from (min + 1) when min is set', async () => {
    const el = await fixture<ScNumberInput>(html`<sc-number-input min="5"></sc-number-input>`);
    await el.updateComplete;

    const arrowUp = el.shadowRoot?.querySelector('.arrow-up') as HTMLElement;
    arrowUp?.click();
    await elementUpdated(el);

    expect(Number(el.value)).to.equal(6);
  });

  it('arrow-down from empty field starts from (max - 1) when max is set', async () => {
    const el = await fixture<ScNumberInput>(html`<sc-number-input max="10"></sc-number-input>`);
    await el.updateComplete;

    const arrowDown = el.shadowRoot?.querySelector('.arrow-down') as HTMLElement;
    arrowDown?.click();
    await elementUpdated(el);

    expect(Number(el.value)).to.equal(9);
  });

  it('arrow-up floors a non-integer decimal value before incrementing (3.7 => 4)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="1"></sc-number-input>`
    );
    el.value = '3.7';
    await elementUpdated(el);

    const arrowUp = el.shadowRoot?.querySelector('.arrow-up') as HTMLElement;
    arrowUp?.click();
    await elementUpdated(el);

    expect(Number(el.value)).to.equal(4);
  });

  it('does not render arrow controls when hide-arrows is set', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input hide-arrows></sc-number-input>`
    );
    await el.updateComplete;

    const arrows = el.shadowRoot?.querySelector('.arrows');
    const arrowUp = el.shadowRoot?.querySelector('.arrow-up');
    const arrowDown = el.shadowRoot?.querySelector('.arrow-down');

    expect(arrows).to.equal(null);
    expect(arrowUp).to.equal(null);
    expect(arrowDown).to.equal(null);
  });

  it('blocks a digit that would exceed max for type=number', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number" max="4"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.value = '';
    const notCancelled = input.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, key: '5', bubbles: true })
    );
    expect(notCancelled).to.equal(false);
  });

  it('blocks a digit that would fall below min for type=number', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number" min="5"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.value = '';
    const notCancelled = input.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, key: '3', bubbles: true })
    );
    expect(notCancelled).to.equal(false);
  });

  it('allows a digit within min/max range for type=number', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number" min="1" max="9"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.value = '';
    const notCancelled = input.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, key: '5', bubbles: true })
    );
    expect(notCancelled).to.equal(true);
  });

  it('blocks a decimal point when type is digit and maxDecimals is 0', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="0"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.value = '3';
    const notCancelled = input.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, key: '.', bubbles: true })
    );
    expect(notCancelled).to.equal(false);
  });

  it('allows a decimal point when type is digit and maxDecimals is greater than 0', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="2"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.value = '3';
    const notCancelled = input.dispatchEvent(
      new KeyboardEvent('keydown', { cancelable: true, key: '.', bubbles: true })
    );
    expect(notCancelled).to.equal(true);
  });

  it('blur does not clamp a lone minus sign (NaN) even when min is set', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number" min="-100"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    el.value = '-';
    await elementUpdated(el);

    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await elementUpdated(el);

    expect(el.value).to.equal('-');
  });

  it('blur does not re-clamp when value is exactly at min', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number" min="5"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    el.value = '5';
    await elementUpdated(el);

    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await elementUpdated(el);

    expect(el.value).to.equal('5');
  });

  it('blur clamps to max when value exceeds max', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number" max="99"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    await el.updateComplete;

    el.value = '200';
    await elementUpdated(el);

    input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    await elementUpdated(el);

    expect(el.value).to.equal('99');
  });

  it('clamps digit type value to min immediately on programmatic set when not focused', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="2" min="0.01"></sc-number-input>`
    );
    await el.updateComplete;

    // No focus event dispatched — watcher must apply min clamp
    el.value = '0';
    await elementUpdated(el);

    expect(el.value).to.equal('0.01');
  });

  it('strips leading zeros from a negative integer value set programmatically (-007 => -7)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="number"></sc-number-input>`
    );
    el.value = '-007';
    await elementUpdated(el);

    expect(el.value).to.equal('-7');
  });

  it('sc-input event carries the trimmed value after maxDecimals forces a trim', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="3" value="22.555"></sc-number-input>`
    );
    await el.updateComplete;

    let lastEmittedValue: unknown;
    el.addEventListener('sc-input', (e: Event) => {
      lastEmittedValue = (e as CustomEvent).detail.value;
    });

    el.maxDecimals = 1;
    await elementUpdated(el);

    expect(lastEmittedValue).to.equal('22.5');
  });

  it('trims all decimal places when maxDecimals is 0 (3.14 => 3)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="0"></sc-number-input>`
    );
    el.value = '3.14';
    await elementUpdated(el);
    expect(el.value).to.equal('3');
  });

  it('bare decimal value becomes integer 0 when maxDecimals is 0 (.1234 => 0)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="0"></sc-number-input>`
    );
    el.value = '.1234';
    await elementUpdated(el);
    expect(el.value).to.equal('0');
  });

  it('keeps unlimited decimals when maxDecimals is not set (digit type)', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit"></sc-number-input>`
    );
    el.value = '3.14159265';
    await elementUpdated(el);
    expect(el.value).to.equal('3.14159265');
  });

  it('keeps cursor after the typed digit when a leading zero is stripped (digit type, negative)', async () => {
    // Scenario: value is '-0.0', cursor between '-0' and '.0', user types '7'
    // DOM becomes '-07.0'; after stripping the leading zero → '-7.0'
    // Cursor should land at position 2 (after '-7'), not position 3 (after '.')
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="1" min="-99"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    // Simulate the DOM state that exists the instant the input event fires:
    // the raw user-typed string, before any normalisation
    input.value = '-07.0';
    input.setSelectionRange(3, 3); // cursor after '-07', before '.'

    // Trigger the watcher the same way bindEvents does
    el.value = '-07.0';
    await elementUpdated(el);

    expect(el.value).to.equal('-7.0');
    // length delta: '-7.0'(4) - '-07.0'(5) = -1 → 3 + (-1) = 2
    expect(input.selectionEnd).to.equal(2);
  });

  it('keeps cursor after the typed digit when a leading zero is stripped (digit type, positive)', async () => {
    // Scenario: value is '0.0', cursor between '0' and '.0', user types '5'
    // DOM becomes '05.0'; after stripping the leading zero → '5.0'
    // Cursor should land at position 1 (after '5'), not position 2 (after '.')
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="1"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.value = '05.0';
    input.setSelectionRange(2, 2); // cursor after '05', before '.'

    el.value = '05.0';
    await elementUpdated(el);

    expect(el.value).to.equal('5.0');
    // length delta: '5.0'(3) - '05.0'(4) = -1 → 2 + (-1) = 1
    expect(input.selectionEnd).to.equal(1);
  });

  it('moves cursor to end of value when the value is clamped to max', async () => {
    const el = await fixture<ScNumberInput>(
      html`<sc-number-input type="digit" max-decimals="1" max="5"></sc-number-input>`
    );
    await el.updateComplete;
    const input = el.formControl;
    expect(input).to.exist;
    if (!input) return;

    input.value = '9.0';
    input.setSelectionRange(1, 1); // cursor somewhere non-final

    el.value = '9.0';
    await elementUpdated(el);

    expect(el.value).to.equal('5.0');
    // clamped → cursor at end of '5.0'
    expect(input.selectionEnd).to.equal(3);
  });
});
