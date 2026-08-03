import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { ScRteRevisionHistory } from '../../../src/components/ScRichTextEditor/ScRteRevisionHistory.js';
import { Revision } from '../../../src/components/ScRichTextEditor/utils.js';

describe('ScRteRevisionHistory', () => {
  it('renders the revision history', async () => {
    const el = await fixture<ScRteRevisionHistory>(
      html`<sc-rte-revision-history
        .revisions=${testRevisions}
      ></sc-rte-revision-history>`,
      { scopedElements: { 'sc-rte-revision-history': ScRteRevisionHistory } }
    );
    expect(el.revisionItems.length).to.equal(testRevisions.length);
  });

  it('select a revision', async () => {
    const el = await fixture<ScRteRevisionHistory>(
      html`<sc-rte-revision-history .revisions=${testRevisions}></sc-rte-revision-history>`,
      { scopedElements: { 'sc-rte-revision-history': ScRteRevisionHistory } }
    );

    setTimeout(() => el.select(el.revisions[1]), 0);

    await oneEvent(el, 'sc-select');

    expect(el.selected).to.deep.equal(testRevisions[1]);
  });
});

const testRevisions: Revision[] = [
  {
    id: '1',
    dateCreated: '2025-05-01T12:00:00Z',
    authorId: '1574871',
    content: 'title',
  },
  {
    id: '2',
    dateCreated: '2025-05-02T12:00:00Z',
    authorId: '2027226',
    content: 'updated title',
  },
];

