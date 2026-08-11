import { expect } from '@open-wc/testing';
import { replaceButtons, replaceEventButton, replaceViewButtons, addPopupOutsideClickListener, openDatePicker, closeDatePicker } from '../../../src/components/ScCalendar/calendarDomUtils.js';
import { expect as jestExpect } from '@jest/globals';

describe('calendarDomUtils', () => {
  let shadowRoot: ShadowRoot;
  let calendarApi: any;
  let handleClick: jest.Mock;
  let handleDropdownSelect: jest.Mock;
  let _calendar: any;

  beforeEach(() => {
    const host = document.createElement('div');
    shadowRoot = host.attachShadow({ mode: 'open' });
    calendarApi = {
      prev: jest.fn(),
      next: jest.fn(),
      today: jest.fn(),
      getDate: jest.fn(() => new Date(2025, 2, 17)),
      changeView: jest.fn(),
    };
    handleClick = jest.fn();
    handleDropdownSelect = jest.fn();
    _calendar = {
      setOption: jest.fn(),
    };
  });

  it('replaceEventButton replaces new event button with dropdown', () => {
    const fcNewEvent = document.createElement('button');
    fcNewEvent.classList.add('fc-newEventButton-button');
    shadowRoot.appendChild(fcNewEvent);

    replaceEventButton({ shadowRoot, handleDropdownSelect });
    expect(shadowRoot.querySelector('.sc-calendar-new-event-button')).to.exist;
    expect(shadowRoot.querySelector('sc-button-dropdown')).to.exist;
  });

  it('replaceEventButton does nothing if dropdown exists', () => {
    const dropdown = document.createElement('div');
    dropdown.classList.add('sc-calendar-new-event-button');
    shadowRoot.appendChild(dropdown);

    replaceEventButton({ shadowRoot, handleDropdownSelect });
    expect(shadowRoot.querySelectorAll('.sc-calendar-new-event-button').length).to.equal(1);
  });

  it('replaceViewButtons replaces view buttons with button group', () => {
    const fc = document.createElement('div');
    fc.classList.add('fc');
    const weekBtn = document.createElement('button');
    weekBtn.classList.add('fc-timeGridWeek-button');
    const workWeekBtn = document.createElement('button');
    workWeekBtn.classList.add('fc-workWeek-button');
    const dayBtn = document.createElement('button');
    dayBtn.classList.add('fc-timeGridDay-button');
    const monthBtn = document.createElement('button');
    monthBtn.classList.add('fc-dayGridMonth-button');
    fc.appendChild(weekBtn);
    fc.appendChild(workWeekBtn);
    fc.appendChild(dayBtn);
    fc.appendChild(monthBtn);
    shadowRoot.appendChild(fc);

    replaceViewButtons({
      shadowRoot,
      calendarApi,
      currentView: 'workWeek',
      locale: 'en',
      _calendar,
    });
    expect(shadowRoot.querySelector('.sc-calendar-view-buttons')).to.exist;
    expect(shadowRoot.querySelector('sc-button-group')).to.exist;
  });

  it('replaceButtons calls all replace functions', () => {
    // Add all required buttons
    const fcPrev = document.createElement('button');
    fcPrev.classList.add('fc-prev-button');
    const fcNext = document.createElement('button');
    fcNext.classList.add('fc-next-button');
    const fcToday = document.createElement('button');
    fcToday.classList.add('fc-today-button');
    const fcShare = document.createElement('button');
    fcShare.classList.add('fc-shareButton-button');
    const fcNewEvent = document.createElement('button');
    fcNewEvent.classList.add('fc-newEventButton-button');
    const fc = document.createElement('div');
    fc.classList.add('fc');
    const weekBtn = document.createElement('button');
    weekBtn.classList.add('fc-timeGridWeek-button');
    const workWeekBtn = document.createElement('button');
    workWeekBtn.classList.add('fc-workWeek-button');
    const dayBtn = document.createElement('button');
    dayBtn.classList.add('fc-timeGridDay-button');
    const monthBtn = document.createElement('button');
    monthBtn.classList.add('fc-dayGridMonth-button');
    fc.appendChild(weekBtn);
    fc.appendChild(workWeekBtn);
    fc.appendChild(dayBtn);
    fc.appendChild(monthBtn);

    shadowRoot.appendChild(fcPrev);
    shadowRoot.appendChild(fcNext);
    shadowRoot.appendChild(fcToday);
    shadowRoot.appendChild(fcShare);
    shadowRoot.appendChild(fcNewEvent);
    shadowRoot.appendChild(fc);

    replaceButtons({
      shadowRoot,
      calendarApi,
      currentView: 'workWeek',
      locale: 'en',
      handleClick,
      handleDropdownSelect,
      _calendar,
    });

    expect(shadowRoot.querySelector('.sc-calendar-view-buttons')).to.exist;
    expect(shadowRoot.querySelector('.sc-calendar-new-event-button')).to.exist;
    expect(shadowRoot.querySelector('.sc-calendar-view-buttons')).to.exist;
  });

  it('replaceViewButtons does nothing if any required view button is missing', () => {
    const fc = document.createElement('div');
    fc.classList.add('fc');
    const weekBtn = document.createElement('button');
    weekBtn.classList.add('fc-timeGridWeek-button');
    fc.appendChild(weekBtn);
    shadowRoot.appendChild(fc);

    replaceViewButtons({
      shadowRoot,
      calendarApi,
      currentView: 'workWeek',
      locale: 'en',
      _calendar,
    });
    expect(shadowRoot.querySelector('.sc-calendar-view-buttons')).to.not.exist;
  });

  it('replaceViewButtons does nothing if custom button group exists', () => {
    const customGroup = document.createElement('div');
    customGroup.classList.add('sc-calendar-view-buttons');
    shadowRoot.appendChild(customGroup);

    replaceViewButtons({
      shadowRoot,
      calendarApi,
      currentView: 'workWeek',
      locale: 'en',
      _calendar,
    });
    expect(shadowRoot.querySelectorAll('.sc-calendar-view-buttons').length).to.equal(1);
  });

  it('replaceViewButtons sc-select event changes view and calls calendarApi/changeView', () => {
    const fc = document.createElement('div');
    fc.classList.add('fc');
    const weekBtn = document.createElement('button');
    weekBtn.classList.add('fc-timeGridWeek-button');
    const workWeekBtn = document.createElement('button');
    workWeekBtn.classList.add('fc-workWeek-button');
    const dayBtn = document.createElement('button');
    dayBtn.classList.add('fc-timeGridDay-button');
    const monthBtn = document.createElement('button');
    monthBtn.classList.add('fc-dayGridMonth-button');
    fc.appendChild(weekBtn);
    fc.appendChild(workWeekBtn);
    fc.appendChild(dayBtn);
    fc.appendChild(monthBtn);
    shadowRoot.appendChild(fc);

    replaceViewButtons({
      shadowRoot,
      calendarApi,
      currentView: 'workWeek',
      locale: 'en',
      _calendar,
    });

    const buttonGroup = shadowRoot.querySelector('.sc-calendar-view-buttons');
    expect(buttonGroup).to.exist;

    buttonGroup?.dispatchEvent(new CustomEvent('sc-select', {
      detail: { value: ['dayGridMonth'] },
    }));
    jestExpect(_calendar.setOption).toHaveBeenCalledWith('weekends', true);

    buttonGroup?.dispatchEvent(new CustomEvent('sc-select', {
      detail: { value: ['workWeek'] },
    }));
    jestExpect(_calendar.setOption).toHaveBeenCalledWith('weekends', false);

    buttonGroup?.dispatchEvent(new CustomEvent('sc-select', {
      detail: { value: ['timeGridDay'] },
    }));
    jestExpect(_calendar.setOption).toHaveBeenCalledWith('weekends', true);

    buttonGroup?.dispatchEvent(new CustomEvent('sc-select', {
      detail: { value: ['timeGridWeek'] },
    }));
    jestExpect(_calendar.setOption).toHaveBeenCalledWith('weekends', true);
  });
});

describe('calendarDomUtils utilities', () => {

  it('addPopupOutsideClickListener calls onOutsideClick when clicking outside', () => {
    const popup = document.createElement('div');
    document.body.appendChild(popup);
    let called = false;
    const remove = addPopupOutsideClickListener({
      getPopup: () => popup,
      onOutsideClick: () => { called = true; },
      isActive: () => true,
    });

    const evt = new MouseEvent('mousedown', { bubbles: true });
    document.body.dispatchEvent(evt);
    expect(called).to.be.true;
    remove();
    document.body.removeChild(popup);
  });

  it('addPopupOutsideClickListener does not call onOutsideClick when clicking inside', () => {
    const popup = document.createElement('div');
    document.body.appendChild(popup);
    let called = false;
    const remove = addPopupOutsideClickListener({
      getPopup: () => popup,
      onOutsideClick: () => { called = true; },
      isActive: () => true,
    });
    const evt = new MouseEvent('mousedown', { bubbles: true });
    popup.dispatchEvent(evt);
    expect(called).to.be.false;
    remove();
    document.body.removeChild(popup);
  });

  it('openDatePicker and closeDatePicker work as expected', done => {
    let show = false;
    let removeListenerCalled = false;
    let removeListener: (() => void) | null = null;
    const ctx = {
      setShowDatePicker: (val: boolean) => { show = val; },
      getPopup: () => null,
      onClose: () => {},
      isActive: () => true,
      setRemoveListener: (fn: (() => void) | null) => { removeListener = fn; },
    };
    openDatePicker(ctx);
    setTimeout(() => {
      expect(show).to.be.true;
      expect(typeof removeListener).to.equal('function');
      const closeCtx = {
        setShowDatePicker: (val: boolean) => { show = val; },
        removeListener: () => { removeListenerCalled = true; },
        setRemoveListener: (fn: (() => void) | null) => { removeListener = fn; },
      };
      closeDatePicker(closeCtx);
      expect(show).to.be.false;
      expect(removeListenerCalled).to.be.true;
      expect(removeListener).to.be.null;
      done();
    }, 10);
  });
});