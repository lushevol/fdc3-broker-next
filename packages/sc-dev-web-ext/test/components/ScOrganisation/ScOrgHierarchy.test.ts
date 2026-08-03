import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScOrgHierarchy } from '../../../src/components/ScOrganisation/ScOrgHierarchy.js';
import '../../../elements/sc-organisation.js';

describe('ScOrgHierarchy', () => {
  const roles = [{
    id: '1389585',
    name: 'Johnson, Kingston',
    title: 'Head, Application Platform',
    department: 'IT-Projs-ET Integration Svcs',
    location: 'Singapore',
  }, {
    id: '1574871',
    name: 'Masked, Kendall',
    title: 'Senior Manager',
    department: 'TSA PRJ SG DevOps',
    connection: { open: true,label: '21' },
    location: 'Singapore',
  }, [
    {
      id: '1577986',
      name: 'Sulistyo',
      title: 'Product Engineer',
      department: 'TSA PRJ SG DevOps',
      location: 'Singapore',
    }, {
      id: '1547358',
      name: 'Li Wen',
      title: 'Testing Lead',
      department: 'TSA PRJ SG DevOps',
      location: 'Singapore',
    }, {
      id: '1399899',
      type: 'placeholder',
      name: 'Wang Yufang',
      title: 'Product Engineer Manager',
      department: 'China - Tianjin (GBS)',
      location: 'Tianjin',
    },
  ]];

  it('renders org hierarchy', async () => {
    const el = await fixture<ScOrgHierarchy>(html`
    <sc-organisation-hierarchy
      .roles=${roles}
    ></sc-organisation-hierarchy>
  `);
    expect(el.roles.length).to.equal(roles.length);
  });
});