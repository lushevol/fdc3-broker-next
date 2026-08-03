import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScOrgTeam } from '../../../src/components/ScOrganisation/ScOrgTeam.js';
import '../../../elements/sc-organisation.js';

describe('ScOrgTeam', () => {
  const roles = [
    {
      id: '1577986',
      name: 'Sulistyo',
      title: 'Product Engineer',
      department: 'TSA PRJ SG DevOps',
      location: 'Singapore',
    }, {
      id: '1547358',
      name: 'Li Wen',
      type: 'placeholder',
      title: 'Testing Lead',
      department: 'TSA PRJ SG DevOps',
      location: 'Singapore',
    }, {
      id: '1399899',
      name: 'Wang Yufang',
      title: 'Product Engineer Manager',
      department: 'China - Tianjin (GBS)',
      location: 'Tianjin',
    },
  ];

  it('renders org team', async () => {
    const el = await fixture<ScOrgTeam>(html`
    <sc-organisation-team
      .roles=${roles}
    ></sc-organisation-team>
  `);
    expect(el.roles.length).to.equal(roles.length);
  });
});