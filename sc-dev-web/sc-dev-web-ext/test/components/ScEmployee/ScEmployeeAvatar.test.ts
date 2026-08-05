import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScEmployeeAvatar } from '../../../src/components/ScEmployee/ScEmployeeAvatar.js';
import '../../../elements/sc-employee.js';

describe('ScEmployeeAvatar', () => {
  it('renders default employee avatar', async () => {
    const el = await fixture<ScEmployeeAvatar>(html`<sc-employee-avatar id='1626487'></sc-employee-avatar>`);
    expect(el.id).to.equal('1626487');
    const tooltipEle = el.shadowRoot?.querySelector('sc-tooltip');
    expect(!!tooltipEle).to.equal(true);
    const avatarEle = tooltipEle?.querySelector('sc-avatar');
    expect(!!avatarEle).to.equal(true);
  });
});