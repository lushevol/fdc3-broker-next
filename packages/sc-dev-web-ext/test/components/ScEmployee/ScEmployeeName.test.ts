import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScEmployeeName } from '../../../src/components/ScEmployee/ScEmployeeName.js';
import '../../../elements/sc-employee.js';

describe('ScEmployeeName', () => {
  it('renders default employee name', async () => {
    const el = await fixture<ScEmployeeName>(html`<sc-employee-name id='1626487'></sc-employee-name>`);
    expect(el.id).to.equal('1626487');
    const tooltipEle = el.shadowRoot?.querySelector('sc-tooltip');
    expect(!!tooltipEle).to.equal(true);
  });
});