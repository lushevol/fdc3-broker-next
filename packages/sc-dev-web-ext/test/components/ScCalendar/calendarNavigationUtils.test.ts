import { expect } from '@open-wc/testing';
import {
  navigateToWorkWeek,
  navigateToWeek,
  navigateToDay,
} from '../../../src/components/ScCalendar/calendarNavigationUtils.js';

describe('calendarNavigationUtils', () => {
  let calendarApi: any;
  let _calendar: any;
  let shadowRoot: ShadowRoot;
  let buttonGroup: any;
  let sinon: any;

  beforeEach(() => {
    sinon = require('sinon');
    calendarApi = {
      changeView: sinon.spy(),
    };
    _calendar = {
      setOption: sinon.spy(),
    };
    const host = document.createElement('div');
    shadowRoot = host.attachShadow({ mode: 'open' });
    buttonGroup = document.createElement('div');
    buttonGroup.classList.add('sc-calendar-view-buttons');
    shadowRoot.appendChild(buttonGroup);
  });

  it('navigateToWorkWeek sets weekends false and changes view', () => {
    const date = new Date('2025-03-19'); // Wednesday
    navigateToWorkWeek({ date, calendarApi, _calendar, shadowRoot });
    expect(calendarApi.changeView).to.have.been.calledWith('workWeek');
    expect(_calendar.setOption).to.have.been.calledWith('weekends', false);
    expect(buttonGroup.value).to.deep.equal(['workWeek']);
  });

  it('navigateToWeek sets weekends true and changes view', () => {
    const date = new Date('2025-03-19'); // Wednesday
    navigateToWeek({ date, calendarApi, _calendar, shadowRoot });
    expect(calendarApi.changeView).to.have.been.calledWith('timeGridWeek');
    expect(_calendar.setOption).to.have.been.calledWith('weekends', true);
    expect(buttonGroup.value).to.deep.equal(['timeGridWeek']);
  });

  it('navigateToDay sets dayHeaderContent and changes view', () => {
    const date = new Date('2025-03-19');
    navigateToDay({ date, calendarApi, _calendar, shadowRoot, locale: 'en' });
    expect(_calendar.setOption).to.have.been.calledWith('dayHeaderContent');
    expect(calendarApi.changeView).to.have.been.calledWith('timeGridDay', date);
    expect(buttonGroup.value).to.deep.equal(['timeGridDay']);
  });

  it('navigateToWorkWeek does not set buttonGroup value if not present', () => {
    const date = new Date('2025-03-19');
    const fakeShadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
    navigateToWorkWeek({ date, calendarApi, _calendar, shadowRoot: fakeShadowRoot });
    expect(calendarApi.changeView).to.have.been.calledWith('workWeek');
    expect(_calendar.setOption).to.have.been.calledWith('weekends', false);
    // No buttonGroup, so value should be undefined
    expect(fakeShadowRoot.querySelector('.sc-calendar-view-buttons')).to.be.null;
  });

  it('navigateToWeek does not set buttonGroup value if not present', () => {
    const date = new Date('2025-03-19');
    const fakeShadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
    navigateToWeek({ date, calendarApi, _calendar, shadowRoot: fakeShadowRoot });
    expect(calendarApi.changeView).to.have.been.calledWith('timeGridWeek');
    expect(_calendar.setOption).to.have.been.calledWith('weekends', true);
    expect(fakeShadowRoot.querySelector('.sc-calendar-view-buttons')).to.be.null;
  });

  it('navigateToDay does not set buttonGroup value if not present', () => {
    const date = new Date('2025-03-19');
    const fakeShadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
    navigateToDay({ date, calendarApi, _calendar, shadowRoot: fakeShadowRoot, locale: 'en' });
    expect(_calendar.setOption).to.have.been.calledWith('dayHeaderContent');
    expect(calendarApi.changeView).to.have.been.calledWith('timeGridDay', date);
    expect(fakeShadowRoot.querySelector('.sc-calendar-view-buttons')).to.be.null;
  });
});
