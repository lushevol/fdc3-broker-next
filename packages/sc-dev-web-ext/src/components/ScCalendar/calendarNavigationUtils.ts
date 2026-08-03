/**
 * Calendar navigation utility functions.
 * Pass the necessary context (calendarApi, _calendar, shadowRoot, locale, currentView) as arguments.
 */

export function navigateToWorkWeek(ctx: {
  date: Date,
  calendarApi: any,
  _calendar: any,
  shadowRoot: ShadowRoot | null,
}) {
  const { date, calendarApi, _calendar, shadowRoot } = ctx;
  const startOfWorkWeek = new Date(date);
  startOfWorkWeek.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)); 

  calendarApi.changeView('workWeek', startOfWorkWeek);
  _calendar.setOption('weekends', false);

  const buttonGroup = shadowRoot?.querySelector('.sc-calendar-view-buttons');
  if (buttonGroup) {
    (buttonGroup as any).value = ['workWeek'];
  }
}

export function navigateToWeek(ctx: {
  date: Date,
  calendarApi: any,
  _calendar: any,
  shadowRoot: ShadowRoot | null,
}) {
  const { date, calendarApi, _calendar, shadowRoot } = ctx;
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)); 

  calendarApi.changeView('timeGridWeek', startOfWeek);
  _calendar.setOption('weekends', true);

  const buttonGroup = shadowRoot?.querySelector('.sc-calendar-view-buttons');
  if (buttonGroup) {
    (buttonGroup as any).value = ['timeGridWeek'];
  }
}

export function navigateToDay(ctx: {
  date: Date,
  calendarApi: any,
  _calendar: any,
  shadowRoot: ShadowRoot | null,
  locale: string,
}) {
  const { date, calendarApi, _calendar, shadowRoot, locale } = ctx;
  _calendar.setOption('dayHeaderContent', (args: any) => {
    const today = new Date();
    const isToday = args.date.toDateString() === today.toDateString();

    const day = args.date.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const color = isToday ? 'var(--sc-calendar-today-text-color, var(--sc-color-blue-500))' 
      : 'var(--sc-calendar-not-today-text-color, var(--sc-color-blue-900))';
    return { html: `<div style="color: ${color};">${day}</div>` };
  });
  calendarApi.changeView('timeGridDay', date);

  const buttonGroup = shadowRoot?.querySelector('.sc-calendar-view-buttons');
  if (buttonGroup) {
    (buttonGroup as any).value = ['timeGridDay'];
  }
}