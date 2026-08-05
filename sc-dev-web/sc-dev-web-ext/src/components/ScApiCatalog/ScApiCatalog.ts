import { msg } from '@lit/localize';
import type { ScCard, ScModal, ScTextInput } from '@scdevkit/webkit';
import { html } from 'lit-html';
import { property, query, state } from 'lit/decorators.js';
import { guard } from 'lit/directives/guard.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import ScExtElement from '../../shared/sc-ext-element.js';
import { debounce } from '../../shared/util.js';
import { watch } from '../../shared/watch.js';
import ScApiCatalogStyles from './ScApiCatalog.style.js';
import type { ArtifactDetails, ArtifactDto, ArtifactEndPt } from './types.js';

const defaultNamespace = '_55313_128_webkit_exp_api';

type BaseEndPt = { path: string; method: string };

export class ScApiCatalog extends ScExtElement {
  static styles = [ScApiCatalogStyles];

  @property({ type: Object })
  value?: {
    api?: ArtifactDto;
    artifactId: string;
  } & BaseEndPt;

  @property({ type: String }) label?: string;
  @property({ type: String, attribute: 'label-size' })
  labelSize: 'sm' | 'md' | 'lg' = 'md';

  @property({ type: String }) tooltip?: string;
  @property({ type: String, attribute: 'tooltip-placement' })
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @property({ type: String }) hint?: string;
  @property({ type: String, attribute: 'hint-placement' })
  hintPlacement?: 'top' | 'bottom' | 'left' | 'right' = 'right';

  @property({ type: String, attribute: 'help-text' }) helpText?: string;
  @property({ type: String, attribute: 'border-type' }) borderType?:
    | 'line'
    | 'box' = 'box';

  @property({ type: String })
  placeholder = msg('Select API', { id: 'sc-api-catalog-placeholder' });
  @property({ type: String, attribute: 'api-placeholder' })
  apiPlaceholder = msg('Search APIs...', {
    id: 'sc-api-catalog-api-placeholder',
  });
  @property({ type: String, attribute: 'end-pt-placeholder' })
  endPtPlaceholder = msg('Search end points...', {
    id: 'sc-api-catalog-end-pt-placeholder',
  });

  @property({ type: Boolean }) required = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) readonly = false;
  @property({ type: Boolean }) success = false;
  @property({ type: Boolean }) error = false;
  @property({ type: String, attribute: 'success-message' })
  successMessage?: string;
  @property({ type: String, attribute: 'error-message' }) errorMessage?: string;

  @query('[part=main-card]') mainCard: HTMLDivElement;
  @query('sc-modal') modal: ScModal;
  @query('sc-text-input.input.api', true) apiInput: ScTextInput;
  @query('sc-text-input.input.end-pt', true) endPtInput: ScTextInput;
  @query('.scroll-results.api', true) scrollApiResults: HTMLDivElement;
  @query('.scroll-results.end-pt', true) scrollEndPtResults: HTMLDivElement;

  /** filtered api list */
  @state() apiList?: ArtifactDetails[];
  /** filtered end pt list */
  @state() endPoints?: NonNullable<ScApiCatalog['_endPt']>[];
  /** selected api id */
  @state() _artifactId?: string;
  /** selected api dto */
  @state() _api?: ArtifactDto;
  /** selected end pt path/method */
  @state() _endPt?: ArtifactEndPt;

  _apiFilter = '';
  _endPtFilter = '';

  /** results from get_internalAllArtifacts */
  _apiList?: ArtifactDetails[];
  /** results map from get_internalArtifact */
  _apiMap = new Map<string, ArtifactDto>();
  /** processed end points, per id per method-path */
  _apiEndPtsMap = new Map<string, Map<string, ArtifactEndPt> | undefined>();

  namespace = defaultNamespace;

  async getAllArtifacts() {
    try {
      const res = await this._graphQLClient.query(this._allArtifactsQuery());
      if (!res.ok) return [];
      const jsonData = await res?.json?.();
      const result = jsonData?.data || jsonData;
      if (result.errors) throw result.errors;
      const data: ArtifactDetails[] =
        result?.[this.namespace]?.get_internalAllArtifacts?.artifacts || [];
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  _allArtifactsQuery() {
    return `query internalArtifacts @cached {
      ${this.namespace} { 
        get_internalAllArtifacts (input:{limit:99999, offset:0, orderBy:"name", order:"asc"}) {
          artifacts {
            artifactId
            name
            description
            groupId
            artifactType
            labels {
              application_name
              application_id
              ecm_id
              ecm_category
              api_type
              business_unit
            }
          }
          count
        } 
      }
    }`;
  }

  async getArtifact(
    artifactId: string
  ): Promise<[ScApiCatalog['_api'], Map<string, ArtifactEndPt> | undefined]> {
    const map = new Map<string, ArtifactEndPt>();
    try {
      const res = await this._graphQLClient.query(
        this._artifactQuery(artifactId)
      );
      if (!res.ok) return [undefined, map];
      const jsonData = await res?.json?.();
      const result = jsonData?.data || jsonData;
      if (result.errors) throw result.errors;
      const data: ArtifactDto = result?.[this.namespace]?.get_internalArtifact;
      data.specification =
        typeof data.specification === 'string'
          ? JSON.parse(data.specification)
          : data.specification;
      Object.entries(data.specification?.paths ?? {}).forEach(
        ([path, methods]) => {
          return Object.entries(methods)
            .map(([method, endPt]) => ({
              ...endPt,
              path,
              method,
            }))
            .forEach(item => map.set(this.getEndPtId(item), item));
        }
      );
      return [data, map];
    } catch (e) {
      console.error(e);
    }
    return [undefined, map];
  }
  _artifactQuery(artifactId: string) {
    return `
    query internalArtifact @cached { 
      ${this.namespace} { 
        get_internalArtifact (input: {artifactId: "${artifactId}"}) {
          specification
          contentType
          details {
            artifactId
            name
            description
            groupId
            artifactType
            labels {
              application_name
              application_id
              ecm_id
              ecm_category
              api_type
              business_unit
            }
          }
        }
      } 
    }`;
  }

  focusInput(el: ScApiCatalog['apiInput']) {
    const input = el.shadowRoot?.querySelector<HTMLElement>('[part=input]');
    input?.focus();
  }

  async selectApi(id: string, toggle = false) {
    // remove end point selection if api changes
    this._endPt = undefined;
    if (this._api?.details.artifactId !== id) {
      this._artifactId = id;
      this._api = this.endPoints = undefined;

      if (!this._apiMap.has(id)) {
        const [api, map] = await this.getArtifact(id);
        if (api) this._apiMap.set(id, api);
        else this._apiMap.delete(id);
        if (map) this._apiEndPtsMap.set(id, map);
        else this._apiEndPtsMap.delete(id);
      }
      this._api = this._apiMap.get(id);
      this._applyEndPtFilter();
    } else if (toggle) {
      this._api = this._artifactId = this._endPt = undefined;
    }
  }
  async selectEndPt(item: ArtifactEndPt, toggle = false) {
    if (this._endPt !== item) {
      this._endPt = item;
    } else if (toggle) {
      this._endPt = undefined;
    }
    await this.updateComplete;
    this.modal.buttonDisablePrimary = !this._endPt;
  }

  @watch('value')
  async onValueChange() {
    if (this.value) {
      const artifactId = this.value.artifactId;
      if (!this.value.api || this.value.api !== this._api) {
        this._api = this._endPt = this._artifactId = undefined;
        this.value.api = undefined;
        await this.selectApi(artifactId);
        if (this._api) this.value.api = this._api;
        this._applyApiFilter();
        this._applyEndPtFilter();
      }
      if (
        this.value.method !== this._endPt?.method ||
        this.value.path !== this._endPt?.path
      ) {
        this._endPt = undefined;
        await this.updateComplete;
        const endPt = this._apiEndPtsMap
          .get(this.value.artifactId)
          ?.get(this.getEndPtId(this.value));
        if (endPt) {
          this.selectEndPt(endPt);
        }
      }
    } else {
      this._api = this._endPt = this._artifactId = undefined;
    }
  }

  /** clears all data */
  clear() {
    this._api = this._endPt = undefined;
    this._apiList = undefined;
    this._apiMap.clear();
    this._apiEndPtsMap.clear();
    this._applyApiFilter();
    this._applyEndPtFilter();
    this.onValueChange();
  }

  _applyApiFilter(e?: CustomEvent) {
    this._apiFilter = e?.detail?.value?.toLowerCase() || '';
    this.apiList = this._apiList
      ? this._apiFilter
        ? [...this._apiList.values()].filter(
            item =>
              item.artifactId === this._api?.details.artifactId ||
              item.name.toLowerCase().includes(this._apiFilter) ||
              item.description.toLowerCase().includes(this._apiFilter)
          )
        : [...this._apiList.values()]
      : undefined;
    // reset scroll position to top when filter changes
    this.scrollApiResults.scrollTop = 0;
  }
  _applyEndPtFilter(e?: CustomEvent) {
    this._endPtFilter = e?.detail?.value?.toLowerCase().trim() || '';

    const map = !!this._artifactId && this._apiEndPtsMap.get(this._artifactId);

    this.endPoints = map
      ? this._endPtFilter
        ? [...map.entries()]
            .filter(([id, item]) => {
              if (id === this.getEndPtId(this._endPt)) return true;
              const searchText = `${item.method} ${item.path} ${item.summary} ${
                item.description ?? ''
              }`.toLowerCase();
              return searchText.includes(this._endPtFilter);
            })
            .map(([, item]) => item)
        : [...map.values()]
      : undefined;
    // reset scroll position to top when filter changes
    this.scrollEndPtResults.scrollTop = 0;
  }

  async _handleModalAfterShow() {
    this.focusInput(this.apiInput);
    this._apiList ??= await this.getAllArtifacts();
    this._applyApiFilter();
    this._applyEndPtFilter();
  }
  _handleModalAfterHide() {
    this.modal.open = false;
    this._artifactId = this.value?.artifactId;
    this._api = this.value?.api;
    this._endPt = this.value
      ? this._apiEndPtsMap
          .get(this.value.artifactId)
          ?.get(this.getEndPtId(this.value))
      : undefined;
    this._apiFilter = this._endPtFilter = '';
    this._applyApiFilter();
    this._applyEndPtFilter();
    this.mainCard.focus();
  }
  _handleModalAction(e: CustomEvent) {
    if (e.detail.type === 'primary') {
      if (this._api && this._endPt) {
        const { method, path } = this._endPt;
        this.value = {
          method,
          path,
          artifactId: this._api.details.artifactId,
          api: this._api,
        };
        this.emit('sc-select', { detail: { value: this.value } });
        this.modal.open = false;
      }
    } else if (e.detail.type === 'secondary') {
      this.modal.open = false;
    }
  }

  _handleResultFocus(e: FocusEvent) {
    const el = e.target as HTMLElement;
    const card =
      el.querySelector<ScCard>('sc-card.selected') ??
      el.querySelector('sc-card.last-focus') ??
      el.querySelector<ScCard>('sc-card:first-child');
    if (card) {
      card.classList.add('last-focus');
      card.focus();
    }
  }
  _handleResultKeyPress(e: KeyboardEvent) {
    const current = this.shadowRoot?.querySelector<ScCard>(
      'sc-card[tabindex]:focus'
    );
    switch (e.key) {
      case 'down':
      case 'ArrowDown':
      case 'right':
      case 'ArrowRight':
        {
          const next = this.shadowRoot?.querySelector<ScCard>(
            'sc-card[tabindex]:focus + sc-card[tabindex]'
          );
          if (next) {
            current?.classList.remove('last-focus');
            next.classList.add('last-focus');
            next.focus();
          }
          e.preventDefault();
        }
        break;
      case 'up':
      case 'ArrowUp':
      case 'left':
      case 'ArrowLeft':
        {
          const prev = this.shadowRoot?.querySelector<ScCard>(
            'sc-card[tabindex]:has(+ sc-card[tabindex]:focus)'
          );
          if (prev) {
            current?.classList.remove('last-focus');
            prev.classList.add('last-focus');
            prev.focus();
          }
          e.preventDefault();
        }
        break;
      case 'PageDown':
        {
          const nexts = this.shadowRoot?.querySelectorAll<ScCard>(
            'sc-card[tabindex]:focus ~ sc-card[tabindex]'
          );
          const next = [...(nexts ?? [])].slice(0, 4).pop();
          if (next) {
            current?.classList.remove('last-focus');
            next.classList.add('last-focus');
            next.focus();
          }
          e.preventDefault();
        }
        break;
      case 'PageUp':
        {
          const prevs = this.shadowRoot?.querySelectorAll<ScCard>(
            'sc-card[tabindex]:has(~ sc-card[tabindex]:focus)'
          );
          const prev = [...(prevs ?? [])].slice(-4)[0];
          if (prev) {
            current?.classList.remove('last-focus');
            prev.classList.add('last-focus');
            prev.focus();
          }
          e.preventDefault();
        }
        break;
      case 'Home':
        {
          const first = current?.parentElement?.querySelector<ScCard>(
            'sc-card[tabindex]:first-child'
          );
          if (first) {
            current?.classList.remove('last-focus');
            first.classList.add('last-focus');
            first.focus();
          }
          e.preventDefault();
        }
        break;
      case 'End':
        {
          const last = current?.parentElement?.querySelector<ScCard>(
            'sc-card[tabindex]:last-child'
          );
          if (last) {
            current?.classList.remove('last-focus');
            last.classList.add('last-focus');
            last.focus();
          }
          e.preventDefault();
        }
        break;
      case 'Enter':
      case 'Spacebar':
      case ' ':
        current?.click();
        e.preventDefault();
        break;
      default:
        break;
    }
  }

  getEndPtId(endPt?: BaseEndPt) {
    return endPt ? `${endPt.method}__${endPt.path.replace(/\W/g, '_')}` : '';
  }

  _renderMarkedText(text: string, filter: string | false | undefined) {
    if (!filter) return text;

    const lowerText = text.toLowerCase();
    const lowerFilter = filter.toLowerCase();
    const firstMatchIndex = lowerText.indexOf(lowerFilter);

    if (firstMatchIndex === -1) return text;

    let displayText = text;
    if (firstMatchIndex > 60) {
      const prefix = text.slice(0, firstMatchIndex);
      const words = [...prefix.matchAll(/\S+/g)];
      const truncateFrom =
        words.length > 4 ? words[words.length - 4].index ?? 0 : 0;
      if (truncateFrom > 0) {
        displayText = `... ${text.slice(truncateFrom)}`;
      }
    }

    const displayLowerText = displayText.toLowerCase();
    const parts = [];
    let startIndex = 0;
    let matchIndex = displayLowerText.indexOf(lowerFilter, startIndex);

    while (matchIndex !== -1) {
      if (matchIndex > startIndex) {
        parts.push(displayText.slice(startIndex, matchIndex));
      }
      const endIndex = matchIndex + filter.length;
      parts.push(html`<mark>${displayText.slice(matchIndex, endIndex)}</mark>`);
      startIndex = endIndex;
      matchIndex = displayLowerText.indexOf(lowerFilter, startIndex);
    }

    if (parts.length === 0) return displayText;

    if (startIndex < displayText.length) {
      parts.push(displayText.slice(startIndex));
    }

    return parts;
  }

  _renderApiCard(item: ArtifactDetails) {
    const isSelected = this._artifactId === item.artifactId;
    const tagsGroup = [
      {
        type: 'primary' as any,
        iconName: '',
        content: item.labels.application_name,
      },
    ];
    if (item.labels?.business_unit) {
      tagsGroup.unshift({
        type: 'green' as any,
        iconName: '',
        content: item.labels.business_unit,
      });
    }

    return html`<sc-card
      id=${item.artifactId}
      clickable
      class="${isSelected ? 'selected' : ''}"
      height="100%"
      .tagsGroup=${tagsGroup}
      @click=${() => this.selectApi(item.artifactId, true)}
      @focus=${(e: FocusEvent) =>
        (e.target as HTMLElement).setAttribute('tabindex', '0')}
      @blur=${(e: FocusEvent) =>
        (e.target as HTMLElement).setAttribute('tabindex', '-1')}
      tabindex="-1"
      role="listitem"
    >
      <div slot="title" title=${item.name}>
        ${this._renderMarkedText(item.name, this._apiFilter)}
      </div>
      <div slot="body" title=${item.description}>
        ${this._renderMarkedText(item.description, this._apiFilter)}
      </div>
      <sc-icon
        slot="card-action-button"
        name=${isSelected ? 'checkmark-circle--fill' : '_'}
        size="md"
      ></sc-icon>
    </sc-card>`;
  }
  _renderEndPtCard(item: NonNullable<ScApiCatalog['_endPt']>) {
    const id = this.getEndPtId(item);
    const isSelected = this.getEndPtId(this._endPt) === id;
    return html`<sc-card
      id=${id}
      clickable
      class="end-pt ${isSelected ? 'selected' : ''}"
      height="100%"
      @focus=${(e: FocusEvent) =>
        (e.target as HTMLElement).setAttribute('tabindex', '0')}
      @blur=${(e: FocusEvent) =>
        (e.target as HTMLElement).setAttribute('tabindex', '-1')}
      @click=${() => this.selectEndPt(item, true)}
      tabindex="-1"
      role="listitem"
    >
      <div slot="title" title=${`${item.method.toUpperCase()} ${item.path}`}>
        <sc-tag>${item.method.toUpperCase()}</sc-tag>
        ${this._renderMarkedText(item.path, this._endPtFilter)}
      </div>
      <div slot="body" title=${`${item.summary}\n\n${item.description}`}>
        ${this._renderMarkedText(
          `${item.summary}\n\n${item.description}`,
          this._endPtFilter
        )}
      </div>
      <div slot="card-action-button">
        ${isSelected
          ? html`<sc-icon name="checkmark-circle--fill" size="md"></sc-icon>`
          : ''}
      </div>
    </sc-card>`;
  }

  render() {
    const $apis = guard([this.apiList, this._api, this._artifactId], () =>
      this.apiList
        ? this.apiList.length
          ? repeat(
              this.apiList,
              item => item.artifactId,
              item => this._renderApiCard(item)
            )
          : html`<em class="no-results">
              ${this._apiFilter ? 'No matching APIs' : 'No APIs found'}
            </em>`
        : html`<sc-spinner size="md"></sc-spinner>`
    );
    const $endPts = guard([this.endPoints, this._endPt], () =>
      this.apiList && this.endPoints
        ? this.endPoints.length
          ? repeat(
              this.endPoints,
              endPt => endPt.method + endPt.path,
              endPt => this._renderEndPtCard(endPt)
            )
          : html`<em class="no-results">
              ${this._endPtFilter
                ? 'No matching endpoints'
                : 'No endpoints found'}
            </em>`
        : html`<sc-spinner size="md"></sc-spinner>`
    );

    return html`
      <sc-text-input
        part="sc-input"
        class="sc-input"
        .value=${this.value?.artifactId ?? ''}
        suffix-icon=${this.value?.artifactId ?? ''}
        label=${ifDefined(this.label)}
        label-size=${this.labelSize}
        tooltip=${ifDefined(this.tooltip)}
        tooltip-placement=${ifDefined(this.tooltipPlacement)}
        hint=${ifDefined(this.hint)}
        hint-placement=${ifDefined(this.hintPlacement)}
        help-text=${ifDefined(this.helpText)}
        border-type=${ifDefined(this.borderType)}
        ?required=${this.required}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?success=${this.success}
        ?error=${this.error}
        success-message=${ifDefined(this.successMessage)}
        error-message=${ifDefined(this.errorMessage)}
        placeholder=${this.placeholder}
        clearable
        @click=${(e: MouseEvent) => {
          if (this.disabled || this.readonly) return;
          if (e.ctrlKey || e.metaKey) this.clear();
          this.modal.open = true;
        }}
        @sc-clear=${() => {
          this.value = undefined;
          this.emit('sc-clear', { detail: { value: this.value } });
        }}
      >
        <sc-card
          part="main-card"
          no-border
          slot="form-control"
          tabindex=${this.disabled || this.readonly ? '-1' : '0'}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') this.modal.open = true;
          }}
          role="button"
          aria-haspopup="dialog"
          aria-expanded=${this.modal?.open ? 'true' : 'false'}
          aria-controls="dialog"
        >
          ${this.value
            ? html`<div slot="title">
                  ${this._renderMarkedText(
                    this.value.api?.details.name ?? this.value.artifactId,
                    ''
                  )}
                </div>
                <div slot="body">
                  <sc-tag>${this.value.method.toUpperCase()}</sc-tag>
                  ${this._renderMarkedText(this.value.path, '')}
                </div>`
            : html`<div class="placeholder" slot="body">
                  ${this.placeholder}
                </div>
                <div></div>`}
        </sc-card>
        ${this.value &&
        !this._api &&
        !this._apiEndPtsMap.get(this.value.artifactId)
          ? html`<sc-spinner slot="suffix"></sc-spinner>`
          : ''}
      </sc-text-input>

      <sc-modal
        id="dialog"
        part="dialog"
        size="lg"
        no-close-icon
        no-header
        footer-type="button"
        button-text-primary="Select"
        button-text-secondary="Cancel"
        button-disable-primary=${!this._endPt}
        @sl-after-show=${this._handleModalAfterShow}
        @sl-after-hide=${this._handleModalAfterHide}
        @sc-action=${this._handleModalAction}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div class="modal-content">
          <div class="column api ${this._artifactId ? 'has-selected' : ''}">
            <sc-text-input
              autofocus
              id="dialog-title"
              part="input-api"
              class="input api"
              suffix-icon="search"
              placeholder=${this.apiPlaceholder}
              value=${this._apiFilter}
              @sc-input=${debounce(this._applyApiFilter, 300)}
            ></sc-text-input>
            <sc-scrollbar
              selector=".scroll-results.grid.api"
              always-visible
              tabindex="-1"
            ></sc-scrollbar>
            <div
              part="api-results"
              class="scroll-results grid api"
              role="list"
              tabindex="0"
              @focus=${this._handleResultFocus}
              @keydown=${this._handleResultKeyPress}
            >
              ${$apis}
            </div>
          </div>
          <div
            class="column end-pt ${this._artifactId ? 'has-selected' : ''}"
            ?inert=${!this._artifactId}
          >
            <sc-text-input
              part="input-end-pt"
              class="input end-pt"
              suffix-icon="search"
              placeholder=${this.endPtPlaceholder}
              value=${this._endPtFilter}
              @sc-input=${debounce(this._applyEndPtFilter, 300)}
            ></sc-text-input>
            <sc-scrollbar
              selector=".scroll-results.list.end-pt"
              always-visible
            ></sc-scrollbar>
            <div
              part="end-pt-results"
              class="scroll-results list end-pt"
              role="list"
              tabindex="0"
              @focus=${this._handleResultFocus}
              @keydown=${this._handleResultKeyPress}
            >
              ${$endPts}
            </div>
          </div>
        </div>
      </sc-modal>
    `;
  }
}
