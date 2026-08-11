import { expect } from '@open-wc/testing';
import {
  getDayHeaderContent,
  getViewAndHeaderToolbar,
  handleDayCellDidMount,
} from '../../../src/components/ScCalendar/calendarViewUtils.js';
import { DayCellMountArg } from '@fullcalendar/core';

describe('calendarViewUtils', () => {
  describe('getDayHeaderContent', () => {
    it('returns "Today" when headerDate, startDate, and currentDate match', () => {
      const today = new Date('2025-03-17T00:00:00');
      const listStartDate = '2025-03-17T00:00:00';
      const result = getDayHeaderContent(
        { date: new Date('2025-03-17T00:00:00'), text: 'Monday, March 17, 2025' },
        listStartDate,
        today
      );
      expect(result.html).to.equal('<div class="fc-list-day-text today-text">Today</div>');
    });

    it('returns formatted date when not today', () => {
      const today = new Date('2025-03-17T00:00:00');
      const listStartDate = '2025-03-17T00:00:00';
      const result = getDayHeaderContent(
        { date: new Date('2025-03-18T00:00:00'), text: 'Tuesday, March 18, 2025' },
        listStartDate,
        today
      );
      expect(result.html).to.equal('<div class="fc-list-day-text">Tuesday, March 18, 2025</div>');
    });
  });

  describe('getViewAndHeaderToolbar', () => {
    it('returns correct headerToolbar for default view with year navigation and header toolbar enabled', () => {
      const result = getViewAndHeaderToolbar('default', true, true);
      expect(result).to.deep.equal({
        headerToolbar: {
          left: 'today prevYear,prev,next,nextYear divider timeGridWeek,workWeek,timeGridDay,dayGridMonth',
          center: '',
          right: 'shareButton newEventButton',
        },
      });
    });

    it('returns correct headerToolbar for default view without year navigation', () => {
      const result = getViewAndHeaderToolbar('default', false, true);
      expect(result).to.deep.equal({
        headerToolbar: {
          left: 'today prev,next divider timeGridWeek,workWeek,timeGridDay,dayGridMonth',
          center: '',
          right: 'shareButton newEventButton',
        },
      });
    });

    it('returns correct headerToolbar for non-default view with year navigation', () => {
      const result = getViewAndHeaderToolbar('custom', true, true);
      expect(result).to.deep.equal({
        headerToolbar: {
          left: 'prevYear,prev',
          center: '',
          right: 'next,nextYear shareButton newEventButton',
        },
      });
    });

    it('returns correct headerToolbar for non-default view without year navigation', () => {
      const result = getViewAndHeaderToolbar('custom', false, true);
      expect(result).to.deep.equal({
        headerToolbar: {
          left: 'prev',
          center: '',
          right: 'next shareButton newEventButton',
        },
      });
    });

    it('returns false for headerToolbar when showHeaderToolbar is false', () => {
      const result = getViewAndHeaderToolbar('default', true, false);
      expect(result).to.deep.equal({ headerToolbar: false });
    });
  });

  describe('handleDayCellDidMount', () => {
    // it('applies styles for today in dayGridMonth view', () => {
    //   const today = new Date(2025, 2, 17, 0, 0, 0);
    //   jest.useFakeTimers();
    //   jest.setSystemTime(today);
    
    //   const mockElement = document.createElement('div');
    //   mockElement.innerHTML = `<div class="fc-daygrid-day-frame fc-scrollgrid-sync-inner"></div>`;
    //   const frameElement = mockElement.querySelector('.fc-daygrid-day-frame') as HTMLElement;
    
    //   // @ts-ignore
    //   const info: DayCellMountArg = {
    //     date: new Date(2025, 2, 17, 0, 0, 0),
    //     el: mockElement,
    //     view: { type: 'dayGridMonth' } as any,
    //   };
    
    //   handleDayCellDidMount(info);
    
    //   expect(frameElement.style.border).to.equal('1px solid var(--sc-calendar-month-today-border-color, var(--sc-color-blue-500))');
    //   expect(frameElement.style.color).to.equal('var(--sc-calendar-month-today-color, var(--sc-color-blue-500))');
    //   expect(frameElement.style.backgroundColor).to.equal('var(--sc-calendar-month-today-background-color, var(--sc-color-blue-50))');
    
    //   jest.useRealTimers();
    // });

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

      expect(frameElement.style.border).to.equal('');
      expect(frameElement.style.color).to.equal('');
      expect(frameElement.style.backgroundColor).to.equal('');
    });
  });
});