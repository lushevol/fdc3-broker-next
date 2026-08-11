import { DayCellMountArg, ToolbarInput } from '@fullcalendar/core';
import { CALENDAR_DAY_HEADER_CONTENT } from '../../shared/util.js';

export function getDayHeaderContent(arg: CALENDAR_DAY_HEADER_CONTENT, listStartDate: string | null, today: Date) {
  const startDate = listStartDate ? new Date(listStartDate) : new Date(); 
  const headerDate = new Date(arg.date);

  const currentDate = today || new Date();

  [currentDate, startDate, headerDate].forEach(date => date.setHours(0, 0, 0, 0));

  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
  };

  if (startDate.getTime() === currentDate.getTime() && headerDate.getTime() === startDate.getTime()) {
    return { html: '<div class="fc-list-day-text today-text">Today</div>' }; 
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(headerDate);

  return { 
    html: `<div class="fc-list-day-text">${formattedDate}</div>`, 
  };
}

export function getViewAndHeaderToolbar(
  calendarView: string,
  yearNavigation: boolean,
  showHeaderToolbar: boolean
): { headerToolbar: false | ToolbarInput } {
  const isDefaultView = calendarView === 'default';
  const headerToolbarLeft = isDefaultView 
    ? `today ${yearNavigation 
      ? 'prevYear,prev,next,nextYear divider timeGridWeek,workWeek,timeGridDay,dayGridMonth' 
      : 'prev,next divider timeGridWeek,workWeek,timeGridDay,dayGridMonth'}` 
    : `${yearNavigation ? 'prevYear,prev' : 'prev'}`;
  const headerToolbarRight = isDefaultView 
    ? 'shareButton newEventButton'
    : `${yearNavigation ? 'next,nextYear shareButton newEventButton' : 'next shareButton newEventButton'}`;
  const headerToolbar = showHeaderToolbar ? {
    left: headerToolbarLeft,
    center: '',
    right: headerToolbarRight,
  } : false;

  return { headerToolbar };
}

export function handleDayCellDidMount(info: DayCellMountArg) {
  const today = new Date();
  const isToday = info.date.getDate() === today.getDate() &&
                  info.date.getMonth() === today.getMonth() &&
                  info.date.getFullYear() === today.getFullYear();

  if (isToday) {
    if (info.view.type === 'dayGridMonth') {
      const frameElement = info.el.querySelector(
        '.fc-daygrid-day-frame.fc-scrollgrid-sync-inner'
      ) as HTMLElement;
      if (frameElement) {
        frameElement.style.border = '1px solid var(--sc-calendar-month-today-border-color, var(--sc-color-blue-500))';
        frameElement.style.color = 'var(--sc-calendar-month-today-color, var(--sc-color-blue-500))';
        frameElement.style.backgroundColor = 'var(--sc-calendar-month-today-background-color, var(--sc-color-blue-50))';
      }
    }
  }
}