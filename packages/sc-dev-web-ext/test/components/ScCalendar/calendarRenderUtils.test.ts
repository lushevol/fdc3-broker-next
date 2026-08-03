import { expect } from '@open-wc/testing';
import { createEventContent, handleDayCellDidMount } from '../../../src/components/ScCalendar/calendarRenderUtils.js';
import { EventContentArg, DayCellMountArg } from '@fullcalendar/core';

describe('calendarRenderUtils', () => {
  describe('createEventContent', () => {
    function getBaseArg(overrides: Partial<EventContentArg> = {}): EventContentArg {
      return {
        event: {
          title: 'Test Event',
          allDay: false,
          extendedProps: {},
          ...(overrides.event as any),
        } as any,
        view: { type: 'dayGridMonth' } as any,
        timeText: '10:00 AM',
        ...overrides,
      } as EventContentArg;
    }

    it('renders oof status with correct background and border', () => {
      const arg = getBaseArg({ event: { extendedProps: { showAs: 'oof' } } as any });
      const { domNodes } = createEventContent(arg);
      const statusBlock = domNodes[0].querySelector('.sc-calendar-event-status-block') as HTMLElement | null;
      expect(statusBlock).to.not.be.null;
      expect(statusBlock!.className).to.include('sc-calendar-event-status-block');
    });

    it('renders free status with correct background and border', () => {
      const arg = getBaseArg({ event: { extendedProps: { showAs: 'free' } } as any });
      const { domNodes } = createEventContent(arg);
      const statusBlock = domNodes[0].querySelector('.sc-calendar-event-status-block') as HTMLElement | null;
      expect(statusBlock).to.not.be.null;
      expect(statusBlock!.className).to.include('sc-calendar-event-status-block');
    });

    it('renders tentative status with SVG mask', done => {
      const arg = getBaseArg({ event: { extendedProps: { showAs: 'tentative' } } as any });
      const { domNodes } = createEventContent(arg);
      setTimeout(() => {
        const svg = domNodes[0].querySelector('svg') as SVGElement | null;
        expect(svg).to.exist;
        expect(svg!.innerHTML).to.include('mask');
        done();
      }, 10);
    });

    it('renders workingElsewhere status with SVG mask', done => {
      const arg = getBaseArg({ event: { extendedProps: { showAs: 'workingElsewhere' } } as any });
      const { domNodes } = createEventContent(arg);
      setTimeout(() => {
        const svg = domNodes[0].querySelector('svg') as SVGElement | null;
        expect(svg).to.exist;
        expect(svg!.innerHTML).to.include('mask');
        done();
      }, 10);
    });

    it('renders time and title for month view', () => {
      const arg = getBaseArg();
      const { domNodes } = createEventContent(arg);
      expect(domNodes[0].querySelector('.sc-calendar-event-time-text')).to.exist;
      expect(domNodes[0].querySelector('.sc-calendar-event-title-text')).to.exist;
    });

    it('renders only title for non-month view', () => {
      const arg = getBaseArg({ view: { type: 'timeGridWeek' } as any });
      const { domNodes } = createEventContent(arg);
      expect(domNodes[0].querySelector('.sc-calendar-event-time-text')).to.not.exist;
      expect(domNodes[0].querySelector('.sc-calendar-event-title-text')).to.exist;
    });

    it('renders all-day title with correct class', () => {
      const arg = getBaseArg({ event: { allDay: true } as any });
      const { domNodes } = createEventContent(arg);
      expect(domNodes[0].querySelector('.sc-calendar-event-title-text.sc-calendar-event-all-day')).to.exist;
    });

    it('renders lock icon for private sensitivity', () => {
      const arg = getBaseArg({ event: { extendedProps: { sensitivity: 'private' } } as any });
      const { domNodes } = createEventContent(arg);
      expect(domNodes[0].querySelector('sc-icon[name="lock--line"]')).to.exist;
    });

    it('renders sync icon for recurring events', () => {
      const arg = getBaseArg({
        event: {
          extendedProps: {
            recurrenceDetails: { pattern: { type: 'daily' } },
          },
        } as any,
      });
      const { domNodes } = createEventContent(arg);
      expect(domNodes[0].querySelector('sc-icon[name="sync"]')).to.exist;
    });

    it('does not render sync icon for non-recurring events', () => {
      const arg = getBaseArg({
        event: {
          extendedProps: {
            recurrenceDetails: { pattern: { type: 'no-repeat' } },
          },
        } as any,
      });
      const { domNodes } = createEventContent(arg);
      expect(domNodes[0].querySelector('sc-icon[name="sync"]')).to.not.exist;
    });

    it('uses colorMapping for non-default calendarSource', () => {
      const arg = getBaseArg({
        event: {
          extendedProps: {
            calendarSource: { name: 'custom', isDefault: false },
          },
        } as any,
      });
      const { domNodes } = createEventContent(arg);
      expect(domNodes[0].className).to.include('sc-calendar-event-container');
    });
  });

  describe('handleDayCellDidMount', () => {
    it('applies styles for today in dayGridMonth view', () => {
      const today = new Date(2025, 2, 17, 0, 0, 0);
      jest.useFakeTimers();
      jest.setSystemTime(today);

      const mockElement = document.createElement('div');
      mockElement.innerHTML = '<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>';
      const frameElement = mockElement.querySelector('.fc-daygrid-day-frame') as HTMLElement;
      expect(frameElement.className).to.include('fc-daygrid-day-frame');
      // @ts-ignore
      const info: DayCellMountArg = {
        date: new Date(2025, 2, 17, 0, 0, 0),
        el: mockElement,
        view: { type: 'dayGridMonth' } as any,
      };

      handleDayCellDidMount(info);

      expect(frameElement.className).to.include('fc-daygrid-day-frame');

      jest.useRealTimers();
    });

    it('does nothing for non-today dates', () => {
      const nonToday = new Date();
      nonToday.setDate(nonToday.getDate() - 1);
      nonToday.setHours(0, 0, 0, 0);
      const mockElement = document.createElement('div');
      mockElement.innerHTML = '<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>';
      const frameElement = mockElement.querySelector('.fc-daygrid-day-frame') as HTMLElement;

      // @ts-ignore
      const info: DayCellMountArg = {
        date: nonToday,
        el: mockElement,
        view: { type: 'dayGridMonth' } as any,
      };

      handleDayCellDidMount(info);

      expect(frameElement.className).to.include('fc-daygrid-day-frame');
    });
  });
});