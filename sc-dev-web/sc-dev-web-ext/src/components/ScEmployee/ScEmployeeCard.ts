import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ScEmployeeBase } from './ScEmployeeBase.js';
import { EmployeeCardStyle } from './ScEmployee.style.js';

enum CARD_MODE {
  normal = 'normal',
  compact = 'compact',
  tag = 'tag',
}

export class ScEmployeeCard extends ScEmployeeBase {

  // @ts-ignore
  static styles = [EmployeeCardStyle];

  @property({ type: CARD_MODE }) mode = 'normal';

  @property({ type: Boolean }) link = false;

  @property({ type: Boolean }) transparent = false;

  @property({ type: Boolean }) vertical = false;

  @property({ type: Boolean }) disabled = false;

  @property({ type: Boolean, attribute: 'additional-info-link' }) additionalInfoLink = false;

  @property({ type: Boolean, attribute: 'no-border' }) noBorder = false;

  @property({ type: Boolean, attribute: 'center-aligned' }) centerAligned = false;

  @property({ type: Boolean }) compact = false;

  @property({ type: String }) width = '100%';

  @property({ type: String }) height = 'auto';

  @property({ type: Array }) fields: string[] = ['id', 'avatar', 'businessTitle', 'department', 'email', 'phone'];

  @property({ type: Boolean, attribute: 'selected-on-click' }) selectedOnClick = false;

  // for internal use only, do not add to storybook
  @property({ type: Boolean, attribute: 'non-clickable' }) nonClickable = false;

  handleClick(e: any) {
    const target = e.composedPath?.() || (e.target as HTMLInputElement);
    if (target.some((el: any) => el.classList && el.classList.contains('tooltip-container'))) {
      return;
    }
    if (target.some((el: any) =>
      el.tagName === 'SC-LINK' ||
      el.tagName === 'SC-AVATAR' ||
      el.tagName === 'SVG' ||
      el.tagName === 'PATH' ||
      el.tagName === 'IMG'
    )) {
      return;
    }
    const selected = e.detail.value;
    if (!this.disabled && !this.nonClickable && !this.selectedOnClick) {
      const defaultId = this.id || this._data?.id;
      const profileUrl = `/profile/${defaultId}`;
      window.open(profileUrl, '_blank');
    }
    if (this.selectedOnClick) {
      this.emit('sc-card-click', {
        detail: { selected },
      });
    }
  }

  render() {
    return html`
      <div class='sc-employee-card'>
        <sc-card
          part='card'
          clickable
          ?selected-on-click=${this.mode === 'tag' && this.selectedOnClick}
          ?disabled=${this.disabled}
          ?no-border=${this.noBorder}
          width=${this.width}
          height=${this.height}
          class=${classMap({
    'compact-card': this.mode === 'compact' || this.mode === 'tag' && this.transparent && this.link && this.compact,
    'tag-card': this.mode === 'tag',
    'transparent-tag-card': this.mode === 'tag' && this.transparent,
    'link-tag-card': this.mode === 'tag' && this.link,
    'no-avatar': !this.fields.includes('avatar'),
    'center-aligned': this.vertical && this.centerAligned,
    disabled: this.disabled,
  })}
          @click=${this.handleClick}
        >
          ${this.renderDetails({
    mode: this.mode,
    data: undefined,
    hideActions: false,
    noTooltip: false,
    type: undefined,
    vertical: this.vertical,
    link: this.link,
    transparent: this.transparent,
    disabled: this.disabled,
    additionalInfoLink: this.additionalInfoLink,
  })}
        </sc-card>
      </div>
    `;
  }
}
