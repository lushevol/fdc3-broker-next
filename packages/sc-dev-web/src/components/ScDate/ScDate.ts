import { html } from 'lit';
import { property } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScDateStyle from './ScDate.style.js';
import ScElement from '../../shared/sc-element.js';
import { COMPACT_SIZE } from '../../shared/util.js';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs/esm/index.js';
import utc from 'dayjs/esm/plugin/utc/index.js';
import timezone from 'dayjs/esm/plugin/timezone/index.js';

dayjs.extend(utc);
dayjs.extend(timezone);

type Timer = string | number | Date | Dayjs;

export class ScDate extends ScElement {
  static styles = ScTheme.getStyles().concat([ScDateStyle]);

  @property({ attribute: 'date' }) date: Timer = new Date();

  @property({ attribute: 'offset-num' }) offsetNum: null | 0 | 8 | '0' | '8' = null;

  @property({ attribute: 'date-type' }) dateType: 'full-date' | 'short-date' = 'full-date';
  
  @property({ type: String }) size: `${COMPACT_SIZE}` = COMPACT_SIZE.sm;

  @property({ type: Boolean, attribute: 'show-time' })
  showTime?: boolean = false;

  @property({ type: Boolean, attribute: 'time-only' })
  timeOnly?: boolean = false;

  @property({ type: Boolean, attribute: 'hide-seconds' })
  hideSeconds?: boolean = false;

  @property({ type: Boolean, attribute: 'show-timezone' })
  showTimeZone?: boolean = false;

  private formatTime(time: Timer) {
    if (!this.isValidDate(time)) { // invalid-date
      return '-';
    }
    let date = null;
    if (['0','8'].includes(this.offsetNum as string)) {
      date = dayjs(time as string).utcOffset(60 * Number(this.offsetNum));
    }
    else {
      date = dayjs(time as string); 
    }
    const fullTimeStr = this.timeOnly ? '' : 'DD MMMM YYYY';
    const shortTimeStr = this.timeOnly ? '' : 'DD MMM YY';
    const label = (this.timeOnly || !this.showTime)  ? '' : '・';
    let timeStr = this.hideSeconds ? 'HH:mm' : 'HH:mm:ss';
    timeStr = (!this.showTime && !this.timeOnly) ? '' : timeStr;
    const UTCStr = !this.showTimeZone ? '' : ` (UTC${date.format('Z')})`;
    let formatStr = '';
    switch (this.dateType) {
      case 'full-date': // DD MMM YYYY • HH:MM:SS (UTC+XX:XX)
        formatStr = fullTimeStr + label + timeStr;
        break;
      case 'short-date': // DD MMM YY • HH:MM:SS (UTC+XX:XX)
        formatStr = shortTimeStr + label + timeStr;
        break;
      default:
        formatStr = 'DD MMM YYYY・HH:mm:ss';
    }
    return date.format(formatStr) + UTCStr;
  }

  isValidDate(dateInput: Timer) {
    return dayjs(dateInput as string).isValid();
  }

  render() {
    return html`
      <div class='container ${this.size}'>
        <span class='time'>
          ${this.formatTime(this.date)}
        </span>
      </div>
    `;
  }
}