import { expect } from '@open-wc/testing';
import { LinkTemplate } from '../../../src/models/Components/LinkTemplate.js';

describe('LinkTemplate model', () => {
  it('render the properties', () => {
    const linkTemplate = LinkTemplate.from({ href: 'www.google.com' });
    expect(linkTemplate.href).to.equal('www.google.com');
  });
});