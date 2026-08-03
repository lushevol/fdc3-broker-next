import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScFileList } from '../../../src/components/ScFileList/ScFileList.js';
import '../../../elements/sc-file-list.js';
import '../../../elements/sc-file-item.js';

describe('ScFileList', () => {
  it('renders file list', async () => {
    const el = await fixture<ScFileList>(html`
      <sc-file-list>
        <sc-file-item name="test1.zip" size="4000" selectable></sc-file-item>
        <sc-file-item name="test2.doc" size="300" progress-size=200 progress-text="progress" deletable></sc-file-item>
        <sc-file-item name="test3.xlsx" size="20000000" progress-size=2000></sc-file-item>
      </sc-file-list>
    `);
    await fixture<ScFileList>(html` <sc-file-list
      direction="horizontal"
    >
      <sc-file-item name="test3.ai" size="2000000000" progress-size=2000></sc-file-item>
    </sc-file-list>`);

    expect(el.direction).to.equal('vertical');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScFileList>(
      html`<sc-file-list direction="vertical"
        ><sc-file-item name="test3.psd" size="2000000000" progress-size=2000></sc-file-item></sc-file-list
      >`
    );

    await expect(el).shadowDom.to.be.accessible();
  });
});
