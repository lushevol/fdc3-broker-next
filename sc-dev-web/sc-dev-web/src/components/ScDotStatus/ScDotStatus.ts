import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import '../../../elements/sc-icon.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import { MODE } from '../../shared/util.js';

enum DOT_TYPE {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
  neutral = 'neutral',
  'minor-error' = 'minor-error',
  pending = 'pending',
  draft = 'draft',
  'urgent-error' = 'urgent-error'
}

enum DOT_STATUS {
  'error' = 'error',
  'minor-error' = 'minor-error',
  'warning' = 'warning',
  'success' = 'success',
  'partially-success' = 'partially-success',
  'pending-approval' = 'pending-approval',
  'pending' = 'pending',
  'info' = 'info',
  'draft' = 'draft',
  'missing-info' = 'missing-info',
  'rejected' = 'rejected',
  'on-hold' = 'on-hold',
  'not-started' = 'not-started',
}

const DEFAULT_STATUS_INFO = {
  error: {
    icon: {
      default: 'alert-triangle--fill',
      outline: 'alert-triangle--line',
    },
  },
  'minor-error': {
    icon: {
      default: 'alert-inverted-triangle--fill',
      outline: 'alert-inverted-triangle--line',
    },
  },
  warning: {
    icon: {
      default: 'alert-circle--fill',
      outline: 'alert-circle--line',
    },
  },
  success: {
    icon: {
      default: 'checkmark-circle--fill',
      outline: 'checkmark-circle--line',
    },
  },
  'partially-success': {
    icon: {
      default: 'divided-circle--fill',
      outline: 'divided-circle--line',
    },
  },
  pending: {
    icon: {
      default: 'clock--fill',
      outline: 'clock--line',
    },
  },
  info: {
    icon: {
      default: 'info-circle--fill',
      outline: 'info-circle--line',
    },
  },
  draft: {
    icon: {
      default: 'timer-circle--fill',
      outline: 'timer-circle--line',
    },
  },
  'missing-info': {
    icon: {
      default: 'questionmark-circle--fill',
      outline: 'questionmark-circle--line',
    },
  },
  rejected: {
    icon: {
      default: 'close-circle--fill',
      outline: 'close-circle--line',
    },
  },
  'on-hold': {
    icon: {
      default: 'pause--fill',
      outline: 'pause--line',
    },
  },
  'not-started': {
    icon: {
      default: 'minus-circle--fill',
      outline: 'minus-circle--line',
    },
  },
};

export class ScDotStatus extends ScElement {
  constructor() {
    super();
  }

  @property() mode: `${MODE}` = MODE.default;
  @property() type: `${DOT_TYPE}` = DOT_TYPE.neutral;
  @property() status: `${DOT_STATUS}` = DOT_STATUS.draft;
  @property({ type: Boolean, reflect: true }) outline = false;
  @property({ type: String }) label = '';
  @property({ type: Boolean, reflect: true }) inline = false;
  @property({ type: Boolean, reflect: true }) compact = false;

  static styles = ScTheme.getStyles();

  renderStyle() {
    const baseStyle = html`
      <style>
        .sc-dot-status {
          display: ${this.inline ? 'inline-table' : 'table'};
        }
        .sc-dot-status .dot {
          border-radius: 5px;
          width: 10px;
          height: 10px;
          margin-right: 8px;
        }
        .sc-dot-status sc-icon {
          display: inline-block;
          vertical-align: middle;
          margin-right: var(--sc-spacing-8);
        }
        .sc-dot-status span.label {
          color: var(--sc-dot-status-text-color, var(--sc-color-blue-900));
          font-size: 0.875rem;
          font-weight: 400;
          line-height: 1.5rem;
        }
        .sc-dot-status span {
          display: inline-block;
        }
      </style>
    `;

    let dotCBackgroundColor = 'transparent';
    if (this.mode === 'default') {
      switch (this.type) {
        case 'info':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-info-background-color, var(--sc-color-blue-500))';
          break;
        case 'success':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-success-background-color, var(--sc-color-green-500))';
          break;
        case 'warning':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-warning-background-color, var(--sc-color-amber-500))';
          break;
        case 'error':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-error-background-color, var(--sc-color-red-500))';
          break;
        case 'minor-error':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-minor-error-background-color, var(--sc-shades-orange-500))';
          break;
        case 'pending':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-pending-background-color, var(--sc-shades-teal-500))';
          break;
        case 'draft':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-draft-background-color, var(--sc-shades-purple-500))';
          break;
        case 'urgent-error':
          dotCBackgroundColor =
            'var(--sc-dot-status-default-urgent-error-background-color, var(--sc-color-grey-900))';
          break;
        case 'neutral':
        default:
          dotCBackgroundColor =
            'var(--sc-dot-status-default-disabled-background-color, var(--sc-color-grey-250))';
          break;
      }
    }

    const dotStyle = html`<style>
      .sc-dot-status .dot {
        background-color: ${dotCBackgroundColor};
      }
    </style>`;

    let iconColor = 'transparent';
    if (this.mode === 'icon') {
      switch (this.status) {
        case 'error':
          iconColor =
            'var(--sc-dot-status-advanced-error-icon-color, var(--sc-color-red-500))';
          break;
        case 'minor-error':
          iconColor =
            'var(--sc-dot-status-advanced-minor-error-icon-color, var(--sc-shades-orange-500))';
          break;
        case 'warning':
          iconColor =
            'var(--sc-dot-status-advanced-warning-icon-color, var(--sc-color-amber-500))';
          break;
        case 'success':
          iconColor =
            'var(--sc-dot-status-advanced-success-icon-color, var(--sc-color-green-500))';
          break;
        case 'partially-success':
        case 'pending-approval':
          iconColor =
            'var(--sc-dot-status-advanced-pending-approval-icon-color, var(--sc-color-green-500))';
          break;
        case 'pending':
          iconColor =
            'var(--sc-dot-status-advanced-pending-icon-color, var(--sc-shades-teal-500))';
          break;
        case 'info':
          iconColor =
            'var(--sc-dot-status-advanced-info-icon-color, var(--sc-color-blue-500))';
          break;
        case 'draft':
          iconColor =
            'var(--sc-dot-status-advanced-draft-icon-color, var(--sc-shades-purple-500))';
          break;
        case 'rejected':
          iconColor =
            'var(--sc-dot-status-advanced-rejected-icon-color, var(--sc-color-red-600))';
          break;
        case 'on-hold':
          iconColor =
            'var(--sc-dot-status-advanced-on-hold-icon-color, var(--sc-color-grey-400))';
          break;
        case 'not-started':
          iconColor =
            'var(--sc-dot-status-advanced-not-started-icon-color, var(--sc-color-grey-400))';
          break;
        default:
          iconColor =
            'var(--sc-dot-status-advanced-missing-info-icon-color, var(--sc-color-grey-400))';
          break;
      }
    }

    const iconStyle = html`
      <style>
        .sc-dot-status sc-icon {
          color: ${iconColor};
        }
      </style>
    `;

    return html` ${baseStyle} ${this.mode === 'icon' ? iconStyle : dotStyle}`;
  }

  renderLabel() {
    if (this.compact) {
      return;
    } else if (this.label)
      return html`<span class="label">${this.label}</span>`;

    return html`<span class="label"></span>`;
  }

  render() {
    const iconName =
      this.mode === 'icon' && this.status in DEFAULT_STATUS_INFO
        ? this.outline
          ? (DEFAULT_STATUS_INFO as any)[this.status].icon.outline
          : (DEFAULT_STATUS_INFO as any)[this.status].icon.default
        : this.outline
        ? 'questionmark-circle--line'
        : 'questionmark-circle--fill';
    return this.mode === 'icon'
      ? html`
          ${this.renderStyle()}
          <span class="sc-dot-status">
            <sc-icon name="${iconName}" size="sm" compact></sc-icon>
            ${this.renderLabel()}
          </span>
        `
      : html`
          ${this.renderStyle()}
          <span class="sc-dot-status">
            <span class="dot"></span>
            ${this.renderLabel()}
          </span>
        `;
  }
}
