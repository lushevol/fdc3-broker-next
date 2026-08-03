import {
  aTimeout,
  fixture,
  fixtureCleanup,
  html,
  oneEvent,
} from '@open-wc/testing';
import '../../../elements/sc-dropdown-input.js';
import { pieceOfHtml } from './utils.js';
import { visualDiff } from '../../shared/visualDiff.js';
import {
  moveMouseOnElement,
} from '../../shared/simulation.js';
import { setViewport } from '@web/test-runner-commands';

describe('dropdown visual testing', () => {
  const menuItemLength = 10;
  afterEach(async () => {
    fixtureCleanup();
    await aTimeout(100);
  });
  beforeEach(async () => {
    setViewport({ width: 1080, height: 800 });
  });

  it('label', async () => {
    const el = await fixture<HTMLElement>(html`
      <div>
        <sc-dropdown-input label="here is label" label-size="xxs">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" label-size="xs">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" label-size="sm">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" label-size="md">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" label-size="lg">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
      </div>
    `);
    await aTimeout(10);
    
    await visualDiff(
      el,
      'dropdown-visual-testing-label'
    );
  });

  it('tooltip', async () => {
    const el = await fixture<HTMLElement>(html`
      <div>
        <sc-dropdown-input
          label="here is label"
          label-size="xxs"
          tooltip="tooltip here"
          tooltip-placement="right"
        >
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
      </div>
    `);
    const trigger = el.querySelector('sc-dropdown-input')?.input;
    const label = trigger?.shadowRoot?.querySelector('sc-label');
    const tooltip = label?.shadowRoot?.querySelector('sc-tooltip') as HTMLElement;
    const tooltipIcon = tooltip.querySelector('sc-icon') as HTMLElement;
    const afterShowTooltip = oneEvent(tooltip, 'sl-after-show');
    await aTimeout(50);
    moveMouseOnElement(tooltipIcon);
    await afterShowTooltip;
    await aTimeout(0);

    
    await visualDiff(
      el,
      'dropdown-visual-testing-tooltip'
    );
  });

  it('status', async () => {
    const el = await fixture<HTMLElement>(html`
      <div>
        <sc-dropdown-input
          label="here is label"
          success
          success-message="success"
        >
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" error error-message="error">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" disabled>
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" readonly value="0">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" required>
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" help-text="help-text">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
      </div>
    `);

    await aTimeout(100);
    await visualDiff(
      el,
      'dropdown-visual-testing-status'
    );
  });

  
  it('border', async () => {
    const el = await fixture<HTMLElement>(html`
      <div>
        <sc-dropdown-input label="here is label" border-type="line">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
        <sc-dropdown-input label="here is label" border-type="box">
          ${pieceOfHtml(menuItemLength)}
        </sc-dropdown-input>
      </div>
    `);

    await aTimeout(10);
    
    await visualDiff(
      el,
      'dropdown-visual-testing-border'
    );
  });
});
