/**
 * Utility functions for replacing and customizing calendar DOM elements.
 * Each function expects the necessary context (shadowRoot, calendarApi, etc.) as arguments.
 */

export function replaceButtons(ctx: {
  shadowRoot: ShadowRoot | null,
  calendarApi: any,
  currentView: string,
  locale: string,
  handleClick: (type: string, payload?: any) => void,
  handleDropdownSelect: (event: any) => void,
  _calendar: any,
}) {
  replaceViewButtons(ctx);
  replaceEventButton(ctx);
}

export function replaceEventButton({
  shadowRoot,
  handleDropdownSelect,
}: {
  shadowRoot: ShadowRoot | null,
  handleDropdownSelect: (event: any) => void,
}) {
  const existingDropdownButton = shadowRoot?.querySelector('.sc-calendar-new-event-button');
  if (existingDropdownButton) return;
  const newEventButton = shadowRoot?.querySelector('.fc-newEventButton-button');
  if (newEventButton) {
    const dropdownButton = document.createElement('sc-button-dropdown');
    dropdownButton.setAttribute('button-text', 'New');
    dropdownButton.setAttribute('type', 'primary');
    dropdownButton.setAttribute('size', 'sm');
    dropdownButton.classList.add('sc-calendar-new-event-button');

    const option1 = document.createElement('sc-dropdown-option');
    option1.setAttribute('value', 'appointment');
    option1.textContent = 'Appointment';

    const option2 = document.createElement('sc-dropdown-option');
    option2.setAttribute('value', 'meeting');
    option2.textContent = 'Meeting';

    dropdownButton.appendChild(option1);
    dropdownButton.appendChild(option2);

    dropdownButton.addEventListener('sc-select', (event: any) => handleDropdownSelect(event));
    newEventButton.replaceWith(dropdownButton);
  }
}

export function replaceViewButtons(ctx: {
  shadowRoot: ShadowRoot | null,
  calendarApi: any,
  currentView: string,
  locale: string,
  _calendar: any,
}) {
  const { shadowRoot, calendarApi, locale, _calendar } = ctx;
  const existingCustomButtonGroup = shadowRoot?.querySelector('.sc-calendar-view-buttons');
  if (existingCustomButtonGroup) return;

  const weekButton = shadowRoot?.querySelector('.fc .fc-timeGridWeek-button');
  const workWeekButton = shadowRoot?.querySelector('.fc .fc-workWeek-button');
  const dayButton = shadowRoot?.querySelector('.fc .fc-timeGridDay-button');
  const monthButton = shadowRoot?.querySelector('.fc .fc-dayGridMonth-button');

  if (weekButton && workWeekButton && dayButton && monthButton) {
    const buttonGroup = document.createElement('sc-button-group');
    buttonGroup.setAttribute('size', 'md');
    buttonGroup.setAttribute('label-size', 'md');
    buttonGroup.setAttribute('single-select', '');
    // @ts-ignore
    buttonGroup.value = ['workWeek'];
    ctx.currentView = 'workWeek';
    buttonGroup.classList.add('sc-calendar-view-buttons');

    const views = [
      { value: 'workWeek', label: 'Work week' },
      { value: 'timeGridWeek', label: 'Week' },
      { value: 'timeGridDay', label: 'Day' },
      { value: 'dayGridMonth', label: 'Month' },
    ];

    views.forEach(view => {
      const buttonGroupItem = document.createElement('sc-button-group-item');
      buttonGroupItem.setAttribute('value', view.value);
      buttonGroupItem.textContent = view.label;
      buttonGroup.appendChild(buttonGroupItem);
    });

    buttonGroup.addEventListener('sc-select', (event: any) => {
      const selectedView = event.detail.value.length > 0 ? event.detail.value[0] : 'workWeek';
      // @ts-ignore
      if (event.detail.value.length === 0) buttonGroup.value = ['workWeek'];
      ctx.currentView = selectedView;
      const currentDate = calendarApi.getDate();

      _calendar.setOption('dateIncrement', undefined);

      const setDayHeaderContent = (dayFormat: string) => (args: any) => {
        const today = new Date();
        const isToday = args.date.getDate() === today.getDate() &&
                        args.date.getMonth() === today.getMonth() &&
                        args.date.getFullYear() === today.getFullYear();
        const date = args.date.getDate();
        const day = args.date.toLocaleDateString('default', { weekday: dayFormat });

        return isToday
          ? { html: `<div class="fc-day-today" style="color: var(--sc-calendar-week-header-color, var(--sc-color-blue-460));">${date} ${day}</div>` }
          : { html: `${date} ${day}` };
      };

      if (selectedView === 'dayGridMonth') {
        const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        _calendar.setOption('weekends', true);
        _calendar.setOption('dayHeaderContent', undefined);
        calendarApi.changeView('dayGridMonth', firstOfMonth);
      } else if (selectedView === 'workWeek') {
        const mondayOfCurrentWeek = new Date(currentDate);
        mondayOfCurrentWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
        _calendar.setOption('weekends', false);
        _calendar.setOption('dayHeaderContent', setDayHeaderContent('long'));
        calendarApi.changeView('workWeek', mondayOfCurrentWeek);
      } else if (selectedView === 'timeGridDay') {
        _calendar.setOption('weekends', true);
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
        calendarApi.changeView('timeGridDay', currentDate);
      } else {
        const mondayOfCurrentWeek = new Date(currentDate);
        mondayOfCurrentWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));
        _calendar.setOption('weekends', true);
        _calendar.setOption('dayHeaderContent', setDayHeaderContent('short'));
        calendarApi.changeView('timeGridWeek', mondayOfCurrentWeek);
      }
    });

    weekButton.replaceWith(buttonGroup);
    workWeekButton.remove();
    dayButton.remove();
    monthButton.remove();
  }
}

// --- Date Picker Popup Utilities ---
export function addPopupOutsideClickListener({
  getPopup,
  onOutsideClick,
  isActive,
}: {
  getPopup: () => HTMLElement | null,
  onOutsideClick: () => void,
  isActive: () => boolean,
}) {
  const handler = (event: MouseEvent) => {
    if (!isActive()) return;
    const popup = getPopup();
    const path = event.composedPath();
    if (popup && !path.includes(popup)) {
      onOutsideClick();
    }
  };
  document.addEventListener('mousedown', handler, true);
  return () => document.removeEventListener('mousedown', handler, true);
}

export function openDatePicker(ctx: {
  setShowDatePicker: (val: boolean) => void;
  getPopup: () => HTMLElement | null;
  onClose: () => void;
  isActive: () => boolean;
  setRemoveListener: (fn: (() => void) | null) => void;
}) {
  ctx.setShowDatePicker(true);
  setTimeout(() => {
    const removeListener = addPopupOutsideClickListener({
      getPopup: ctx.getPopup,
      onOutsideClick: ctx.onClose,
      isActive: ctx.isActive,
    });
    ctx.setRemoveListener(removeListener);
  }, 0);
}

export function closeDatePicker(ctx: {
  setShowDatePicker: (val: boolean) => void;
  removeListener: (() => void) | null;
  setRemoveListener: (fn: (() => void) | null) => void;
}) {
  ctx.setShowDatePicker(false);
  if (ctx.removeListener) {
    ctx.removeListener();
    ctx.setRemoveListener(null);
  }
}