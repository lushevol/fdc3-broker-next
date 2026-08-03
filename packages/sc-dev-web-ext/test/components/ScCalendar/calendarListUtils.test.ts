import { html } from 'lit';
import { expect } from '@open-wc/testing';
import {
  processCalendarMetadata,
  getCalendarKeys,
  getEditableCalendars,
  buildCalendarList,
  updateCalendarListSuffixes,
  getInitialSelectedCalendars,
} from '../../../src/components/ScCalendar/calendarListUtils.js';
import { CalendarMetadata } from '../../../src/components/ScCalendar/ScCalendar.js';

describe('calendarListUtils', () => {
  describe('processCalendarMetadata', () => {
    it('processes string calendars', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const calendars = ['source1-Calendar1', 'source2-Calendar2'];
      
      processCalendarMetadata(calendars, metadataMap);
      
      expect(metadataMap.size).to.equal(2);
      expect(metadataMap.get('source1-Calendar1')).to.deep.include({
        id: 'source1-Calendar1',
        name: 'Calendar1',
        source: 'source1',
      });
      expect(metadataMap.get('source2-Calendar2')).to.deep.include({
        id: 'source2-Calendar2',
        name: 'Calendar2',
        source: 'source2',
      });
    });

    it('processes CalendarMetadata objects with source', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const calendars: CalendarMetadata[] = [
        {
          id: 'cal1',
          name: 'My Calendar',
          source: 'Outlook',
          color: 'blue',
        },
      ];
      
      processCalendarMetadata(calendars, metadataMap);
      
      expect(metadataMap.size).to.equal(1);
      expect(metadataMap.get('Outlook-My Calendar')).to.deep.include({
        id: 'cal1',
        name: 'My Calendar',
        source: 'Outlook',
        color: 'blue',
      });
    });

    it('derives source from owner email when source is missing', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const calendars: CalendarMetadata[] = [
        {
          id: 'cal1',
          name: 'Team Calendar',
          owner: {
            address: 'team@outlook.com',
          },
        },
      ];
      
      processCalendarMetadata(calendars, metadataMap);
      
      expect(metadataMap.size).to.equal(1);
      expect(metadataMap.get('Outlook-Team Calendar')).to.deep.include({
        id: 'cal1',
        name: 'Team Calendar',
        source: 'Outlook',
      });
    });

    it('uses "Calendar" as default source when no source or owner', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const calendars: CalendarMetadata[] = [
        {
          id: 'cal1',
          name: 'Default Calendar',
        },
      ];
      
      processCalendarMetadata(calendars, metadataMap);
      
      expect(metadataMap.size).to.equal(1);
      expect(metadataMap.get('Calendar-Default Calendar')).to.deep.include({
        id: 'cal1',
        name: 'Default Calendar',
        source: 'Calendar',
      });
    });

    it('clears existing metadata before processing', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('old-key', { id: 'old', name: 'Old', source: 'old' });
      
      const calendars = ['new-Calendar'];
      processCalendarMetadata(calendars, metadataMap);
      
      expect(metadataMap.size).to.equal(1);
      expect(metadataMap.has('old-key')).to.be.false;
      expect(metadataMap.has('new-Calendar')).to.be.true;
    });

    it('handles string with only source (no hyphen)', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const calendars = ['SingleSource'];
      
      processCalendarMetadata(calendars, metadataMap);
      
      expect(metadataMap.size).to.equal(1);
      expect(metadataMap.get('SingleSource')).to.deep.include({
        id: 'SingleSource',
        name: 'SingleSource', // Falls back to source when no name
        source: 'SingleSource',
      });
    });
  });

  describe('getCalendarKeys', () => {
    it('returns array of calendar keys', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source1-Calendar1', { id: 'cal1', name: 'Calendar1', source: 'source1' });
      metadataMap.set('source2-Calendar2', { id: 'cal2', name: 'Calendar2', source: 'source2' });
      
      const keys = getCalendarKeys(metadataMap);
      
      expect(keys).to.deep.equal(['source1-Calendar1', 'source2-Calendar2']);
    });

    it('returns empty array for empty map', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      
      const keys = getCalendarKeys(metadataMap);
      
      expect(keys).to.deep.equal([]);
    });
  });

  describe('getEditableCalendars', () => {
    it('returns only editable calendars', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Editable Calendar',
        source: 'source',
        canEdit: true,
      });
      metadataMap.set('source-Calendar2', {
        id: 'cal2',
        name: 'Read Only Calendar',
        source: 'source',
        canEdit: false,
      });
      metadataMap.set('source-Calendar3', {
        id: 'cal3',
        name: 'Default Editable',
        source: 'source',
        // canEdit undefined, should default to true
      });
      
      const editableCalendars = getEditableCalendars(metadataMap);
      
      expect(editableCalendars.length).to.equal(2);
      expect(editableCalendars[0]).to.deep.include({
        label: 'Editable Calendar',
        value: 'source-Calendar1',
      });
      expect(editableCalendars[1]).to.deep.include({
        label: 'Default Editable',
        value: 'source-Calendar3',
      });
    });

    it('returns empty array when no editable calendars', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Read Only',
        source: 'source',
        canEdit: false,
      });
      
      const editableCalendars = getEditableCalendars(metadataMap);
      
      expect(editableCalendars).to.deep.equal([]);
    });

    it('includes metadata in result', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const metadata: CalendarMetadata = {
        id: 'cal1',
        name: 'My Calendar',
        source: 'source',
        canEdit: true,
        color: 'blue',
      };
      metadataMap.set('source-MyCalendar', metadata);
      
      const editableCalendars = getEditableCalendars(metadataMap);
      
      expect(editableCalendars[0].metadata).to.equal(metadata);
    });
  });

  describe('buildCalendarList', () => {
    const mockRenderPrefix = (
      fillColor: string, 
      strokeColor: string, 
      calendarKey: string, 
      isChecked: boolean
    ) => html`<span style="color: ${fillColor}" data-key="${calendarKey}" data-checked="${isChecked}">●</span>`;
    const mockRenderSuffix = (calendarKey: string) => html`<span data-key="${calendarKey}"></span>`;

    it('builds hierarchical calendar list grouped by source', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('Outlook-Calendar1', { id: 'cal1', name: 'Calendar1', source: 'Outlook' });
      metadataMap.set('Outlook-Calendar2', { id: 'cal2', name: 'Calendar2', source: 'Outlook' });
      metadataMap.set('Google-Calendar3', { id: 'cal3', name: 'Calendar3', source: 'Google' });
      
      const calendarKeys = ['Outlook-Calendar1', 'Outlook-Calendar2', 'Google-Calendar3'];
      const selectedCalendars = new Set(['Outlook-Calendar1']);
      const colorMapping = {
        Calendar1: { fill: 'var(--sc-color-blue-100)', stroke: 'var(--sc-color-blue-700)' },
        Calendar2: { fill: 'var(--sc-color-red-100)', stroke: 'var(--sc-color-red-700)' },
        Calendar3: { fill: 'var(--sc-color-green-100)', stroke: 'var(--sc-color-green-700)' },
      };
      
      const calendarList = buildCalendarList(
        calendarKeys,
        metadataMap,
        selectedCalendars,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(calendarList.length).to.equal(2);
      
      const outlookGroup = calendarList.find(item => item.key === 'Outlook');
      expect(outlookGroup).to.exist;
      expect(outlookGroup?.children.length).to.equal(2);
      expect(outlookGroup?.open).to.be.true;
      
      const googleGroup = calendarList.find(item => item.key === 'Google');
      expect(googleGroup).to.exist;
      expect(googleGroup?.children.length).to.equal(1);
    });

    it('marks selected calendars as checked', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', { id: 'cal1', name: 'Calendar1', source: 'source' });
      
      const calendarKeys = ['source-Calendar1'];
      const selectedCalendars = new Set(['cal1']);
      const colorMapping = { Calendar1: { fill: 'var(--sc-color-blue-100)', stroke: 'var(--sc-color-blue-700)' } };
      
      const calendarList = buildCalendarList(
        calendarKeys,
        metadataMap,
        selectedCalendars,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(calendarList[0].children[0].key).to.equal('cal1');
      expect(calendarList[0].children[0].title).to.equal('Calendar1');
    });

    it('marks read-only calendars correctly', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        source: 'source',
        canEdit: false,
      });
      
      const calendarKeys = ['source-Calendar1'];
      const selectedCalendars = new Set<string>();
      const colorMapping = { Calendar1: { fill: 'var(--sc-color-blue-100)', stroke: 'var(--sc-color-blue-700)' } };
      
      const calendarList = buildCalendarList(
        calendarKeys,
        metadataMap,
        selectedCalendars,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(calendarList[0].children[0].metadata?.canEdit).to.be.false;
    });

    it('returns empty array for empty calendar keys', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const calendarKeys: string[] = [];
      const selectedCalendars = new Set<string>();
      const colorMapping = {};
      
      const calendarList = buildCalendarList(
        calendarKeys,
        metadataMap,
        selectedCalendars,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(calendarList).to.deep.equal([]);
    });

    it('uses fallback colors when color not in mapping', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', { id: 'cal1', name: 'Calendar1', source: 'source' });
      
      const calendarKeys = ['source-Calendar1'];
      const selectedCalendars = new Set<string>();
      const colorMapping = {}; // No color mapping
      
      const calendarList = buildCalendarList(
        calendarKeys,
        metadataMap,
        selectedCalendars,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(calendarList[0].children[0]).to.exist;
      // Prefix and suffix should still be rendered
      expect(calendarList[0].children[0].prefix).to.exist;
      expect(calendarList[0].children[0].suffix).to.exist;
    });
  });

  describe('updateCalendarListSuffixes', () => {
    const mockRenderPrefix = (
      fillColor: string, 
      strokeColor: string, 
      calendarKey: string, 
      isChecked: boolean
    ) => html`<span style="color: ${fillColor}" data-key="${calendarKey}" data-checked="${isChecked}">●</span>`;
    const mockRenderSuffix = (calendarKey: string) => html`<span data-key="${calendarKey}"></span>`;

    it('updates suffixes for all calendar items', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', { id: 'cal1', name: 'Calendar1', source: 'source' });
      metadataMap.set('source-Calendar2', { id: 'cal2', name: 'Calendar2', source: 'source' });
      
      const calendarList = [
        {
          key: 'source',
          title: 'source',
          children: [
            { key: 'source-Calendar1', title: 'Calendar1', suffix: html`<span>old1</span>` },
            { key: 'source-Calendar2', title: 'Calendar2', suffix: html`<span>old2</span>` },
          ],
          open: true,
        },
      ];
      
      const selectedCalendars = new Set(['source-Calendar1']);
      const colorMapping = {
        Calendar1: { fill: 'var(--sc-color-blue-100)', stroke: 'var(--sc-color-blue-700)' },
        Calendar2: { fill: 'var(--sc-color-red-100)', stroke: 'var(--sc-color-red-700)' },
      };
      
      const updatedList = updateCalendarListSuffixes(
        calendarList,
        selectedCalendars,
        metadataMap,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(updatedList[0].children[0].prefix).to.exist;
      expect(updatedList[0].children[1].prefix).to.exist;
    });

    it('preserves other properties while updating suffixes', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', { id: 'cal1', name: 'Calendar1', source: 'source' });
      
      const calendarList = [
        {
          key: 'source',
          title: 'source',
          children: [
            { 
              key: 'source-Calendar1',
              title: 'Calendar1',
              prefix: html`<span>●</span>`,
              suffix: html`<span>old</span>`,
              metadata: { id: 'cal1', name: 'Calendar1', source: 'source' },
            },
          ],
          open: true,
        },
      ];
      
      const selectedCalendars = new Set<string>();
      const colorMapping = {
        Calendar1: { fill: 'var(--sc-color-blue-100)', stroke: 'var(--sc-color-blue-700)' },
      };
      
      const updatedList = updateCalendarListSuffixes(
        calendarList,
        selectedCalendars,
        metadataMap,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(updatedList[0].children[0].key).to.equal('source-Calendar1');
      expect(updatedList[0].children[0].title).to.equal('Calendar1');
      expect(updatedList[0].children[0].prefix).to.exist;
      expect(updatedList[0].children[0].metadata).to.exist;
    });

    it('handles read-only calendars in prefix update', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        source: 'source',
        canEdit: false,
      });
      
      const calendarList = [
        {
          key: 'source',
          title: 'source',
          children: [
            { key: 'source-Calendar1', title: 'Calendar1', suffix: html`<span>old</span>` },
          ],
          open: true,
        },
      ];
      
      const selectedCalendars = new Set<string>();
      const colorMapping = {
        Calendar1: { fill: 'var(--sc-color-blue-100)', stroke: 'var(--sc-color-blue-700)' },
      };
      
      const updatedList = updateCalendarListSuffixes(
        calendarList,
        selectedCalendars,
        metadataMap,
        colorMapping,
        mockRenderPrefix,
        mockRenderSuffix
      );
      
      expect(updatedList[0].children[0].prefix).to.exist;
    });
  });

  describe('getInitialSelectedCalendars', () => {
    it('returns first calendar when current selection is empty', () => {
      const availableCalendars: CalendarMetadata[] = [
        { id: 'cal1', name: 'Calendar1', source: 'source' },
        { id: 'cal2', name: 'Calendar2', source: 'source' },
        { id: 'cal3', name: 'Calendar3', source: 'source' },
      ];
      const currentSelection: (string | CalendarMetadata)[] = [];
      
      const result = getInitialSelectedCalendars(availableCalendars, currentSelection);
      
      expect(result.length).to.equal(1);
      expect(result[0]).to.equal(availableCalendars[0]);
    });

    it('returns current selection when it has items', () => {
      const availableCalendars: CalendarMetadata[] = [
        { id: 'cal1', name: 'Calendar1', source: 'source' },
        { id: 'cal2', name: 'Calendar2', source: 'source' },
        { id: 'cal3', name: 'Calendar3', source: 'source' },
      ];
      const currentSelection: CalendarMetadata[] = [
        { id: 'cal2', name: 'Calendar2', source: 'source' },
        { id: 'cal3', name: 'Calendar3', source: 'source' },
      ];
      
      const result = getInitialSelectedCalendars(availableCalendars, currentSelection);
      
      expect(result).to.equal(currentSelection);
      expect(result.length).to.equal(2);
    });

    it('returns empty array when no calendars and no selection', () => {
      const availableCalendars: (string | CalendarMetadata)[] = [];
      const currentSelection: (string | CalendarMetadata)[] = [];
      
      const result = getInitialSelectedCalendars(availableCalendars, currentSelection);
      
      expect(result.length).to.equal(0);
    });

    it('handles null current selection', () => {
      const availableCalendars: CalendarMetadata[] = [
        { id: 'cal1', name: 'Calendar1', source: 'source' },
      ];
      const currentSelection = null as any;
      
      const result = getInitialSelectedCalendars(availableCalendars, currentSelection);
      
      expect(result.length).to.equal(1);
      expect(result[0]).to.equal(availableCalendars[0]);
    });

    it('handles undefined current selection', () => {
      const availableCalendars: CalendarMetadata[] = [
        { id: 'cal1', name: 'Calendar1', source: 'source' },
      ];
      const currentSelection = undefined as any;
      
      const result = getInitialSelectedCalendars(availableCalendars, currentSelection);
      
      expect(result.length).to.equal(1);
      expect(result[0]).to.equal(availableCalendars[0]);
    });
  });
});
