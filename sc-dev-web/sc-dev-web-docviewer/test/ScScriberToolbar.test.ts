import { fixture, expect } from '@open-wc/testing';
import { html } from 'lit';

import type { ScScriberToolbar } from '../src/components/ScScriberToolbar.js';
// eslint-disable-next-line no-duplicate-imports
import '../src/components/ScScriberToolbar.js';
import { ETools, Size } from '../src/components/ScScriber.toolbar.util.js';

describe('test scriber com', () => {
  it('color scriber', async () => {
    const el = await fixture<ScScriberToolbar>(
      html`<sc-scriber-toolbar
        .dimension=${{ width: 20, height: 20 }}
      ></sc-scriber-toolbar>`
    );
    await el.updateComplete;
    el.switchTool(ETools.arrow);
    el.handleToolbarStyleChange(new Size(() => {}));

    expect(el.activeToolForToolbarStyles).to.equal(ETools.pen);
  });

  it('should handle dataSource change and highlight navigation', async () => {
    const el = await fixture<ScScriberToolbar>(
      html`<sc-scriber-toolbar></sc-scriber-toolbar>`
    );
    await el.updateComplete;

    // Setting dataSource with two highlightRect entries triggers handleDataSourceChange
    // via the @watch decorator (covers lines 92–98)
    el.dataSource = [
      {
        history: [
          { type: ETools.highlightRect, data: { startX: 10, endX: 50, startY: 100, endY: 130 } },
          { type: ETools.highlightRect, data: { startX: 60, endX: 100, startY: 200, endY: 230 } },
        ],
        textHistory: [],
      },
    ] as any;
    await el.updateComplete;

    expect(el.highlights.length).to.equal(2);

    const events: any[] = [];
    el.addEventListener('scriber-toolbar', (e: any) => events.push(e.detail));

    // handleNextClick at index -1 → increments to 0, emits jump-highlight (covers 105–111)
    el.handleNextClick();
    expect(el.highlightIndex).to.equal(0);
    expect(events[0].type).to.equal('jump-highlight');

    // handleNextClick at end → stays at 1, no new event
    el.handleNextClick();
    expect(el.highlightIndex).to.equal(1);
    expect(events.length).to.equal(2);

    // handlePreviousClick at index 1 → decrements to 0, emits jump-highlight (covers 123–125)
    el.handlePreviousClick();
    expect(el.highlightIndex).to.equal(0);
    expect(events[1].type).to.equal('jump-highlight');

    // handlePreviousClick at start → stays at 0, no new event
    el.handlePreviousClick();
    expect(el.highlightIndex).to.equal(0);
    expect(events.length).to.equal(3);
  });
});
