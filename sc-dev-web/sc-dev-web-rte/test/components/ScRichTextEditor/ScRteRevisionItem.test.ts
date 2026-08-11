import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import { ScRteRevisionItem } from '../../../src/components/ScRichTextEditor/ScRteRevisionItem.js';

describe('ScRteRevisionItem', () => {
  const sampleRevision = {
    id: '1',
    authorId: 'testAuth',
    content: 'asdasdasd',
    dateCreated: '2025-05-01T12:00:00Z',
  };
  it('renders a revision item', async () => {
    const el = await fixture<ScRteRevisionItem>(
      html`<sc-rte-revision-item .value=${sampleRevision}
      ></sc-rte-revision-item>`,
      { scopedElements: { 'sc-rte-revision-item': ScRteRevisionItem } }
    );
    expect(el).to.be.rendered;
  });

  it('should handle click event', async () => {
    const el = await fixture<ScRteRevisionItem>(
      html`<sc-rte-revision-item .value=${sampleRevision}
        ></sc-rte-revision-item>`,
      { scopedElements: { 'sc-rte-revision-item': ScRteRevisionItem } }
    );
    el.selected = false;
    el.handleClick(new MouseEvent('click'));
    expect(el.selected).to.be.true;
  });

  it('should emit sc-select on Space or Enter keydown', async () => {
    const el = await fixture<ScRteRevisionItem>(
      html`<sc-rte-revision-item .value=${sampleRevision}></sc-rte-revision-item>`,
      { scopedElements: { 'sc-rte-revision-item': ScRteRevisionItem } }
    );

    const spaceEvent = oneEvent(el, 'sc-select');
    el.handleKeydown(new KeyboardEvent('keydown', { code: 'Space' }));
    const spaceResult = await spaceEvent;
    expect((spaceResult as CustomEvent).detail.revision).to.deep.equal(sampleRevision);

    const enterEvent = oneEvent(el, 'sc-select');
    el.handleKeydown(new KeyboardEvent('keydown', { code: 'Enter' }));
    const enterResult = await enterEvent;
    expect((enterResult as CustomEvent).detail.revision).to.deep.equal(sampleRevision);
  });

  it('should not emit sc-select for non-Space/Enter keydown', async () => {
    const el = await fixture<ScRteRevisionItem>(
      html`<sc-rte-revision-item .value=${sampleRevision}></sc-rte-revision-item>`,
      { scopedElements: { 'sc-rte-revision-item': ScRteRevisionItem } }
    );

    let emitted = false;
    el.addEventListener('sc-select', () => { emitted = true; });
    el.handleKeydown(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    expect(emitted).to.be.false;
  });

});
