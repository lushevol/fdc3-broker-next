import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScTimerStyle from './ScTimer.style.js';
import ScElement from '../../shared/sc-element.js';
import '../../../elements/sc-badge.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-icon-button.js';
import { watch } from '../../shared/watch.js';
import '../../../elements/sc-label.js';
import { COMPACT_SIZE } from '../../shared/util.js';
import { classMap } from 'lit/directives/class-map.js';


interface Duration {
  unit: 'second' | 'minute' | 'hour';
  value: number;
}


enum SIZE {
  none = 'none',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}
export class ScTimer extends ScElement {
  static styles = ScTheme.getStyles().concat([ScTimerStyle]);

  @property({ type: String, attribute: 'duration-unit' }) durationUnit: any =
    'second';

  @property({ type: Number, attribute: 'duration-value' })
  durationValue: any = 60;

  @property({ attribute: 'label' }) label = '';

  @property({ type: Boolean, attribute: 'need-hour-digit' })
  needHourDigit?: boolean = false;

  @property({ type: Boolean, attribute: 'no-background' })
  noBackground?: boolean = false;

  @property() size: `${COMPACT_SIZE}` = COMPACT_SIZE.sm;

  @property({ type: Number, attribute: 'state-interval-time' }) stateIntervalTime = 10;

  @property({ attribute: 'time-out-message' }) timeOutMessage = '';

  @property({ type: Boolean }) truncate = false;

  @state() private seconds = this.durationValue;

  @state() private state: 'default' | 'warning' | 'alert' = 'default';


  @state() private duration: Duration = {
    unit: this.durationUnit,
    value: this.durationValue,
  };

  private intervalId: number | undefined;

  private endTime: any;

  private intervalCleared = false;

  private startTimeFlag = false;

  private previousState: 'default' | 'warning' | 'alert' = 'default';

  private getTotalDuration(duration: Duration): number {
    switch (duration.unit) {
      case 'second':
        return duration.value;
      case 'minute':
        return duration.value * 60;
      case 'hour':
        return duration.value * 3600;
      default:
        return duration.value;
    }
  }
  renderCustomStyle() {
    let fontSize;
    let borderRadius;
    let fontWeight;

    switch (this.size) {
      case SIZE.lg:
        fontSize = '1rem';
        borderRadius = '0.375rem';
        fontWeight = 500;
        break;
      case SIZE.md:
        fontSize = '0.875rem';
        borderRadius = '0.25rem';
        fontWeight = 400;
        break;
      case SIZE.sm:
        fontSize = '0.75rem';
        borderRadius = '0.25rem';
        fontWeight = 400;
        break;
    }

    const variableStyle = html` <style>
      :host .container {
        no-background: ${this.noBackground};
        border-radius:${borderRadius};
      }

      :host .content {
        font-size:${fontSize};
        font-weight:${fontWeight};
      }

    </style>`;
    return variableStyle;
  }

  firstUpdated() {
    this.seconds = this.getTotalDuration(this.duration);
    this.updateState();
    const deadTime = this.getDeadTime();
    this.endTime = deadTime;
    this.startTime();
    this.emitTimerStartEvent();
    this.startTimeFlag = true;
  }

  private updateTimer = () => {
    const now = Date.now();
    const remainingMilliseconds = this.endTime - now;
    const remTime = Math.ceil(remainingMilliseconds / 1000);
    if (remTime >= 0) {
      this.seconds = remTime;
      this.updateState();
    } else {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalCleared = true;
      }
      this.seconds = 0;
      this.updateState();
      this.emitTimerEndEvent();
    }
  };

  private getDeadTime(): number {
    return Date.now() + this.getTotalDuration(this.duration) * 1000;
  }

  private formatTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const format = (num: number) => (num < 10 ? `0${num}` : `${num}`);
    const formattedHours = this.needHourDigit ? `${format(hours)}:` : '';

    if (this.needHourDigit) {
      return `${formattedHours}${format(minutes)}:${format(seconds)}`;
    } else {
      return `${format(minutes)}:${format(seconds)}`;
    }
  }

  private getState(
    remSeconds: number,
    totalDuration: number,
    intervalTime: number
  ): 'default' | 'warning' | 'alert' {
    if (remSeconds > totalDuration - intervalTime) {
      return 'default';
    } else if (remSeconds > totalDuration - 2 * intervalTime) {
      return 'warning';
    } else {
      return 'alert';
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('seconds')) {
      this.state = this.getState(
        this.seconds,
        this.getTotalDuration(this.duration),
        this.stateIntervalTime
      );
    }
  }

  @watch('durationValue')
  handleDurationValueChanged() {
    this.updateDuration();
  }

  @watch('durationUnit')
  handleDurationUnitChanged() {
    this.updateDuration();
  }

  private updateDuration() {
    clearInterval(this.intervalId);
    this.intervalCleared = true;
    this.duration = { unit: this.durationUnit, value: this.durationValue };
    const totalMilliSeconds = this.getTotalDuration(this.duration) * 1000;
    this.endTime = Date.now() + totalMilliSeconds;
    this.seconds = Math.ceil(totalMilliSeconds / 1000);

    this.updateState();
    this.startTime();

    const deadTime = this.getDeadTime();
    this.endTime = deadTime;
    this.intervalId = window.setInterval(this.updateTimer, 1000);
    this.intervalCleared = false;

    if (this.startTimeFlag === true) {
      this.emitTimerStartEvent();
    }
  }

  private startTime() {
    if (this.intervalCleared) {
      this.updateTimer();
      this.intervalCleared = false;
    }
  }
  private updateState() {
    const newState = this.getState(
      this.seconds,
      this.getTotalDuration(this.duration),
      this.stateIntervalTime
    );
    if (newState !== this.state) {
      this.previousState = this.state;
      this.state = newState;
      this.updateHostState();
      this.emitTimerTickEvent();
    }
  }

  updateHostState() {
    this.classList.remove('default', 'warning', 'alert');
    this.classList.add(this.state);
  }
  handleLabelName() {
    return this.seconds === 0 && this.timeOutMessage
      ? this.timeOutMessage
      : this.label;
  }

  connectedCallback() {
    super.connectedCallback();
    this.seconds = this.getTotalDuration(this.duration);
    this.startTime();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.intervalId);
    this.intervalCleared = true;
  }

  private emitTimerStartEvent() {
    this.emit('sc-timer-start', {
      detail: { duration: this.duration, totalSeconds: this.seconds },
      bubbles: true,
      composed: true,
    });
  }

  private emitTimerEndEvent() {
    this.emit('sc-timer-end', {
      detail: {
        duration: this.duration,
        totalSeconds: this.getTotalDuration(this.duration),
      },
      bubbles: true,
      composed: true,
    });
  }

  private emitTimerTickEvent() {
    this.emit('sc-timer-tick', {
      detail: {
        remainingSeconds: this.seconds,
        previousState: this.previousState,
        currentState: this.state,
        formattedTime: this.formatTime(this.seconds),
      },
      bubbles: true,
      composed: true,
    });
  }

  render() {
    const iconSize = this.size === 'lg' ? '' : this.size === 'md' ? 'xs' : 'xss';

    return html`
        ${this.renderCustomStyle()}
        <div
          class=${classMap({
            container: true,
            [this.size]: true,
            [this.state]: true,
            'no-background': !!this.noBackground,
            'sc-truncate': this.truncate,
          })}
        >
          <div class='content'>${this.handleLabelName()}</div>
          <div class='icon-container'>
            <sc-icon
              name='clock--fill'
              size='${iconSize}'
            ></sc-icon>
            <div class='time'>
              ${this.formatTime(this.seconds)}
            </div>
          </div>
        </div>
    `;
  }
}