import { html } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { DIRECTION, ICON_SIZE, IMAGE_POSITION, SIZE, TAG_ATTRIBUTES, TEXT_ALIGN, TEXT_SIZE, VERTICAL_ALIGN } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import { renderMoreActions } from '../common/Actions.js';
import CardBaseStyle from './ScCardBase.style.js';

export class ScCardBase extends ScExtElement {
  static styles = [CardBaseStyle];
    @property({ type: IMAGE_POSITION, attribute: 'image-position' }) layout = 'left';
    @property({ type: DIRECTION, reflect: true }) direction = 'horizontal';
    @property({ type: TEXT_SIZE, attribute: 'title-size' }) titleSize = 'sm';
    @property({ type: TEXT_SIZE, attribute: 'body-size' }) bodySize = 'xs';
    @property({ type: SIZE, attribute: 'space-size' }) spaceSize = 'sm';
    @property({ type: TEXT_ALIGN, attribute: 'text-align' }) textAlign = 'left';
    @property({ type: TEXT_ALIGN, attribute: 'image-position' }) imagePosition = 'left';
    @property({ type: VERTICAL_ALIGN, attribute: 'vertical-align' }) verticalAlign = 'middle';
    @property({ type: Boolean, attribute: 'hover-highlight' }) hoverHighlight = false;
    @property({ type: Boolean, attribute: 'clickable' }) clickable = true;
    @property({ type: Boolean, attribute: 'no-actions' }) noActions = false;
    @property({ type: Boolean, attribute: 'override-default-action' }) overrideDefaultAction = false;
    @property({ type: Boolean }) disabled = false;
    @property({ type: Array, attribute: 'tags-group' }) tagsGroup: TAG_ATTRIBUTES[] = [];
    @property({ type: String, attribute: 'sub-title' }) subTitle = '';
    @property({ type: String }) body = '';
    @property({ type: String, attribute: 'src' }) imageSource = '';
    @property({ type: String }) width = '100%';
    @property({ type: String }) height = 'auto';
    @property({ type: String }) title = '';
    @property({ type: Array }) actions: any[];
    @property({ type: String }) icon = '';
    @property({ type: ICON_SIZE, attribute: 'icon-size' }) iconSize = 'sm';

    @state() _actions: any[] = [];
    @watch('actions')
    updateActions() {
      if (this.actions) {
        this._actions = this.actions;
      }
    }
    handleAction(event: CustomEvent): void {
      this.emit('sc-action', {
        detail: {
          target: event.detail.target,
          type: event.detail.type,
        },
      });
    }
    dropdownInputStyle = ` 
      --sc-dropdown-min-width: var(--sc-actions-width, 200px);
      --sc-button-primary-background-color: var(--sc-card-more-actions-background-color);
      --sc-button-primary-border-color: transparent;
      --sc-button-primary-hover-background-color: var(--sc-card-more-actions-background-color);
      --sc-button-primary-text-color: var(--sc-card-action-button-text-color);
      --sc-button-primary-hover-text-color: var(--sc-card-action-button-text-color);
      --sc-button-primary-hover-border-color: transparent;
      cursor: pointer;`;
      
    dropdownSlotTemplate = () => {
      return html`${
        this.direction === 'vertical' ? 
          html`<sc-icon-button slot="trigger" size="xxs" name="more-horizontal"></sc-icon-button>` :
          html`
          <sc-icon
              slot="trigger"
              name="more-horizontal"
          ></sc-icon>
          `
      }`;
    };
    
    cardActionTemplate() {
      return this._actions.length ? 
        html`<span slot="card-action-button" class="card-action">
            ${renderMoreActions(this._actions, this.disabled,{
    dropdownInputStyle: this.dropdownInputStyle,
    dropdownSlotTemplate: this.dropdownSlotTemplate(),
  })}
        </span>` :
        html`<slot slot="card-action-button" name='card-action-button'></slot>`;
    }
}