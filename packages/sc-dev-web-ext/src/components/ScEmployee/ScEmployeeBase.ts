import { html, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import ScEmployeeStyle, { EmployeeInputStyle, EmployeeMultiInputStyle, EmployeeCardTagTransparent } from './ScEmployee.style.js';
import { openNewWindow } from '../../shared/open-window.js';
import { renderMoreActions } from '../common/Actions.js';
import { watch } from '../../shared/watch.js';
import { EMPLOYEE_CARD_DETAILS } from '../../shared/util.js';

const _employeeInstances = new Set<ScEmployeeBase>();

const FIELDS_ICON_MAPPING = {
  id: 'badge-check--line',
  location: 'location--line',
  email: 'email--line',
  phone: 'phone--line',
};

class EmployeeData {
  name: string;
  email: string;
  id: string;
  phone: string;
  location: string;
  department: string;
  businessTitle: string;
}

export class ScEmployeeBase extends ScExtElement {
  @state() loadingSuggestedActionId: string | null = null;

  //@ts-ignore
  @property({ type: String }) id = '';

  @property({ type: Object }) data: EmployeeData;

  // Supported values: ['id', 'location', 'avatar', 'businessTitle', 'department', 'email', 'phone']
  @property({ type: Array }) fields: string[] = ['id', 'avatar', 'businessTitle', 'department', 'email', 'phone'];
  
  @property({ type: Array }) actions: any[];

  @property({ type: String, attribute: 'avatar-size' }) avatarSize = 'md';

  @property({ type: Boolean, attribute: 'no-actions' }) noActions = false;

  @property({ type: Boolean, attribute: 'override-default-action' }) overrideDefaultAction = false;

  @property({ type: Boolean, attribute: 'single-line-fields' }) singleLineFields = false;

  protected _suggestedPeopleInternal: any[] = [];
  
  private _suggestedPeopleUser: any[] | null = null;
  
  protected _suggestedPeopleFromUser = false;

  get isSuggestedPeopleCustom() {
    return this._suggestedPeopleFromUser;
  }

  @property({ type: Array, attribute: 'suggested-people' })
  get suggestedPeople() {
    return this._suggestedPeopleFromUser && this._suggestedPeopleUser
      ? this._suggestedPeopleUser
      : this._suggestedPeopleInternal;
  }
  set suggestedPeople(val: any[]) {
    if (Array.isArray(val) && val.length > 0) {
      this._suggestedPeopleUser = val;
      this._suggestedPeopleFromUser = true;
    } else {
      this._suggestedPeopleUser = null;
      this._suggestedPeopleFromUser = false;
    }
  }
  @property({ type: String, attribute: 'exp-api-namespace' }) expAPINamespace = '';

  @property({ type: String }) filter = '';

  @state() _data: EmployeeData = new EmployeeData();

  @state() _actions: any[] = [];

  @state()
    _loadingSuggestedPeople = false;


  constructor() {
    super();
    this.openProfile = this.openProfile.bind(this);
    this.openSplitView = this.openSplitView.bind(this);
  }

  firstUpdated() {
    if (!this.actions) {
      this._actions = this.renderDefaultActions();
    }
    if (this.hasAttribute('suggested-people')) {
      this._suggestedPeopleFromUser = Array.isArray(this._suggestedPeopleUser) && this._suggestedPeopleUser.length > 0;
    }
  }

  @watch('data')
  updateData() {
    this._data = this.data;
  }

  @watch('actions')
  updateActions() {
    if (this.actions) {
      this._actions = this.renderDefaultActions().concat(this.actions);
    } else {
      this._actions = this.renderDefaultActions();
    }
  }

  @watch('id')
  async getEmployeeInformation() {
    this.filterId();
    if (this.id) {
      try {
        const response = await this._graphQLClient?.query(this.generateQuery());
        const jsonData = await response?.json?.();
        const result = jsonData?.data || jsonData;
        const data = result?.[this.expAPINamespace || '_55313_128_webkit_exp_api']?.get_employee || {};
        const { name, email, id, phone, address, businessTitle, departmentEntity } = data;
        
        this._data = {
          name,
          id,
          email,
          phone: phone?.phone,
          location: address?.city,
          businessTitle,
          department: departmentEntity?.description,
        };
        this.emit('sc-loaded', {
          detail: {
            data,
          },
        });
      } catch (_e) {
        throw new Error('Internal server error');
      }
    }
  }

  onBodyClick = (e: MouseEvent) => {
    const path = e.composedPath?.() || [];
    const clickedInsideTooltipContent = path.some((node: any) => {
      if (!node || !node.classList) return false;
      return node.classList.contains('tooltip-container');
    });

    if (clickedInsideTooltipContent) {
      return;
    }

    const clickedEmployee = path.find((node: any) => node instanceof ScEmployeeBase) as ScEmployeeBase | undefined;
    if (clickedEmployee) {
      if (this !== clickedEmployee) {
        return;
      }
      // Close all employee tooltips first so only one can remain open after this click.
      _employeeInstances.forEach(instance => {
        instance.closeTooltip();
      });
      return;
    }
    this.closeTooltip();
  };

  closeTooltip = () => {
    // @ts-ignore
    const tooltips = this.shadowRoot?.querySelectorAll('sc-tooltip');
    if (tooltips) {
      tooltips.forEach((tooltip: any) => {
        const childTooltip: any = tooltip.shadowRoot?.querySelector('sl-tooltip');
        if (childTooltip?.open) {
          childTooltip.open = false;
        }
      });
    }
  };

  connectedCallback() {
    super.connectedCallback();
    _employeeInstances.add(this);
    document.body.addEventListener('click', this.onBodyClick, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    _employeeInstances.delete(this);
    document.body.removeEventListener('click', this.onBodyClick, true);
  }

  filterId() {
    const exp = /^[0-9]+$/;
    if (exp.test(this.id)) { return this.id; }
    this.id = '';
  }

  generateQuery() {
    return `
      query profile @cached {
        ${this.expAPINamespace || '_55313_128_webkit_exp_api'} {
          get_employee(id: "${this.id}") {
            businessTitle
            departmentEntity {
              description
            }
            address {
              city
            }
            email
            phone {
              phone
            }
            businessFunction {
              businessFunction {
                description
              }
            }
            id
            name
          }
        }
      }
    `;
  }
  
  renderDefaultActions() {
    if (this.overrideDefaultAction) return [];
    const defaultId = this.id || this._data?.id;
    
    const link = `/profile/${defaultId}`;
    const _actionArr = [
      html`
        <div
          @click=${() => {
    this.openProfile(link);
    this.closeTooltip();
  }}
        >
          View profile
        </div>
      `,
    ];

    if (this._shellClient) {
      _actionArr.push(html`
        <div
          @click=${() => {
    this.openSplitView(link);
    this.closeTooltip();
  }}
        >
          Open split view
        </div>
      `);
    }
    return _actionArr;
  }

  openProfile(link: any) {
    openNewWindow(link);
  }

  openSplitView(link: any) {
    this._shellClient?.openInSplitView(link);
  }

  async fetchSuggestedPeople() {
    const userId = this._user?.id;
    if (!userId) return [];

    if (!userId) {
      return this.suggestedPeople;
    }

    this._loadingSuggestedPeople = true;
    try {
      const response = await this._graphQLClient?.query(`
        query {
          _55313_128_webkit_exp_api {
            get_suggestedPeople(userId: "${userId}") {
              id
              type
              createdDate
              profile {
                id
                businessTitle
                category
                email
                firstName
                name
                lastName
                businessFunction {
                  businessFunction {
                    description
                  }
                }
              }
            }
          }
        }
      `);
      const jsonData = await response?.json?.();
      const raw = jsonData?.data?._55313_128_webkit_exp_api?.get_suggestedPeople || [];
      const result = [...raw].sort((a, b) => (a.type === 'pinned' ? -1 : 0) - (b.type === 'pinned' ? -1 : 0));
      this._suggestedPeopleInternal = result;
      return result;
    } catch (e) {
      return [];
    } finally {
      this._loadingSuggestedPeople = false;
    }
  }

  async addRecentSearchedPerson(bankId: string) {
    const userId = this._user?.id;
    if (this._suggestedPeopleFromUser || !userId || bankId === userId) {
      this.emit('sc-action', {
        detail: {
          action: 'addRecent',
          id: bankId,
        },
      });
      return null;
    }
    try {
      const response = await this._graphQLClient?.query(`
        mutation {
          _55313_128_webkit_exp_api {
            post_addRecentSearchedPeople(userId: "${userId}", bankId: "${bankId}") {
              id
              type
              createdDate
              profile {
                id
                businessTitle
                category
                email
                firstName
                name
                lastName
              }
            }
          }
        }
      `);
      const jsonData = await response?.json?.();
      return jsonData?.data?._55313_128_webkit_exp_api?.post_addRecentSearchedPeople;
    } catch (e) {
      return null;
    }
  }

  async pinSuggestedPerson(id: string) {
    const userId = this._user?.id;
    if (this._suggestedPeopleFromUser || !userId) {
      const person = this.suggestedPeople?.find((p: any) => p.id === id);
      const pinned = person?.type === 'pinned' ? false : true;
      this.emit('sc-action', {
        detail: {
          action: 'pin',
          id,
          pinned,
        },
      });
      return null;
    }
    try {
      const response = await this._graphQLClient?.query(`
        mutation {
          _55313_128_webkit_exp_api {
            put_pinSuggestedPeople(userId: "${userId}", id: "${id}") {
              id
              type
              createdDate
              profile {
                id
                businessTitle
                category
                email
                firstName
                name
                lastName
              }
            }
          }
        }
      `);
      const jsonData = await response?.json?.();
      return jsonData?.data?._55313_128_webkit_exp_api?.put_pinSuggestedPeople;
    } catch (e) {
      return null;
    }
  }

  async deleteSuggestedPerson(id: string) {
    const userId = this._user?.id;
    if (this._suggestedPeopleFromUser || !userId) {
      this.emit('sc-action', {
        detail: {
          action: 'delete',
          id,
        },
      });
      return null;
    }
    try {
      const response = await this._graphQLClient?.query(`
        mutation {
          _55313_128_webkit_exp_api {
            delete_removeRecentSearchedPeople(userId: "${userId}", id: "${id}") {
              id
              type
              createdDate
              profile {
                id
                businessTitle
                category
                email
                firstName
                name
                lastName
              }
            }
          }
        }
      `);
      const jsonData = await response?.json?.();
      return jsonData?.data?._55313_128_webkit_exp_api?.delete_removeRecentSearchedPeople;
    } catch (e) {
      return null;
    }
  }

  renderField(icon: string, field: string, type?: string, disabled?: boolean, additionalInfoLink?: boolean) {
    let href = null;
    if (type === 'phone') {
      href = `tel:${field}`;
    } else if (type === 'email') {
      href = `mailto:${field}`;
    }

    const content = href
      ? html`
          <a 
            href=${href} 
            class="field-single-line"
            @click=${this.stopDefaultEvent} 
            @mousedown=${this.stopDefaultEvent}
          >
            <sc-icon name=${icon} size="xs"></sc-icon>
            <span title=${field}>${field || '-'}</span>
          </a>
        `
      : html`
          <sc-icon name=${icon} size="xs"></sc-icon>
          <span class="field-single-line" title=${field}>${field || '-'}</span>
        `;

    return html`
      <div class="field-item 
        ${type ? `type-${type}` : ''} 
        ${disabled ? 'disabled' : ''}
        ${additionalInfoLink ? 'additional-info-link' : ''}
        single-line
      ">
        ${content}
        <sc-copy
          class="copy"
          value="${field}"
          @click=${this.stopDefaultEvent}
          @mousedown=${this.stopDefaultEvent}
        ></sc-copy>
      </div>
    `;
  }

  // @ts-ignore
  renderAvatar(mode?: string, vertical?: boolean, disabled?: boolean, link?: boolean, transparent?: boolean) {
    const { name, id: dataId } = this._data;
    const avatarId = this.id || dataId;
    const noTooltip = mode === 'normal';
    const orientationClass = vertical ? 'vertical' : '';
    const sizeValue = vertical ? 'lg' : this.avatarSize;
    const tooltipSizeValue = (mode === 'tag' && link && transparent)
      ? (['sm', 'md'].includes(this.avatarSize) ? this.avatarSize : 'md')
      : mode === 'tag'
        ? 'sm'
        : (vertical ? 'lg' : this.avatarSize);
    let avatarContent;
    if (noTooltip) {
      avatarContent = html`
        <sc-avatar 
          class=${`employee-avatar ${orientationClass}`}
          size=${sizeValue}
          src='/_data/profile/pics/${avatarId}/photo_lg.jpg'
        >${name}</sc-avatar>
      `;
    } else {
      avatarContent = html`
        <sc-tooltip 
          hoist
          class=${`employee-tooltip ${orientationClass}`}
          ?disabled=${disabled}
          placement=bottom content-max-width=400px mode=light 
          style='
          --sc-tooltip-light-border-color: var(--sc-employee-tooltip-border-color, var(--sc-color-grey-150))'
        >      
          <sc-avatar 
            size=${tooltipSizeValue}
            src='/_data/profile/pics/${avatarId}/photo_lg.jpg'
          >${name}</sc-avatar> 
          <div slot="content" class=tooltip-container>
            ${this.renderDetails({
    mode: 'normal',
    data: null,
    noTooltip: true,
  })}
          </div>     
        </sc-tooltip>
      `;
    }
    return html`${avatarContent}`;
  }

  // @ts-ignore
  renderDetails(options: EMPLOYEE_CARD_DETAILS) {
    const {
      mode,
      data,
      hideActions,
      noTooltip,
      type,
      vertical,
      link,
      transparent,
      disabled,
      additionalInfoLink,
      readonly,
      stopEvent,
      suggestedPeople,
      suggestedId,
      suggestedPinned,
    } = options;
  
    const { name, email, id, phone, location, businessTitle, department } = data || this._data;
  
    const _fields = this.getFields(type, mode);
    const containerClass = this.getContainerClass(mode, vertical, noTooltip, type);

    return html`
      <style>${this.getStyles(data, type, mode, transparent, readonly)}</style>
      <div class=${containerClass}>
        ${!readonly ? this.renderAvatarSection(_fields, mode, vertical, noTooltip, hideActions, disabled, name, link, transparent) : ''}
        <div
          slot="title"
          class="title ${suggestedPeople ? 'suggested-people-row' : ''} 
            ${suggestedPeople && id ? 'suggested-people-flex' : ''} 
            ${this.singleLineFields ? 'detail-container-single-line' : 'detail-container-not-single-line'}"
        >
          <div class="name-details-section">
            ${this.renderNameSection(name, mode, link, disabled, vertical, hideActions, stopEvent)}
            ${this.renderDetailsSection(_fields, businessTitle, department, id, location, phone, email, disabled, additionalInfoLink)}
          </div>
          ${suggestedPeople && id ? html`
            <span class="suggested-actions ${suggestedPinned ? 'is-pinned' : ''}">
                ${this.loadingSuggestedActionId === suggestedId
    ? html`<sc-spinner type="component" size="sm" color="blue" message=""></sc-spinner>`
    : html`
                    <sc-icon-button
                      class="trash-action"
                      type="link"
                      state="error"
                      size="sm"
                      name="trash--line"
                      title="Delete"
                      @click=${async (e: Event) => {
    e.stopPropagation();
    if (suggestedId) {
      this.loadingSuggestedActionId = suggestedId;
      await this.deleteSuggestedPerson(suggestedId);
      const newSuggestions = await this.fetchSuggestedPeople();
      this._suggestedPeopleInternal = Array.isArray(newSuggestions) ? [...newSuggestions] : [];
      this.requestUpdate('suggestedPeople');
      this.loadingSuggestedActionId = null;
    }
  }}
                    ></sc-icon-button>
                    ${(() => {
    const pinnedCount = (this.suggestedPeople || []).filter((p: any) => p.type === 'pinned').length;
    const pinLimitReached = !suggestedPinned && pinnedCount >= 5;
    const pinButton = html`
                      <sc-icon-button
                        type="link"
                        state="default"
                        size="sm"
                        name=${suggestedPinned ? 'pin--fill' : 'pin--line'}
                        title="Pin"
                        ?disabled=${pinLimitReached}
                        style=${pinLimitReached ? 'cursor: not-allowed;' : ''}
                        @click=${async (e: Event) => {
      e.stopPropagation();
      if (suggestedId && !pinLimitReached) {
        this.loadingSuggestedActionId = suggestedId;
        await this.pinSuggestedPerson(suggestedId);
        const newSuggestions = await this.fetchSuggestedPeople();
        this._suggestedPeopleInternal = Array.isArray(newSuggestions) ? [...newSuggestions] : [];
        this.requestUpdate('suggestedPeople');
        this.loadingSuggestedActionId = null;
      }
    }}
                      ></sc-icon-button>
                    `;
    return pinLimitReached
      ? html`
                      <sc-tooltip
                        hoist
                        trigger="hover"
                      >
                        ${pinButton}
                        <div slot="content">
                          You've reached the maximum of 5 pinned people. Unpin someone to pin a new person.
                        </div>
                      </sc-tooltip>
                    `
      : pinButton;
  })()}
                  `}
            </span>
          ` : nothing}
        </div>
      </div>
    `;
  }

  private getFields(type?: string, mode?: string): string[] {
    if (type === 'multi-input' || type === 'input') {
      return ['avatar', 'businessTitle'];
    }
    if (mode === 'compact') {
      return ['avatar', 'businessTitle', 'department'];
    }
    if (mode === 'tag') {
      return this.fields.includes('avatar') ? ['avatar'] : [];
    }
    return [...this.fields];
  }

  private getContainerClass(mode?: string, vertical?: boolean, noTooltip?: boolean, type?: string): string {
    return [
      'detail-container',
      mode,
      vertical ? 'vertical' : '',
      noTooltip ? 'no-tooltip' : '',
      type === 'multi-input' || type === 'input' ? 'input' : '',
      this.singleLineFields ? '' : 'dc-not-single-line',
    ].join(' ').trim();
  }

  private getStyles(data: any, type?: string, mode?: string, transparent?: boolean, readonly?: boolean): string {
    const dataStyle = data ? EmployeeInputStyle : '';
    const typeStyle = type === 'multi-input' ? EmployeeMultiInputStyle : '';
    const modeStyle = mode === 'tag' && transparent ? EmployeeCardTagTransparent : '';
    
    if (readonly) return '';
    return [
      dataStyle,
      typeStyle,
      ScEmployeeStyle,
      modeStyle,
    ].join(' ').trim();
  }

  private renderAvatarSection(
    _fields: string[],
    mode?: string,
    vertical?: boolean,
    noTooltip?: boolean,
    hideActions?: boolean,
    disabled?: boolean,
    name?: string,
    link?: boolean,
    transparent?: boolean
  ): any {
    if (!_fields.includes('avatar')) return nothing;
    const avatarId = this.id || this._data?.id;

    const avatarContent = noTooltip
      ? html`<sc-avatar size="md" src="/_data/profile/pics/${avatarId}/photo_lg.jpg">${name}</sc-avatar>`
      : this.renderAvatar(mode, vertical, disabled, link, transparent);

    let actionsContent;
    if (!this.noActions && this._actions && vertical && !hideActions) {
      actionsContent = renderMoreActions(this._actions, disabled);
    } else {
      actionsContent = nothing;
    }

    return html`
      <span slot="prefix" class="avatar">
        <div class="avatar-container">
          ${avatarContent}
          ${actionsContent}
        </div>
      </span>
    `;
  }

  protected renderNameSection(
    name?: string,
    mode?: string,
    link?: boolean,
    disabled?: boolean,
    vertical?: boolean,
    hideActions?: boolean,
    stopEvent?: boolean
  ): any {
    const shouldRenderTooltip = name && mode === 'tag' && link && !disabled;
    const shouldRenderActions = !this.noActions && this._actions && mode !== 'tag' && !vertical && !hideActions;

    let tooltipContent;
    if (shouldRenderTooltip) {
      tooltipContent = html`
        <sc-tooltip
          hoist
          class=${`employee-tooltip ${vertical ? 'vertical' : ''}`}
          placement="bottom"
          content-max-width="25rem"
          mode="light"
          style="--sc-tooltip-light-border-color: var(--sc-employee-tooltip-border-color, var(--sc-color-grey-150))"
        >
          <sc-link class="name field-single-line" title=${name}>${name}</sc-link>
          <div slot="content" class="tooltip-container">
            ${this.renderDetails({
    mode: 'normal',
    data: null,
    noTooltip: true,
  })}
          </div>
        </sc-tooltip>
      `;
    } else {
      tooltipContent = html`
        <span class="name-span" @click=${mode !== 'tag' && !stopEvent ? this.stopDefaultEvent : ''}>${name}</span>
      `;
    }

    const actionsContent = shouldRenderActions
      ? renderMoreActions(this._actions)
      : nothing;

    return html`
      <div class="name">
        ${tooltipContent}
        ${actionsContent}
      </div>
    `;
  }

  private renderDetailsSection(
    _fields: string[],
    businessTitle?: string,
    department?: string,
    id?: string,
    location?: string,
    phone?: string,
    email?: string,
    disabled?: boolean,
    additionalInfoLink?: boolean
  ): any {
    const businessTitleContent = _fields.includes('businessTitle')
      ? html`<div class="business field-single-line" title=${businessTitle}>${businessTitle}</div>`
      : nothing;

    const departmentContent = _fields.includes('department')
      ? html`<div class="department field-single-line" title=${department}>${department}</div>`
      : nothing;

    const footerContent = ['id', 'location', 'phone', 'email'].some(field => _fields.includes(field))
      ? html`
          <div class="footer-container">
            ${_fields.includes('id') && id
    ? html`${this.renderField(FIELDS_ICON_MAPPING.id, id, 'id', disabled)}`
    : nothing}
            ${_fields.includes('location') && location
    ? html`${this.renderField(FIELDS_ICON_MAPPING.location, location, 'location', disabled)}`
    : nothing}
            ${_fields.includes('phone') && phone
    ? html`${this.renderField(FIELDS_ICON_MAPPING.phone, phone, 'phone', disabled, additionalInfoLink)}`
    : nothing}
            ${_fields.includes('email') && email
    ? html`${this.renderField(FIELDS_ICON_MAPPING.email, email, 'email', disabled, additionalInfoLink)}`
    : nothing}
          </div>
        `
      : nothing;

    return html`
      ${businessTitleContent}
      ${departmentContent}
      <slot slot="footer" name="footer">
        ${footerContent}
      </slot>
    `;
  }
}
