import { html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import ScTheme from '../../styles/ScTheme.js';
import ScElement from '../../shared/sc-element.js';
import ScStatusFilterItemStyle from './ScStatusFilterItem.style.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-paragraph.js';

export type StatusFilterType =
  | 'locked'
  | 'on-hold'
  | 'archived'
  | 'draft'
  | 'missing'
  | 'information'
  | 'in-progress'
  | 'complete'
  | 'error'
  | 'rejected'
  | 'warning'
  | 'pending'
  | 'success'
  | 'minor-error'
  | 'critical';

export type StatusFilterSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Icon mapping for each status type
const STATUS_ICONS: Record<StatusFilterType, string> = {
  locked: 'lock--line',
  'on-hold': 'pause--fill',
  archived: 'email--fill',
  draft: 'dotted-circle',
  missing: 'questionmark-circle--fill',
  information: 'info-circle--fill',
  'in-progress': 'dotted-circle',
  complete: 'checkmark-circle--fill',
  success: 'checkmark-circle--fill',
  warning: 'info-circle--fill',
  pending: 'clock--fill',
  error: 'alert-triangle--fill',
  rejected: 'close-circle--fill',
  critical: 'alert-triangle--fill',
  'minor-error': 'warning-triangle--fill',
};

// Size mappings for child components
const ICON_SIZE_MAP: Record<
  StatusFilterSize,
  'xs' | 'sm' | 'md' | 'lg' | 'xl'
> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
};

const PARAGRAPH_SIZE_MAP: Record<StatusFilterSize, 'xs' | 'sm' | 'md' | 'lg'> =
  {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'lg',
  };

/**
 * Status Filter Item Component
 *
 * A selectable filter button for filtering content by status.
 * Displays an icon, label, and count.
 *
 * @element sc-status-filter-item
 * @fires sc-select - Internal event for group management
 */
export class ScStatusFilterItem extends ScElement {
  static styles = ScTheme.getStyles().concat([ScStatusFilterItemStyle]);

  /** Status type - determines icon and color palette */
  @property({ type: String, reflect: true }) type: StatusFilterType =
    'information';

  /** Size variant */
  @property({ type: String, reflect: true }) size: StatusFilterSize = 'md';

  /** Display label */
  @property({ type: String }) label = '';

  /** Count to display */
  @property({ type: Number }) count: number | null = null;

  /** Selected state */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Value for selection (defaults to label if not set) */
  @property({ type: String }) value = '';

  /** Internal index for group management */
  @property({ attribute: false }) index = -1;

  private _handleClick = (e: Event) => {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Toggle selected state
    this.selected = !this.selected;

    this.emit('sc-select', {
      detail: {
        index: this.index,
        value: this.value || this.label,
        selected: this.selected,
        target: this,
      },
    });
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick(e);
    }
  };

  render() {
    const classes = classMap({
      item: true,
      selected: this.selected,
      disabled: this.disabled,
    });

    const iconSize = ICON_SIZE_MAP[this.size] || 'md';
    const paragraphSize = PARAGRAPH_SIZE_MAP[this.size] || 'md';

    return html`
      <div
        class="${classes}"
        part="base"
        role="button"
        tabindex="${this.disabled ? -1 : 0}"
        aria-pressed="${this.selected}"
        aria-disabled="${this.disabled}"
        @click="${this._handleClick}"
        @keydown="${this._handleKeyDown}"
      >
        <div class="content">
          <sc-icon
            class="icon"
            name="${STATUS_ICONS[this.type]}"
            size="${iconSize}"
          ></sc-icon>
          <sc-paragraph
            class="label"
            size="${paragraphSize}"
            ellipsis
            rows="1"
            title="${this.label}"
            >${this.label}</sc-paragraph
          >
        </div>
        ${this.count !== null
          ? html`<sc-paragraph class="count" size="${paragraphSize}" rows="1"
              >${this.count}</sc-paragraph
            >`
          : nothing}
      </div>
    `;
  }
}
