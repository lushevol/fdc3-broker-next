import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScTheme from '../../styles/ScTheme.js';
import ScAvatarStyle from './ScAvatar.style.js';
import ScElement from '../../shared/sc-element.js';
import type { ScIcon } from '../ScIcon/ScIcon.js';
import '../../../elements/sc-badge.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-tooltip.js';
import { HasSlotController } from '../../shared/slot.js';
import { watch } from '../../shared/watch.js';
import { COLOR, BADGE_TYPE } from '../../shared/util.js';

enum AVATAR_SIZE {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

enum AVATAR_IMAGE_SIZE {
  xs = '1.5rem',
  sm = '1.75rem',
  md = '2rem',
  lg = '2.5rem',
  xl = '3rem',
}

enum BACKGROUND_COLOR {
  DEFAULT = 'default',
  GREEN = 'green',
  BLUE = 'blue',
  RED = 'red',
  YELLOW = 'yellow',
}

enum SHAPE_TYPE {
  SQUARE = 'square',
  CIRCLE = 'circle',
}

enum BADGE_COLOR {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DISABLED = 'disabled',
  DARK_BLUE = 'dark-blue',
}

export class ScAvatar extends ScElement {
  static styles = ScTheme.getStyles().concat([ScAvatarStyle]);
  
  private iconSize: string;
  
  private badgeVariation: `${COLOR}`;
  
  private readonly hasSlotController = new HasSlotController(
    this,
    '[default]',
  );
    
  private readonly hasDefaultSlot = this.hasSlotController.test('[default]');

  /**
   * xl size is deprecated.
   */
  @property() size?: `${AVATAR_SIZE}` = AVATAR_SIZE.md;

  @property({ attribute: false }) avatarSize?: string = AVATAR_IMAGE_SIZE.md;

  @property({ attribute: 'shape' }) shape?: `${SHAPE_TYPE}` = SHAPE_TYPE.CIRCLE;

  @property({ attribute: 'background' }) background?: `${BACKGROUND_COLOR}` = BACKGROUND_COLOR.DEFAULT;

  @property({ type: Number, attribute: 'badge-number' }) badgeNumber?: number;

  @property({ type: String, attribute: 'badge-label' }) badgeLabel? = '';

  @property({ type: Boolean, attribute: 'show-badge', reflect: true }) showBadge? = false;

  @property({ attribute: 'badge-color' }) badgeColor?: `${COLOR}` = COLOR.red;

  @property({ attribute: 'badge-type' }) badgeType?: `${BADGE_TYPE}` = BADGE_TYPE.number;

  @property({ type: String }) src: string;

  @property({ type: String }) id: string;

  // State variants
  @property({ type: Boolean, reflect: true }) outlined = false;
  @property({ type: Boolean, reflect: true }) clickable = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  // Tooltip
  @property({ type: String }) tooltip = '';
  @property({ type: Boolean, attribute: 'tooltip-on-hover' }) tooltipOnHover = false;
  @property({ type: String, attribute: 'tooltip-mode' }) tooltipMode = 'dark';
  @property({ type: String, attribute: 'tooltip-placement' }) tooltipPlacement = 'top';

  // Accessibility
  @property({ type: Boolean, reflect: true, attribute: 'focus-enabled' }) focusEnabled = true;

  @state() _error = false;
  
  @watch('src')
  updateSrc() {
    this._error = false;
  }
  
  updateIconSize() {
    // Ensure icon size is calculated correctly before render
    switch (this.size) {
      case AVATAR_SIZE.xs:
        this.iconSize = '1.125rem'; // 18px
        break;
      case AVATAR_SIZE.sm:
        this.iconSize = '1.25rem'; // 20px
        break;
      case AVATAR_SIZE.lg:
        this.iconSize = '1.875rem'; // 30px
        break;
      case AVATAR_SIZE.xl:
        this.iconSize = '2.25rem'; // 36px
        break;
      case AVATAR_SIZE.md:
      default:
        this.iconSize = '1.5rem'; // 24px (Default md)
        break;
    }

    // @ts-ignore
    const defaultIcon: ScIcon = this.shadowRoot.querySelector('.default-avatar');
    if (defaultIcon) {
      defaultIcon.customSize = this.iconSize;
    }
  }

  protected firstUpdated(): void {
    this.updateIconSize();
    this.updateTabIndex();
  }

  private updateTabIndex() {
    if (this.clickable && this.focusEnabled && !this.disabled) {
      this.setAttribute('tabindex', '0');
    } else {
      this.removeAttribute('tabindex');
    }
  }

  protected updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    // Update TabIndex for accessibility
    if (
      changedProperties.has('clickable') ||
      changedProperties.has('focusEnabled') ||
      changedProperties.has('disabled')
    ) {
      this.updateTabIndex();
    }

    // Set data attribute for image state to help styling
    if (changedProperties.has('src') || changedProperties.has('_error')) {
      if (this.src && !this._error) {
        this.setAttribute('data-has-image', '');
      } else {
        this.removeAttribute('data-has-image');
      }
    }
  }

  isTextBadge() {
    return this.badgeType === BADGE_TYPE.text && this.badgeLabel !== '';
  }

  isNumberBadge() {
    return this.badgeType === BADGE_TYPE.number && this.badgeNumber !== null;
  }

  /**
   * Identify whether badge will show valid text or number.
   * @returns 
   */
  isTextOrNumberBadge() {
    if (this.isTextBadge()) {
      return true;
    } else if (this.isNumberBadge()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Set badge position for different avatar style.
   * @param size avatar size
   * @returns
   */
  getBadgeOffset(size: `${AVATAR_SIZE}` | undefined) {
    const sizeKey = size || AVATAR_SIZE.md;

    // Avatar sizes: xs=24px, sm=28px, md=32px, lg=40px, xl=48px
    // Badge offset configurations: [leftOffset, topOffset]
    const offsets = {
      textBadge: {
        [AVATAR_SIZE.xs]: ['1rem', '-0.5rem'], // [16px, -8px]
        [AVATAR_SIZE.sm]: ['1.1875rem', '-0.5rem'], // [19px, -8px]
        [AVATAR_SIZE.md]: ['1.375rem', '-0.6875rem'], // [22px, -11px]
        [AVATAR_SIZE.lg]: ['1.75rem', '-1.0625rem'], // [28px, -17px]
        [AVATAR_SIZE.xl]: ['2.125rem', '-1.3125rem'], // [34px, -21px]
      },
      numberBadge: {
        [AVATAR_SIZE.xs]: ['1rem', '-0.5rem'], // [16px, -8px]
        [AVATAR_SIZE.sm]: ['1.1875rem', '-0.5rem'], // [19px, -8px]
        [AVATAR_SIZE.md]: ['1.375rem', '-0.6875rem'], // [22px, -11px]
        [AVATAR_SIZE.lg]: ['1.75rem', '-1.0625rem'], // [28px, -17px]
        [AVATAR_SIZE.xl]: ['2.125rem', '-1.3125rem'], // [34px, -21px]
      },
      dotBadgeSquare: {
        [AVATAR_SIZE.xs]: ['1.1875rem', '-0.3125rem'], // [19px, -5px]
        [AVATAR_SIZE.sm]: ['1.375rem', '-0.4375rem'], // [22px, -7px]
        [AVATAR_SIZE.md]: ['1.625rem', '-0.6875rem'], // [26px, -11px]
        [AVATAR_SIZE.lg]: ['2.0625rem', '-1rem'], // [33px, -16px]
        [AVATAR_SIZE.xl]: ['2.5rem', '-1.1875rem'], // [40px, -19px]
      },
      dotBadgeCircle: {
        [AVATAR_SIZE.xs]: ['1.125rem', '-0.25rem'], // [18px, -4px]
        [AVATAR_SIZE.sm]: ['1.3125rem', '-0.3125rem'], // [21px, -5px]
        [AVATAR_SIZE.md]: ['1.5rem', '-0.625rem'], // [24px, -10px]
        [AVATAR_SIZE.lg]: ['1.9375rem', '-0.8125rem'], // [31px, -13px]
        [AVATAR_SIZE.xl]: ['2.25rem', '-1rem'], // [36px, -16px]
      },
    };

    let offsetArray: string[];

    if (this.isTextBadge()) {
      offsetArray = offsets.textBadge[sizeKey];
    } else if (this.isNumberBadge()) {
      offsetArray = offsets.numberBadge[sizeKey];
    } else if (this.shape === SHAPE_TYPE.SQUARE) {
      offsetArray = offsets.dotBadgeSquare[sizeKey];
    } else {
      offsetArray = offsets.dotBadgeCircle[sizeKey];
    }

    return {
      leftOffset: offsetArray[0],
      topOffset: offsetArray[1],
    };
  }

  renderCustomStyle() {
    let avatarTextSize, avatarTextSpace, backgroundColor, 
      badgeRightPosition, badgeTopPosition, badgeSize, borderRadius, imageSize;
    
    const { leftOffset, topOffset } = this.getBadgeOffset(this.size);

    this.avatarSize = this.size ? AVATAR_IMAGE_SIZE[this.size] : AVATAR_IMAGE_SIZE.md;

    switch (this.size) {
      case AVATAR_SIZE.xs:
        avatarTextSize = '0.625rem';
        avatarTextSpace = '0.56px';
        badgeSize = 'sm';
        imageSize = '1.125rem';
        break;
      case AVATAR_SIZE.sm:
        avatarTextSize = '0.75rem';
        avatarTextSpace = '0.67px';
        badgeSize = 'sm';
        imageSize = '1.25rem';
        break;
      case AVATAR_SIZE.md:
        avatarTextSize = '1rem';
        avatarTextSpace = '0.89px';
        badgeSize = 'md';
        imageSize = '1.5rem';
        break;
      case AVATAR_SIZE.lg:
        avatarTextSize = '1.25rem';
        avatarTextSpace = '1.11px';
        badgeSize = 'lg';
        imageSize = '1.875rem';
        break;
      case AVATAR_SIZE.xl:
        avatarTextSize = '1.5rem';
        avatarTextSpace = '1.33px';
        badgeSize = 'lg';
        imageSize = '2.25rem';
        break;
      default:
        avatarTextSize = '1rem';
        avatarTextSpace = '0.89px';
        badgeSize = 'md';
        imageSize = '1.5rem';
        break;
    }

    this.iconSize = imageSize;
    this.updateIconSize();

    // Determine Base Color
    let baseColor;
    switch (this.background) {
      case BACKGROUND_COLOR.GREEN:
        baseColor = 'var(--sc-avatar-green-background-color)';
        break;
      case BACKGROUND_COLOR.BLUE:
        baseColor = 'var(--sc-avatar-blue-background-color)';
        break;
      case BACKGROUND_COLOR.RED:
        baseColor = 'var(--sc-avatar-red-background-color)';
        break;
      case BACKGROUND_COLOR.YELLOW:
        baseColor = 'var(--sc-avatar-yellow-background-color)';
        break;
      default:
        baseColor = 'var(--sc-avatar-default-background-color)';
        break;
    }

    // Logic for filled vs outlined vs disabled
    if (this.disabled) {
      const hasImage = this.src && !this._error;
      // Both filled and outlined disabled (without image)
      backgroundColor = (!hasImage)
        ? 'var(--sc-color-grey-100)'
        : 'var(--sc-avatar-outlined-background-color)';
    } else if (this.outlined) {
      // outlined
      backgroundColor = 'var(--sc-avatar-outlined-background-color)';
    } else {
      // default filled
      backgroundColor = baseColor;
    }

    if (this.shape === SHAPE_TYPE.CIRCLE) {
      borderRadius = '50%';
    } else {
      borderRadius = '0.625rem';
    }

    const styleForRealAvatar = this.src && !this._error ? html`
    <style>
      .avatar-box {
        height: 100%;
      }
    </style>
    ` : html`
    <style>
      .avatar-box {
        width: ${imageSize};
        height: ${imageSize};
        position: absolute;
      }
    </style>
    `;
  
    const variableStyle = html`
    <style>
    :host {
      border-radius: ${borderRadius};
      background-color: ${backgroundColor};
      width: ${this.avatarSize};
      height: ${this.avatarSize};
    }

    :host([size="sm"]) {
      /* when avatart size is sm, the text in slot is not at the middle of the circle or square
      Set line-height to fix this issue. */
      line-height: 100%;
    }

    :host * {
      font-size: ${avatarTextSize};
      letter-spacing: ${avatarTextSpace};
      border-radius: ${borderRadius};
    }

    .avatar-content {
      width: ${this.avatarSize};
      height: ${this.avatarSize};
      border-radius: ${borderRadius};
    }

    .badge-container {
      left: ${leftOffset};
      top: ${topOffset};
    }
    </style>`;
    return html`
      ${variableStyle}
      ${styleForRealAvatar}
    `;
  }

  /** Checks the badge color attribute to prevent transparent badge color from being rendered */
  checkBadgeColor() {
    switch (`${this.badgeColor}`) {
      case BADGE_COLOR.SUCCESS:
        this.badgeVariation = 'green';
        break;
      case BADGE_COLOR.INFO:
        this.badgeVariation = 'blue';
        break;
      case BADGE_COLOR.ERROR:
        this.badgeVariation = 'red';
        break;
      case BADGE_COLOR.WARNING:
        this.badgeVariation = 'amber';
        break; 
      case BADGE_COLOR.DARK_BLUE:
        this.badgeVariation = 'dark-blue';
        break;
      default:
        this.badgeVariation = 'grey';
        break;
    }
    return this.badgeVariation;
  }

  /**
   * Maps avatar size to appropriate badge size.
   * ScBadge only supports sm, md, lg sizes at the moment.
   */
  getBadgeSize() {
    // Dot badge on lg avatar use md size badge
    if (this.badgeType === 'dot' && this.size === AVATAR_SIZE.lg) {
      return 'md';
    }

    switch (this.size) {
      case AVATAR_SIZE.xs:
      case AVATAR_SIZE.sm:
        return 'sm';
      case AVATAR_SIZE.lg:
      case AVATAR_SIZE.xl:
        return 'lg';
      case AVATAR_SIZE.md:
      default:
        return 'md';
    }
  }

  renderBadge() {
    if (!!this.showBadge) {
      return html`
      <div class="badge-container">
        <sc-badge 
          number=${this.badgeNumber} 
          label=${this.badgeLabel} 
          color=${this.checkBadgeColor()} 
          type=${this.badgeType}
          size=${this.getBadgeSize()}>
        </sc-badge>
      </div>
      `;
    } else {
      return;
    }
  }

  async onImageError() {
    this._error = true;
    await this.updateComplete;
    this.updateIconSize();
  }

  renderAvatar() {
    if (this.src && !this._error) {
      return html`<img src=${this.src} @error=${this.onImageError}></img>`;
    } else if (this.hasDefaultSlot) {
      return html`<slot></slot>`;
    } else {
      return html`<sc-icon class='default-avatar' name="person--line"></sc-icon>`;
    }
  }

  // Interactive event handlers
  private _handleClick = () => {
    if (this.disabled || !this.clickable) return;
    this.dispatchEvent(
      new CustomEvent('sc-avatar-click', {
        bubbles: true,
        composed: true,
        detail: { selected: this.selected },
      })
    );
  };

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (this.disabled || !this.clickable) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._handleClick();
    }
  };

  render() {
    // Visual content
    const avatarContent = html`
      ${this.renderCustomStyle()}
      <span class="avatar-box">
        ${this.renderAvatar()}
      </span>
      ${this.renderBadge()}
    `;

    // If tooltip is enabled, wrap everything with sc-tooltip
    if (this.tooltip && this.tooltipOnHover) {
      return html`
        <sc-tooltip
          .content=${this.tooltip}
          .mode=${this.tooltipMode}
          .placement=${this.tooltipPlacement}
          trigger="hover"
        >
          <span
            class="avatar-content"
            @click=${this._handleClick}
            @keydown=${this._handleKeyDown}
          >
            ${avatarContent}
          </span>
        </sc-tooltip>
      `;
    }

    // Without tooltip
    return html`
      <span
        class="avatar-content"
        @click=${this._handleClick}
        @keydown=${this._handleKeyDown}
      >
        ${avatarContent}
      </span>
    `;
  }
}
