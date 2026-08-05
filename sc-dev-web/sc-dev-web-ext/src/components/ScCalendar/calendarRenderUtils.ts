import { html, render } from 'lit-html';
import { EventContentArg, DayCellMountArg } from '@fullcalendar/core';
import { colorMapping, colorClassMapping } from './constants.js';

// @ts-ignore
export function createEventContent(arg: EventContentArg) {
  const container = document.createElement('div');
  container.className = 'sc-calendar-event-container';

  const statusBlockWrapper = document.createElement('div');
  statusBlockWrapper.style.display = 'flex';
  statusBlockWrapper.style.alignItems = 'stretch';

  const statusBlock = document.createElement('div');
  statusBlock.className = `sc-calendar-event-status-block
    ${!arg.event.allDay && arg.view.type === 'dayGridMonth' ? 'month-view' : ''}
    ${arg.event.allDay && arg.view.type === 'dayGridMonth' ? 'month-view-all-day' : ''}`;

  const calendarSource = arg.event.extendedProps?.calendarSource;
  let backgroundColor: string;
  if (calendarSource && !calendarSource.isDefault) {
    const sourceName = calendarSource.name || 'default';
    backgroundColor = colorMapping[sourceName]?.fill || 'var(--sc-calendar-event-blue-background-color, var(--sc-color-blue-100))'; // Use `fill` explicitly
  } else {
    backgroundColor = arg.event.extendedProps?.showAs === 'oof' 
      ? 'var(--sc-calendar-event-oof-background-color, var(--sc-color-purple-100))' 
      : 'var(--sc-calendar-event-blue-background-color, var(--sc-color-blue-100))';
  }

  const colorName = Object.keys(colorClassMapping).find(color => backgroundColor?.includes(color));
  const primaryColor = colorClassMapping[colorName || 'default'].stroke;
  const constantColor = colorClassMapping[colorName || 'default'].constantStroke;

  switch (arg.event.extendedProps?.showAs) {
  case 'tentative':
    setTimeout(() => {
      const containerHeight = Math.max(0, statusBlock.clientHeight - 2);
  
      const generateUniqueIdTentative = () => `mask_${Math.random().toString(36).substring(2, 11)}`;
      const maskIdTentative = generateUniqueIdTentative();
  
      const tentativePathData = `
            M0 4C0 1.79086 1.79086 0 4 0H8V${containerHeight}H4C1.79086 ${containerHeight} 
            0 ${Math.max(0, containerHeight - 2.20914)} 0 ${Math.max(0, containerHeight - 4)}V4Z
          `;
  
      const tentativeTemplate = html`
            <svg xmlns="http://www.w3.org/2000/svg" width="8" height="${containerHeight}" 
              viewBox="0 0 8 ${containerHeight}" fill="none">
              <mask id="${maskIdTentative}" style="mask-type:alpha" maskUnits="userSpaceOnUse" 
                x="0" y="0" width="8" height="${containerHeight}">
                <path 
                  d="${tentativePathData}" 
                  fill="${constantColor}"/>
              </mask>
              <g mask="url(#${maskIdTentative})">
                <rect x="-29" y="24.1514" width="53.9539" height="65.683" transform="rotate(-45 -29 24.1514)" 
                  fill="var(--sc-calendar-tentative-bg-color, var(--sc-color-white))"/>
                <rect x="-10" y="-40" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-25" y="-40" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-40" y="-40" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-55" y="-100" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-70" y="-100" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-85" y="-100" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-100" y="-160" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-115" y="-160" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-130" y="-160" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-145" y="-220" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-160" y="-220" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-175" y="-220" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-190" y="-280" width="4.22248" height="140" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-205" y="-280" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
                <rect x="-221" y="-280" width="4.22248" height="100" transform="rotate(-135)" 
                  fill="${constantColor}"/>
              </g>
            </svg>`;
      render(tentativeTemplate, statusBlock);
  
      statusBlock.style.backgroundColor = `var(
            --sc-calendar-tentative-status-background-color, 
            var(--sc-color-white))
          `;
    }, 0);
    break;
  case 'workingElsewhere':
    setTimeout(() => {
      const containerHeight = statusBlock.clientHeight - 2;
      const generateUniqueIdWE = () => `mask_${  Math.random().toString(36).substring(2, 11)}`;
      const maskIdWE = generateUniqueIdWE();
      const wePathData = `
          M0 4C0 1.79086 1.79086 0 4 0H8V${containerHeight}H4C1.79086 ${containerHeight} 
          0 ${containerHeight - 2.20914} 0 ${containerHeight - 4}V4Z
        `;
    
      const workingElsewhereTemplate = html`
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="${containerHeight}" 
            viewBox="0 0 8 ${containerHeight}" fill="none"
            >
            <mask id="${maskIdWE}" style="mask-type:alpha" maskUnits="userSpaceOnUse" 
              x="0" y="0" width="8" height="${containerHeight}"
              >
              <path 
                d="${wePathData}" 
                fill="${constantColor}"/>
            </mask>
            <g mask="url(#${maskIdWE})">
              <circle cx="1.4166" cy="18.0807" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="1.4166" cy="0.581644" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="1.4166" cy="23.9137" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="1.4166" cy="6.41465" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="1.4166" cy="12.2477" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="7.24986" cy="18.0807" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="7.24986" cy="0.581644" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="7.24986" cy="23.9137" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="7.24986" cy="6.41465" r="1.4166" 
                fill="${constantColor}"/>
              <circle cx="7.24986" cy="12.2477" r="1.4166" 
                fill="${constantColor}"/>
            </g>
          </svg>`;
      render(workingElsewhereTemplate, statusBlock);
      statusBlock.style.backgroundColor = `var(
          --sc-calendar-working-elsewhere-status-background-color, 
          var(--sc-color-white))
        `;
    }, 0);
    break;
  case 'busy':
    statusBlock.style.background = primaryColor;
    break;
  case 'oof':
    statusBlock.style.backgroundColor = 'var(--sc-calendar-oof-status-background-color, var(--sc-color-purple-700))';
    statusBlock.style.border = '1px solid var(--sc-calendar-oof-status-border-color, var(--sc-color-purple-700))';
    break;
  case 'free':
  default:
    statusBlock.style.backgroundColor = 'var(--sc-calendar-free-status-background-color, var(--sc-color-white))';
    statusBlock.style.border = `1px solid ${constantColor}`;
    break;
  }

  statusBlockWrapper.appendChild(statusBlock);
  container.appendChild(statusBlockWrapper);

  const createTextElement = (text: string, marginLeft: string) => {
    const textElement = document.createElement('div');
    render(html`${text}`, textElement);
    textElement.style.display = 'inline-block';
    textElement.style.marginLeft = marginLeft;
    return textElement;
  };
  
  if (!arg.event.allDay) {
    if (arg.view.type === 'dayGridMonth') {
      const timeText = createTextElement(arg.timeText, '0.8rem');
      timeText.className = 'sc-calendar-event-time-text sc-calendar-event-month-view';
      container.appendChild(timeText);
  
      const titleText = createTextElement(arg.event.title, '0.3rem');
      titleText.className = 'sc-calendar-event-title-text sc-calendar-event-month-view';
      container.appendChild(titleText);
    } else {
      const titleText = createTextElement(arg.event.title, '0.8rem');
      titleText.className = 'sc-calendar-event-title-text';
      container.appendChild(titleText);
    }
  } else {
    const titleText = createTextElement(arg.event.title, '0.8rem');
    titleText.className = 'sc-calendar-event-title-text sc-calendar-event-all-day';
    container.appendChild(titleText);
  }

  if (!arg.event.allDay && arg.event.extendedProps?.status !== 'Out of Office') {
    container.style.backgroundColor = `${backgroundColor}`;
  }

  if (arg.event.extendedProps?.sensitivity === 'private') {
    const lockIconElement = document.createElement('sc-icon');
    lockIconElement.setAttribute('name', 'lock--line');
    if (arg.view.type === 'dayGridMonth') {
      lockIconElement.setAttribute('size', 'xxs');
    } else {
      lockIconElement.setAttribute('size', 'sm');
    }
    lockIconElement.style.color = 'var(--sc-calendar-event-icon-color, var(--sc-color-blue-900))';
    lockIconElement.style.marginRight = '0.5rem';
    container.appendChild(lockIconElement);
  }
  
  if (arg.event.extendedProps?.recurrenceDetails) {
    if (arg.event.extendedProps?.recurrenceDetails.pattern.type !== 'no-repeat') {
      const syncIconElement = document.createElement('sc-icon');
      syncIconElement.setAttribute('name', 'sync');
      if (arg.view.type === 'dayGridMonth') {
        syncIconElement.setAttribute('size', 'xxs');
      } else {
        syncIconElement.setAttribute('size', 'xs');
      }
      syncIconElement.style.color = 'var(--sc-calendar-event-icon-color, var(--sc-color-blue-900))';
      syncIconElement.style.marginRight = '0.5rem';
      container.appendChild(syncIconElement);
    }
  }
  
  return { domNodes: [container] };
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