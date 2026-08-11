import { expect } from '@open-wc/testing';
import {
  assignCalendarColors,
  getPrimaryColor,
} from '../../../src/components/ScCalendar/calendarColorUtils.js';
import { CalendarMetadata } from '../../../src/components/ScCalendar/ScCalendar.js';
import { colorClassMapping } from '../../../src/components/ScCalendar/constants.js';

describe('calendarColorUtils', () => {
  let colorMapping: any;
  
  beforeEach(() => {
    colorMapping = {};
  });

  describe('assignCalendarColors', () => {
    it('handles empty calendar keys', () => {
      assignCalendarColors([], new Map(), colorMapping, colorClassMapping);
      expect(Object.keys(colorMapping).length).to.equal(0);
    });

    it('assigns explicit colors from metadata', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        color: 'green',
        source: 'source',
      });
      metadataMap.set('source-Calendar2', {
        id: 'cal2',
        name: 'Calendar2',
        color: 'red',
        source: 'source',
      });

      const calendarKeys = ['source-Calendar1', 'source-Calendar2'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar1).to.deep.equal(colorClassMapping.green);
      expect(colorMapping.Calendar2).to.deep.equal(colorClassMapping.red);
    });

    it('assigns auto colors from available pool', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        color: 'auto',
        source: 'source',
      });
      metadataMap.set('source-Calendar2', {
        id: 'cal2',
        name: 'Calendar2',
        color: 'auto',
        source: 'source',
      });

      const calendarKeys = ['source-Calendar1', 'source-Calendar2'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar1).to.exist;
      expect(colorMapping.Calendar2).to.exist;
      expect(colorMapping.Calendar1).to.not.equal(colorMapping.Calendar2);
    });

    it('assigns default color to "Calendar" with auto and no hexColor', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar', {
        id: 'cal',
        name: 'Calendar',
        color: 'auto',
        source: 'source',
      });

      const calendarKeys = ['source-Calendar'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar).to.deep.equal(colorClassMapping.default);
    });

    it('avoids assigning already used explicit colors to auto calendars', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        color: 'green',
        source: 'source',
      });
      metadataMap.set('source-Calendar2', {
        id: 'cal2',
        name: 'Calendar2',
        color: 'auto',
        source: 'source',
      });

      const calendarKeys = ['source-Calendar1', 'source-Calendar2'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar1).to.deep.equal(colorClassMapping.green);
      expect(colorMapping.Calendar2).to.exist;
      // Calendar2 should not get green since it's already used
      expect(colorMapping.Calendar2).to.not.deep.equal(colorClassMapping.green);
    });

    it('cycles through available colors when more auto calendars than colors', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      const numCalendars = Object.keys(colorClassMapping).length + 5; // More than available colors
      
      for (let i = 1; i <= numCalendars; i++) {
        metadataMap.set(`source-Calendar${i}`, {
          id: `cal${i}`,
          name: `Calendar${i}`,
          color: 'auto',
          source: 'source',
        });
      }

      const calendarKeys = Array.from(metadataMap.keys());
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      // All calendars should have colors assigned
      expect(Object.keys(colorMapping).length).to.equal(numCalendars);
      Object.values(colorMapping).forEach((color: any) => {
        expect(color).to.have.property('fill');
        expect(color).to.have.property('stroke');
      });
    });

    it('handles metadata with hexColor', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        color: 'auto',
        hexColor: '#FF5733',
        source: 'source',
      });

      const calendarKeys = ['source-Calendar1'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar1).to.exist;
      // Should not assign default since hexColor is present
      expect(colorMapping.Calendar1).to.not.deep.equal(colorClassMapping.default);
    });

    it('handles undefined metadata gracefully', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      // Don't add metadata for the key

      const calendarKeys = ['source-Calendar1'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar1).to.exist;
      expect(colorMapping.Calendar1).to.have.property('fill');
      expect(colorMapping.Calendar1).to.have.property('stroke');
    });

    it('handles color case insensitivity', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        color: 'GREEN', // uppercase
        source: 'source',
      });

      const calendarKeys = ['source-Calendar1'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar1).to.deep.equal(colorClassMapping.green);
    });

    it('falls back to default for unknown explicit color', () => {
      const metadataMap = new Map<string, CalendarMetadata>();
      metadataMap.set('source-Calendar1', {
        id: 'cal1',
        name: 'Calendar1',
        color: 'unknownColor',
        source: 'source',
      });

      const calendarKeys = ['source-Calendar1'];
      assignCalendarColors(calendarKeys, metadataMap, colorMapping, colorClassMapping);

      expect(colorMapping.Calendar1).to.deep.equal(colorClassMapping.default);
    });
  });

  describe('getPrimaryColor', () => {
    it('returns color for known color name', () => {
      const result = getPrimaryColor('green', colorClassMapping);
      expect(result).to.deep.equal(colorClassMapping.green);
      expect(result).to.have.property('fill');
      expect(result).to.have.property('stroke');
    });

    it('returns color when color name is part of string', () => {
      const result = getPrimaryColor('some-green-color', colorClassMapping);
      expect(result).to.deep.equal(colorClassMapping.green);
    });

    it('returns default color for unknown color', () => {
      const result = getPrimaryColor('unknownColor', colorClassMapping);
      expect(result).to.deep.equal(colorClassMapping.default);
    });

    it('returns default color for empty string', () => {
      const result = getPrimaryColor('', colorClassMapping);
      expect(result).to.deep.equal(colorClassMapping.default);
    });

    it('handles case insensitivity', () => {
      const result = getPrimaryColor('GREEN', colorClassMapping);
      expect(result).to.deep.equal(colorClassMapping.green);
    });
  });
});
