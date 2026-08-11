import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScDate } from '../../../src/components/ScDate/ScDate.js';
import '../../../elements/sc-date.js';
import dayjs from 'dayjs/esm/index.js';
import utc from 'dayjs/esm/plugin/utc/index.js';
import timezone from 'dayjs/esm/plugin/timezone/index.js';

dayjs.extend(utc);
dayjs.extend(timezone);
describe('ScDate', () => {
  it('renders full date', async () => {
    const el = await fixture<ScDate>(html`<sc-date date=${'2018-05-18T03:04:05+06:00'}></sc-date>`);
    expect(el).to.not.equal(null);
    const spanEle = el.shadowRoot?.querySelector('span');
    const date = dayjs('2018-05-18T03:04:05+06:00');
    expect(spanEle).to.include.text(`${date.format('DD MMMM YYYY')}`); // 18 May 2018
  });

  it('renders full date with offset-num 8', async () => {
    const offsetNum = 8;
    const el = await fixture<ScDate>(html`<sc-date date=${'2018-05-18T03:04:05+06:00'} offset-num=${offsetNum} show-time></sc-date>`);
    expect(el).to.not.equal(null);
    const spanEle = el.shadowRoot?.querySelector('span');
    const date = dayjs('2018-05-18T03:04:05+06:00').utcOffset(60 * Number(offsetNum));
    expect(spanEle).to.include.text(`${date.format('DD MMMM YYYY・HH:mm:ss')}`); // 18 May 2018・05:04:05
  });

  it('renders full date with offset-num 0', async () => {
    const offsetNum = 0;
    const el = await fixture<ScDate>(html`<sc-date date=${'2018-05-18T03:04:05+06:00'} offset-num=${offsetNum} show-time></sc-date>`);
    expect(el).to.not.equal(null);
    const spanEle = el.shadowRoot?.querySelector('span');
    const date = dayjs('2018-05-18T03:04:05+06:00').utcOffset(60 * Number(offsetNum));
    expect(spanEle).to.include.text(`${date.format('DD MMMM YYYY・HH:mm:ss')}`); // 17 May 2018・21:04:05 
  });

  it('renders full date with date-type', async () => {
    const el = await fixture<ScDate>(html`<sc-date date-type="111" date=${'2018-05-18T03:04:05+06:00'} show-time></sc-date>`);
    expect(el).to.not.equal(null);
    const spanEle = el.shadowRoot?.querySelector('span');
    const date = dayjs('2018-05-18T03:04:05+06:00');
    expect(spanEle).to.include.text(`${date.format('DD MMMM YYYY・HH:mm:ss')}`); // 18 May 2018・05:04:05
  });

  it('render today', async () => {
    const el = await fixture<ScDate>(html`<sc-date .date=${new Date()} show-time show-timezone></sc-date>`);
    expect(el).to.not.equal(null);
    const spanEle = el.shadowRoot?.querySelector('span');
    expect(spanEle).to.include.text(`${dayjs().format('DD MMMM YYYY・HH:mm')  }`);
  });


  it('renders short date', async () => {
    const el = await fixture<ScDate>(html`<sc-date date-type="short-date" date=${'2025-06-16T09:05:52.831Z'} show-time show-timezone></sc-date>`);
    expect(el).to.not.equal(null);
    const spanEle = el.shadowRoot?.querySelector('span');
    const date = dayjs('2025-06-16T09:05:52.831Z');
    expect(spanEle).to.include.text(`${date.format('DD MMM YY・HH:mm:ss')} (UTC${date.format('Z')})`); // 16 Jun 25・17:05:52 (UTC+08:00)
  });

  it('renders invalid date', async () => {
    const el = await fixture<ScDate>(html`<sc-date date-type="short-date" date=${''} show-time show-timezone></sc-date>`);
    expect(el).to.not.equal(null);
    const spanEle = el.shadowRoot?.querySelector('span');
    expect(spanEle).to.include.text('-');
  });
});

