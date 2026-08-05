import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScOrgPlaceholder } from '../../../src/components/ScOrganisation/ScOrgPlaceholder.js';
import '../../../elements/sc-organisation.js';

describe('ScOrgPlaceholder', () => {
  it('renders default org placeholder', async () => {
    const el = await fixture<ScOrgPlaceholder>(html`
      <sc-organisation-placeholder
        icon=home--line
        title='Senior Manager'
      ></sc-organisation-placeholder>
    `);
    expect(el.icon).to.equal('home--line');
    expect(el.title).to.equal('Senior Manager');
  });

  it('renders no icon', async () => {
    const el = await fixture<ScOrgPlaceholder>(html`
      <sc-organisation-placeholder
        title='Senior Manager'
      ></sc-organisation-placeholder>
    `);
    expect(el.icon).to.equal(undefined);
  });
});