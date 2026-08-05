import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScOrgRole } from '../../../src/components/ScOrganisation/ScOrgRole.js';
import '../../../elements/sc-organisation.js';

describe('ScOrgRole', () => {
  it('renders default org role', async () => {
    const el = await fixture<ScOrgRole>(html`
      <sc-organisation-role
        id=1574871
        name='Masked, Kendall'
        title='Senior Manager'
        department='TSA PRJ SG DevOps'
        connection='{"open":true,"label":"21"}'
        email='haixi.zhao@sc.com'
        phone='12345'
      ></sc-organisation-role>
    `);
    expect(el.id).to.equal('1574871');
    expect(el.name).to.equal('Masked, Kendall');
    expect(el.title).to.equal('Senior Manager');
    expect(el.department).to.equal('TSA PRJ SG DevOps');
    expect(el.email).to.equal('haixi.zhao@sc.com');
    expect(el.phone).to.equal('12345');
    expect(JSON.stringify(el.connection)).to.equal('{"open":true,"label":"21"}');
  });

  it('renders customFields', async () => {
    const el = await fixture<ScOrgRole>(html`
      <sc-organisation-role
        id=1574871
        name='Masked, Kendall'
        title='Senior Manager'
        .customFields=${[{
    text: 'Custom text',
  },
  {
    icon: 'home--line',
    text: html`<sc-link class=view-more>View more</sc-link>`,
  }]}
      ></sc-organisation-role>
    `);
    // @ts-ignore
    expect(Array.from(el.shadowRoot?.querySelectorAll('.view-more')).length).to.equal(1);
  });

  it('renders customCard', async () => {
    const el = await fixture<ScOrgRole>(html`
      <sc-organisation-role
        .customCard=${html`<div class=custom-card></div>`}
      ></sc-organisation-role>
    `);
    // @ts-ignore
    expect(Array.from(el.shadowRoot?.querySelectorAll('.custom-card')).length).to.equal(1);
  });
});