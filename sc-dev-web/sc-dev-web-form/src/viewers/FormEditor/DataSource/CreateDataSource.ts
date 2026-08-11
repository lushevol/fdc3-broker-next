import { html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  parseGraphQL,
  ParseGraphQLResult,
  getFieldsfromResult,
  Option,
  Namespace,
  GraphQLParams,
} from '../../utils/graphql.js';
import {
  buildProcessApiListQuery,
  loadParsedProcessApiInfo,
  mapProcessApiListToNamespaces,
} from '../../utils/process-api.js';
import ScElement from '../../utils/sc-element.js';
import type { ParameterType, ParsedSheetDataType, ParsedDataType } from './types.js';
import Style from '../../utils/common.style.js';
import { keyed } from 'lit/directives/keyed.js';

type NamespaceItem = Namespace & {
  metadataInfo?: {
    url?: string;
  };
  type?: string;
};

export default class CreateDataSource extends ScElement {
  static styles = [
    css`
      ${Style}
      .parameter-item {
        display: flex;
      }
      .parameter-item sc-text-input {
        flex: 1;
        margin-right: 0.625rem;
      }
      .parameter-item sc-icon {
        cursor: pointer;
      }
      .parameter-item .add {
        color: var(--sc-color-blue-500);
      }
      .parameter-item .delete {
        color: var(--sc-color-red-500);
        margin-left: 0.625rem;
      }
      .sub-title {
        margin-bottom: 1.5rem;
      }
      .row.small {
        padding-bottom: 0.6125rem;
      }
      .row.readonly-row {
        padding: 0;

        &.max-row {
          height: 5.25rem;
        }
      }
    `,
  ];

  @property({ type: String, attribute: 'source-type' }) selectedSourceType: string;

  @property({ type: String, attribute: 'source-name' }) sourceName: string;

  @property({ type: String, attribute: 'api-name-space-id' }) APINameSpaceId: string;

  @property({ type: String, attribute: 'api-name-space' }) APINameSpace: string;

  @property({ type: String, attribute: 'api-name-space-name' }) APINameSpaceName = '';

  @property({ type: String, attribute: 'api-name-space-label' }) APINameSpaceLabel = '';

  @property({ type: String, attribute: 'api-type' }) APIType = '';

  @property({ type: String, attribute: 'api-query-name' }) APIQueryName: string;

  @property({ type: String, attribute: 'api-query-name-label' }) APIQueryNameLabel = '';

  @property({ type: String, attribute: 'api-endpoint' }) APIEndpoint = '';

  @property({ type: String, attribute: 'api-endpoint-summary' }) APIEndpointSummary = '';

  @property({ type: String, attribute: 'api-method' }) APIMethod: string;

  @property({ type: Array, attribute: 'api-filters' }) APIArguments: Array<ParameterType | null> = [];

  @property({ type: Array, attribute: 'api-fields' }) APIFields: Array<string | null> = [];

  @property({ type: Boolean, attribute: 'show-error-message' }) showErrorMessage = false;

  @property({ type: String, attribute: 'error-message-parameter' }) errorMessageParameter = 'errors[0].message';

  @state() namespaces: Array<NamespaceItem> = [];

  @state() datasets: Option[] = [];

  @state() fields: any = [];

  @state() filters: any = [];

  @property({ type: Array }) attachments = undefined;

  @property({ type: Object }) data: ParsedDataType | undefined;

  @property({ type: Boolean }) readonly = false;

  @property({ type: Boolean, attribute: 'edit-data' }) editData = false;

  @property({ type: Array, attribute: 'tabs-data' }) tabsData?: ParsedSheetDataType[];

  @state() uploading = false;

  @state() errorMsg = '';

  @state() apis: Option[] = [];

  @state() selectedTab: string;

  @state() endpointMapping: Record<string, any> = {};

  @state() namespaceLoading = false;

  private _searchTimer: ReturnType<typeof setTimeout> | undefined;
  private _apiInfoLoading = false;
  private _pendingHydrate = false;
  private _pendingFilterDataset = '';
  private _apiMetaHydratedForKey = '';
  private _ensureFiltersQueuedForKey = '';
  private _hydrateAttemptCountByKey: Record<string, number> = {};
  private _apiMetaLoadedNamespaceId = '';
  private _apiMetaLoadedType = '';

  private _allApiInfo: any = [];
  private _apiFilters: any = {};
  private _apiFields: any = {};

  normalizeProcessFields(fields: any[] = []): string[] {
    return fields
      .map((item: any) => (typeof item === 'string' ? item : item?.value))
      .filter((item: string | undefined): item is string => !!item);
  }

  private mergeSelectedArguments(
    availableFilters: Array<{name: string; type?: string; in?: string; required?: boolean}>,
  ): ParameterType[] {
    const existingSelected = (this.APIArguments || [])
      .map((arg: ParameterType | null) => arg?.value)
      .filter((value: string | undefined): value is string => !!value);

    const requiredSelected = availableFilters
      .filter(item => item.required)
      .map(item => item.name);

    const selectedKeys = new Set([...requiredSelected, ...existingSelected]);

    return availableFilters
      .filter(item => selectedKeys.has(item.name))
      .map(item => ({
        value: item.name,
        type: item.type || 'text',
        in: item.in,
      }));
  }

  get isProcessApiType() {
    return this.APIType === 'process';
  }

  get isValidated() {
    if (this.selectedSourceType === 'api' || this.selectedSourceType === 'api-process') {
      return this.selectedSourceType && this.sourceName && this.APINameSpace && this.APIQueryName && this.APIMethod;
    }
    return false;
  }

  resolveApiType() {
    if (this.APIType) {
      return this.APIType;
    }

    const namespace = this.namespaces.find((ns: NamespaceItem) => ns.id === this.APINameSpaceId);
    if (namespace?.type === 'process') {
      return 'process';
    }
    if (namespace?.type) {
      return 'exp';
    }

    return '';
  }

  resolveProcessDatasetKey(dataset?: string) {
    const raw = (dataset || this.APIQueryName || '').trim();
    if (!raw) {
      return '';
    }

    if (this._apiFilters[raw] !== undefined) {
      return raw;
    }

    const candidates = [raw, this.APIEndpointSummary, this.APIEndpoint]
      .filter((item: string | undefined): item is string => !!item)
      .map((item: string) => item.trim());

    for (const item of this.datasets || []) {
      const value = String(item?.value || '').trim();
      const label = String(item?.label || '').trim();
      if (candidates.includes(value) || candidates.includes(label)) {
        return value;
      }
    }

    return '';
  }

  updated(changedProperties: any) {
    if (changedProperties.has('selectedSourceType')) {
      this.namespaces = [];
      this.datasets = [];
      this.fields = [];
      this.filters = [];
      this.endpointMapping = {};
      this._apiMetaHydratedForKey = '';
      this._hydrateAttemptCountByKey = {};
      this._apiMetaLoadedNamespaceId = '';
      this._apiMetaLoadedType = '';
      this._loadSchema();
    }

    if (
      changedProperties.has('APINameSpaceId') ||
      changedProperties.has('APIQueryName') ||
      changedProperties.has('APIType')
    ) {
      this._ensureFiltersQueuedForKey = '';
      this._pendingFilterDataset = '';
      this.hydrateApiMetaForEdit();
    }

    if (this.isValidated) {
      this.emit('api-fields-validated');
    }
  }

  async firstUpdated() {
    this._loadSchema();
    this.hydrateApiMetaForEdit();
  }

  async hydrateApiMetaForEdit() {
    if (this.selectedSourceType !== 'api' || !this.APINameSpaceId || !this.APIQueryName) {
      return;
    }

    const resolvedApiType = this.resolveApiType();
    if (!resolvedApiType) {
      return;
    }

    const hydrateKey = `${this.APINameSpaceId}::${this.APIQueryName}::${resolvedApiType}`;
    if (this._apiMetaHydratedForKey === hydrateKey) {
      return;
    }

    const canUseCachedMeta =
      this._apiMetaLoadedNamespaceId === this.APINameSpaceId
      && this._apiMetaLoadedType === resolvedApiType;

    if (canUseCachedMeta && this._apiFilters[this.APIQueryName] !== undefined) {
      if (resolvedApiType === 'process') {
        const datasetKey = this.resolveProcessDatasetKey(this.APIQueryName);
        if (datasetKey && datasetKey !== this.APIQueryName) {
          this.APIQueryName = datasetKey;
          this.onValueChanged(datasetKey, 'APIQueryName');
        }
        const targetDataset = datasetKey || this.APIQueryName;
        this.onEndPointSummaryChange(targetDataset);
        this.getFilters({ dataset: targetDataset, apiType: resolvedApiType });
      } else {
        this.getFields({ dataset: this.APIQueryName, apiType: resolvedApiType });
        this.getFilters({ dataset: this.APIQueryName, apiType: resolvedApiType });
      }
      this._apiMetaHydratedForKey = hydrateKey;
      return;
    }

    const MAX_HYDRATE_ATTEMPTS = 2;
    const attemptCount = this._hydrateAttemptCountByKey[hydrateKey] || 0;
    if (attemptCount >= MAX_HYDRATE_ATTEMPTS) {
      return;
    }

    if (this._apiInfoLoading) {
      this._pendingHydrate = true;
      return;
    }

    this._hydrateAttemptCountByKey[hydrateKey] = attemptCount + 1;
    this._apiInfoLoading = true;
    try {
      await this.loadApiInfo(this.APINameSpaceId, resolvedApiType);

      const currentHydrateKey = `${this.APINameSpaceId}::${this.APIQueryName}::${this.resolveApiType()}`;
      if (currentHydrateKey !== hydrateKey) {
        return;
      }

      if (resolvedApiType === 'process') {
        const datasetKey = this.resolveProcessDatasetKey(this.APIQueryName);
        if (datasetKey && datasetKey !== this.APIQueryName) {
          this.APIQueryName = datasetKey;
          this.onValueChanged(datasetKey, 'APIQueryName');
        }
        const targetDataset = datasetKey || this.APIQueryName;
        this.onEndPointSummaryChange(targetDataset);
        this.getFilters({ dataset: targetDataset, apiType: resolvedApiType });
      } else {
        this.getFields({ dataset: this.APIQueryName, apiType: resolvedApiType });
        this.getFilters({ dataset: this.APIQueryName, apiType: resolvedApiType });
      }

      const targetDataset = resolvedApiType === 'process'
        ? (this.resolveProcessDatasetKey(this.APIQueryName) || this.APIQueryName)
        : this.APIQueryName;
      const hasDatasetMeta =
        resolvedApiType === 'process'
          ? this._apiFilters[targetDataset] !== undefined
          : true;

      if (hasDatasetMeta) {
        this._apiMetaHydratedForKey = hydrateKey;
      }
    } catch (error) {
      // Keep silent here; UI will remain usable and retries are capped per key.
    } finally {
      this._apiInfoLoading = false;

      if (this._pendingFilterDataset && this._apiFilters[this._pendingFilterDataset] !== undefined) {
        const pendingDataset = this._pendingFilterDataset;
        this._pendingFilterDataset = '';
        this.getFilters({ dataset: pendingDataset, apiType: this.resolveApiType() });
      }

      if (this._pendingHydrate) {
        this._pendingHydrate = false;
        void this.hydrateApiMetaForEdit();
      }
    }
  }

  onValueChanged(value: any, type: string) {
    this.emit('value-changed', {
      detail: {
        type,
        value,
      },
    });  
  }

  async _loadSchema(value?: string) {
    if (this.selectedSourceType !== 'api') {
      return;
    }

    this.namespaceLoading = true;
    try {
      const response = await this._graphQLClient?.query(buildProcessApiListQuery(value));
      const jsonData = await response.json();
      const responseData = jsonData.data || jsonData;
      const list = responseData?.api?.get_findApiList || [];
      this.namespaces = mapProcessApiListToNamespaces(list);
      void this.hydrateApiMetaForEdit();
    } finally {
      this.namespaceLoading = false;
    }
  }

  async loadApiInfo(id: string, apiType?: string) {
    this._apiMetaHydratedForKey = '';
    const isProcessApi = apiType ? apiType === 'process' : this.isProcessApiType;
    if (isProcessApi) {
      const parsed = await loadParsedProcessApiInfo(this._graphQLClient, id);
      this.endpointMapping = parsed.endpointMapping;
      this.datasets = parsed.datasets;
      this._apiFilters = {};
      this._apiFields = {};
      parsed.datasets.forEach((item: Option) => {
        const endpointMeta = parsed.endpointMapping[item.value] || {};
        this._apiFilters[item.value] = endpointMeta.parameters || [];
        this._apiFields[item.value] = this.normalizeProcessFields(endpointMeta.fields || []);
      });
      this._apiMetaLoadedNamespaceId = id;
      this._apiMetaLoadedType = 'process';
      return;
    }

    const response = await this._graphQLClient?.query(`query {
      _55313_128_webkit_exp_api {
        get_api_info(serviceId: "${id}", bankId: "") {
          data
        }
      }
    }`);
    const {
      data: {
        _55313_128_webkit_exp_api: { get_api_info },
      },
    } = await response.json();
    const target = get_api_info.data;
    let schema;
    if (target.error) {
      this.errorMsg = target.error;
    } else if (target.errors) {
      this.errorMsg = target.errors?.[0]?.message || '';
    } else {
      schema = target?.data?.__schema;
    }
    if (schema) {
      this._allApiInfo = schema.types;
      const apis = schema.types.find(({ name }: {name: string}) => name === 'Query')?.fields || [];
      const apiOpts: Option[] = [];
      apis.forEach(({ name, args, isDeprecated, type }: any) => {
        if (name !== '_service' && !isDeprecated) {
          apiOpts.push({
            label: name,
            value: name,
          });
          this._apiFilters[name] = args;
          this._apiFields[name] = type;
        }
      });
      this.datasets = apiOpts;
      this._apiMetaLoadedNamespaceId = id;
      this._apiMetaLoadedType = 'exp';
    }
  }

  onNamespaceSelected(event: CustomEvent) {
    const id = event.detail.value;
    if (id !== this.APINameSpaceId) {
      this.APIQueryName = '';
      this.APIQueryNameLabel = '';
      this.APINameSpaceLabel = '';
      this.APIFields = [];
      this.APIArguments = [];
      this.onValueChanged('', 'APIQueryName');
      this.onValueChanged('', 'APIQueryNameLabel');
      this.onValueChanged('', 'APINameSpaceLabel');
      this.onValueChanged([], 'APIFields');
      this.onValueChanged([], 'APIArguments');
    }
    const namespace: any = this.namespaces.find((ns: Namespace) => ns.id === id);
    if (!namespace) {
      return;
    }

    this.APINameSpaceId = id;
    this.APIType = namespace?.type === 'process' ? 'process' : 'exp';
    this.APINameSpaceName = namespace?.name || '';
    this.APINameSpaceLabel = namespace?.namespace || '';
    this.onValueChanged(this.APIType, 'APIType');
    this.onValueChanged(this.APINameSpaceName, 'APINameSpaceName');
    this.onValueChanged(this.APINameSpaceLabel, 'APINameSpaceLabel');
    this.loadApiInfo(id, this.APIType);

    if (namespace?.type === 'process') {
      this.APINameSpace = namespace?.metadataInfo?.url || namespace?.name || '';
      this.APIMethod = '';
      this.APIEndpoint = '';
      this.APIEndpointSummary = '';
      this.APIQueryNameLabel = '';
      this.APIFields = [];
      this.onValueChanged(this.APINameSpaceId, 'APINameSpaceId');
      this.onValueChanged(this.APINameSpace, 'APINameSpace');
      this.onValueChanged('', 'APIQueryNameLabel');
      this.onValueChanged([], 'APIFields');
      return;
    }

    const nArr = namespace['namespace']
      .split('-')
      .filter((item: string, index: number) => 
        (index === 0 && !/^[a-zA-Z]+$/.test(item)) || 
      (index === 1 && item !== '55313') || 
      index >= 2
      );
    nArr.unshift('55313');
    namespace['namespace'] = nArr.join('-');

    if (namespace) {
      // @ts-ignore
      this.APINameSpace = (
        `_${namespace.namespace?.match(/[0-9]+-?[0-9]*/)?.[0]}_${namespace.name}`
      ).replace(/-/g, '_');
      this.APINameSpaceId = namespace.id;
    }
  }

  getFields(params: {dataset: string; apiType?: string}) {
    const apiType = params.apiType || this.resolveApiType();
    if (apiType === 'process') {
      const fields = this._apiFields[params.dataset] || [];
      this.fields = fields.map((field: string) => ({ label: field, value: field }));
      return;
    }
    const fields = this._apiFields[params.dataset] || {};
    const parsedFields: ParseGraphQLResult = parseGraphQL({ type: fields }, this._allApiInfo);
    const options = getFieldsfromResult(parsedFields);
    this.fields = options;
  }

  getFilters(params: {dataset: string; apiType?: string}) {
    const apiType = params.apiType || this.resolveApiType();
    if (apiType === 'process') {
      const normalizedDataset = this.resolveProcessDatasetKey(params.dataset);
      const dataset = normalizedDataset || params.dataset;
      if (normalizedDataset && normalizedDataset !== this.APIQueryName) {
        this.APIQueryName = normalizedDataset;
        this.onValueChanged(normalizedDataset, 'APIQueryName');
      }
      if (this._apiFilters[dataset] === undefined && this.APINameSpaceId) {
        this._pendingFilterDataset = dataset;
        if (this._apiInfoLoading) {
          this._pendingHydrate = true;
          return;
        }
        void this.hydrateApiMetaForEdit();
        return;
      }
      this.filters = (this._apiFilters[dataset] || []).map((item: any) => ({
        name: item.name,
        type: item.type,
        required: item.required,
        in: item.in,
      }));
      this.APIArguments = this.mergeSelectedArguments(this.filters);
      this.onValueChanged(this.APIArguments, 'APIArguments');
      return;
    }
    const _filters = this._apiFilters[params.dataset] || [];
    let queryOptions: Option[] = [];
    const parsedFilters = _filters.map((item: GraphQLParams) => {
      const result = parseGraphQL(item, this._allApiInfo);
      queryOptions = queryOptions.concat(getFieldsfromResult(result));
      return result;
    });
    this.filters = parsedFilters;
    this.APIArguments = this.mergeSelectedArguments(this.filters);
    this.onValueChanged(this.APIArguments, 'APIArguments');
  }

  ensureFiltersHydrated() {
    if (
      this.selectedSourceType !== 'api' ||
      !this.APINameSpaceId ||
      !this.APIQueryName
    ) {
      return;
    }

    const targetApiType = this.resolveApiType();
    if (!targetApiType) {
      return;
    }

    const targetDataset = targetApiType === 'process'
      ? (this.resolveProcessDatasetKey(this.APIQueryName) || this.APIQueryName)
      : this.APIQueryName;
    const key = `${this.APINameSpaceId}::${targetDataset}::${targetApiType}`;
    if (this._ensureFiltersQueuedForKey === key) {
      return;
    }

    this._ensureFiltersQueuedForKey = key;
    queueMicrotask(async () => {
      if (this._apiFilters[targetDataset] === undefined) {
        await this.hydrateApiMetaForEdit();
      }

      if (!this.filters?.length && this._apiFilters[targetDataset] !== undefined) {
        this.getFilters({ dataset: targetDataset, apiType: targetApiType });
      }
    });
  }

  renderNamespace() {
    const label = 'API';
    const placeholder = 'Type to search and select an API';
    const options = this.namespaces.map((item: any) => ({
      label: html`
        <sc-paragraph>${item.name || item.id}</sc-paragraph>
        <sc-paragraph size="xs" style="color:var(--sc-color-grey-550)">${item.namespace}</sc-paragraph>
      `,
      value: item.id,
      displayValue: !this.readonly ? item.name || item.id : html`
        <div style="display:flex; flex-direction:column;">
          <sc-paragraph>${item.name || item.id}</sc-paragraph>
          <sc-paragraph style="color:var(--sc-color-grey-550)">${item.namespace}</sc-paragraph>
        </div>
      `,
    }));

    const hasSelectedNamespace = this.namespaces.some((item: NamespaceItem) => item.id === this.APINameSpaceId);
    if (this.APINameSpaceId && !hasSelectedNamespace) {
      const fallbackName = this.APINameSpaceName || this.APINameSpace || this.APINameSpaceId;
      const fallbackNamespaceLabel = this.APINameSpaceLabel || '';
      options.unshift({
        label: html`
          <sc-paragraph>${fallbackName}</sc-paragraph>
          <sc-paragraph size="xs" style="color:var(--sc-color-grey-550)">${fallbackNamespaceLabel}</sc-paragraph>
        `,
        value: this.APINameSpaceId,
        displayValue: !this.readonly ? fallbackName : html`
          <div style="display:flex; flex-direction:column;">
            <sc-paragraph>${fallbackName}</sc-paragraph>
            <sc-paragraph style="color:var(--sc-color-grey-550)">${fallbackNamespaceLabel}</sc-paragraph>
          </div>
        `,
      });
    }

    return html`
      <sc-dropdown-input
        ?readonly=${this.readonly}
        label=${label}
        required
        hoist
        clearable
        placeholder=${placeholder}
        .value=${this.APINameSpaceId}
        @sc-select=${this.onNamespaceSelected}
        .loading=${this.namespaceLoading}
        @sc-input=${this.selectedSourceType === 'api'
          ? (e: CustomEvent) => {
              clearTimeout(this._searchTimer);
              this._searchTimer = setTimeout(
                () => this._loadSchema(e.detail.value),
                500,
              );
            }
          : nothing}
        .data=${options}
      >
      </sc-dropdown-input>
    `;
  }

  onDataSetSelected(event: CustomEvent) {
    const {
      detail: { value },
    } = event;

    if (this.APIQueryName !== value) {
      this.APIFields = [];
      this.APIArguments = [];
      this.onValueChanged([], 'APIFields');
      this.onValueChanged([], 'APIArguments');
    }

    this.APIQueryName = value;
    const selectedDataSet = (this.datasets || []).find((item: any) => item.value === value);
    this.APIQueryNameLabel = selectedDataSet?.label || '';

    if (this.resolveApiType() === 'process') {
      this.APIFields = [];
      this.onValueChanged([], 'APIFields');
      const targetDataset = this.resolveProcessDatasetKey(value) || value;
      this.getFilters({ dataset: targetDataset, apiType: 'process' });
      this.onEndPointSummaryChange(targetDataset);
    } else {
      this.getFields({ dataset: value });
      this.getFilters({ dataset: value });
    }

    this.onValueChanged(this.APINameSpaceId, 'APINameSpaceId');
    this.onValueChanged(this.APINameSpace, 'APINameSpace');
    this.onValueChanged(this.APIQueryName, 'APIQueryName');
    this.onValueChanged(this.APIQueryNameLabel, 'APIQueryNameLabel');
  }

  renderDataSet() {
    const isExpApiType = this.resolveApiType() === 'exp';
    const selectedDataSet = this.datasets.find((item: Option) => item.value === this.APIQueryName);
    const fallbackLabel = this.APIQueryNameLabel || this.APIEndpointSummary || this.APIQueryName;
    const shouldReadonlySingleLine = this.readonly
      && isExpApiType
      && (
        (!!selectedDataSet && (selectedDataSet.label === selectedDataSet.value))
        || (!selectedDataSet && fallbackLabel === this.APIQueryName)
      );

    const options = this.datasets.map((item: any) => ({
      label: html`
          <sc-paragraph>${item.label}</sc-paragraph>
          <sc-paragraph size="xs" style="color:var(--sc-color-grey-550)">${item.value}</sc-paragraph>
    `,
      value: item.value,
      displayValue: !this.readonly
        ? item.label
        : shouldReadonlySingleLine && item.label === item.value
          ? html`<sc-paragraph>${item.label}</sc-paragraph>`
          : html`
          <div style="display:flex; flex-direction:column;">
            <sc-paragraph>${item.label}</sc-paragraph>
            <sc-paragraph style="color:var(--sc-color-grey-550)">${item.value}</sc-paragraph>
          </div>
    `,
    }));

    const hasSelectedDataSet = this.datasets.some((item: Option) => item.value === this.APIQueryName);
    if (this.APIQueryName && !hasSelectedDataSet) {
      options.unshift({
        label: html`
          <sc-paragraph>${fallbackLabel}</sc-paragraph>
          <sc-paragraph size="xs" style="color:var(--sc-color-grey-550)">${this.APIQueryName}</sc-paragraph>
        `,
        value: this.APIQueryName,
        displayValue: !this.readonly
          ? fallbackLabel
          : shouldReadonlySingleLine
            ? html`<sc-paragraph>${fallbackLabel}</sc-paragraph>`
            : html`
          <div style="display:flex; flex-direction:column;">
            <sc-paragraph>${fallbackLabel}</sc-paragraph>
            <sc-paragraph style="color:var(--sc-color-grey-550)">${this.APIQueryName}</sc-paragraph>
          </div>
        `,
      });
    }

    const dataSetDropdown = this.APINameSpaceId ? html`
      <sc-dropdown-input
        ?readonly=${this.readonly}
        label=${this.readonly ? 'Endpoint' : ''}
        required
        hoist
        clearable
        placeholder="Please select a dataset"
        .value=${this.APIQueryName}
        @sc-select=${this.onDataSetSelected}
        .data=${options}
        >
      </sc-dropdown-input>
    ` : nothing;

    if (!this.readonly) {
      return dataSetDropdown;
    }

    return html`
      <div class="row readonly-row ${shouldReadonlySingleLine ? '' : 'max-row'}">
        ${dataSetDropdown}
      </div>
    `;
  }

  onEndPointSummaryChange(summary: string) {
    this.APIEndpointSummary = summary;
    const endpointMeta = this.endpointMapping[summary] || {};
    this.APIEndpoint = endpointMeta.endpoint || '';
    this.APIMethod = endpointMeta.method || '';
    if (this.resolveApiType() === 'process') {
      const processFields = this.normalizeProcessFields(endpointMeta.fields || []);
      this.APIFields = processFields;
      this.onValueChanged(this.APIFields, 'APIFields');
    }
    this.onValueChanged(this.APIEndpointSummary, 'APIEndpointSummary');
    this.onValueChanged(this.APIEndpoint, 'APIEndpoint');
    this.onValueChanged(this.APIMethod, 'APIMethod');
  }

  renderFields() {
    const disabledFieldSelection =
      !this.APINameSpace || !this.APIQueryName;
    if (this.resolveApiType() === 'process') return nothing;
    if (disabledFieldSelection) return nothing;
    return !this.readonly ? html`
      <div class=row>
        <sc-dropdown-multi-select
          label="Fields"
          hoist
          placeholder="Please select field(s)"
          border-type="box"
          .value=${this.APIFields || []}
          @sc-select=${(event: CustomEvent) => {
            this.APIFields = event.detail.value;
            this.onValueChanged(this.APIFields, 'APIFields');
            this.requestUpdate();
          }}
          .data=${this.fields.map((item: any) => ({
            label: item.label,
            value: item.value,
          }))}
          >
        </sc-dropdown-multi-select>
      </div>
    ` 
    : html`
      <div class="row readonly-row">
        <div style="padding-bottom:1rem">
          <sc-label label="Fields" label-size="md"></sc-label>
          ${repeat(this.APIFields || [], (item: any) => item, item => {
            return html`
              <sc-tag type="grey" mode="default" style="margin-bottom:1rem;"> 
                ${item} 
              </sc-tag>`;
          })}
        </div>
      </div>`;
  }

  renderFilters() {
    const disabledFilterSelection =
      !this.APINameSpace || !this.APIQueryName;
    const emptyFilter =
      disabledFilterSelection || !this.filters || this.filters.length === 0;
    if (disabledFilterSelection) {
      return nothing;
    }

    if (emptyFilter) {
      this.ensureFiltersHydrated();
      return nothing;
    }
    const requiredFilters: string[] = this.filters
      .filter((item: ParseGraphQLResult) => item.required)
      .map((item: ParseGraphQLResult) => item.name);
    const FiltersValue = this.APIArguments
    ? this.APIArguments
      .filter((arg: ParameterType | null) => !requiredFilters.includes(arg?.value || '') && arg?.value !== null)
      .map((arg: ParameterType | null) => arg?.value)
      .filter((value: string | undefined): value is string => !!value)
    : [];
    return html`
      <div class="row ${this.readonly ? 'readonly-row' : ''}">
        ${!this.readonly ? html`
          <sc-dropdown-multi-select
            label="Filters"
            hoist
            placeholder="Please select Filter(s)"
            border-type="box"
            .value=${FiltersValue}
            @sc-select=${(event: CustomEvent) => {
              const selectedFiltersKeys = [...requiredFilters, ...event.detail.value];
              this.APIArguments = this.filters
                .filter((item: any) => selectedFiltersKeys.includes(item.name))
                .map((item: any) => ({
                  value: item.name,
                  type: item.type,
                  in: item.in,
                }));
              this.onValueChanged(this.APIArguments, 'APIArguments');
              this.requestUpdate();
            }}
            .data=${this.filters.map((item: any) => !item.required ? ({
              label: item.name,
              value: item.name,
            }) : null).filter((item: any) => item !== null)}
            >
          </sc-dropdown-multi-select>` 
          : html`
            <sc-label label="Filters" label-size="md"></sc-label>
            ${repeat(FiltersValue || [], item => item, item => {
                return html`
                  <sc-tag type="grey" mode="default"> 
                    ${item} 
                  </sc-tag>`;
            })}`
          }
          ${
            requiredFilters.map(item => {
              return html`
                <sc-tag type="grey" mode="default"> 
                  ${item} 
                </sc-tag>`;
            })
          }
          ${requiredFilters.length > 0 ? html`
              <sc-spacer vertical size="08"></sc-spacer>
            ` : nothing}
      </div>
    `;
  }

  renderErrorMessage() {
    const disabledErrorMessage =
      !this.APINameSpace || !this.APIQueryName;
    if (disabledErrorMessage) return '';
    return html`
      ${this.readonly ? nothing : html`<div class=row>
        <sc-checkbox 
          ?checked=${!!this.showErrorMessage}
          @sc-change=${(event: CustomEvent) => {
            this.onValueChanged(event.detail.checked, 'showErrorMessage');
          }}
        >
          Show error message if API fails
        </sc-checkbox>
      </div>`}
      ${this.showErrorMessage ? html`<div class=row>
        <sc-text-input
          ?readonly=${this.readonly}
          label='Error'
          .value=${this.errorMessageParameter}
          placeholder='Input the error message parameter, e.g errors[0].message'
          @sc-input=${
            (event: CustomEvent) => {
              this.onValueChanged(event.detail.value, 'errorMessageParameter');
            }
          }
        ></sc-text-input>
      </div>` : nothing}
    `;
  }

  renderAPIConfig() {
    return this.readonly ? html`
      <div class="row readonly-row max-row">
        ${this.renderNamespace()}
      </div>
      ${this.renderDataSet()}
      ${this.renderFields()}
      ${this.renderFilters()}
    ` : html`
      <div class="row small">
        ${this.renderNamespace()}
        ${this.renderDataSet()}
      </div>
      ${this.renderFields()}
      ${this.renderFilters()}
      ${this.renderErrorMessage()}
    `;
  }

  renderExcelConfig() {
    return html`
      <div class=row>
        ${this.renderFileUpload()}
      </div>
      <div>
        ${this.renderFileResult()}
      </div>
    `;
  }

  uploadFile = async (file: File) => {
    if (file) {
      this.uploading = true;
      this.loadingEmit(true);
      const fd = new FormData();
      fd.append('file', file);
      let response;
      try {
        response = await this._restClient.request(
          '55313-128-webkit-plugin-webkit-exp-api',
          'api/webkit/v1/excels:parse-sheets',
          'POST',
          fd
        );
        const data = await response.json();
        if (!Array.isArray(data) || !data.length || !data[0].sheetDetail.properties) {
          this.uploading = false;
          this.loadingEmit(false);
          return;
        }
        let properties_ = {}, contents_:any[] = [] ;
        const dataMap = data.map((sheet: any) => {
          const { sheetName, sheetNo, sheetDetail } = sheet;
          const { contents, properties } = sheetDetail;
          const properties_sheetNo = Object.entries(properties).reduce((acc: any, [key, value]) => {
            acc[`${key}-${sheetName}`] = `${sheetName} - ${value}`;
            return acc;
          }, {} as Record<string, string>);
        
          const contents_sheetNo = contents.map((content: any) =>
            Object.entries(content).reduce((acc: any, [key, value]) => {
              acc[`${key}-${sheetName}`] = value;
              return acc;
            }, {} as Record<string, string>)
          );
          properties_ = { ...properties_, ...properties_sheetNo };
          contents_ = [...contents_, ...contents_sheetNo];
          return properties
            ? {
              sheetDetail: {
                contents: contents.slice(0, 500),
                properties,
              },
              sheetName,
              sheetNo,
            }
            : sheet;
        });
        this.selectedTab = dataMap?.[0]?.sheetName;
        this.onValueChanged({
          properties: properties_,
          contents: contents_.slice(0, 500),
        }, 'parsedData');
        this.onValueChanged(dataMap, 'parsedDataTab');
        this.loadingEmit(false);
      } catch (error) {
        this.errorMsg = 'File upload failed';
        this.loadingEmit(true);
        return;
      }
      this.uploading = false;
    }
  };

  loadingEmit(value: boolean) {
    this.emit('on-loading', {
      detail: {
        value,
      },
    });
  }

  transformData(input: any): any[] {
    const { contents, properties } = input;
    const propertyMap = properties;
    return contents.map((item: any) => {
      const transformedItem: any = {};
      for (const key in item) {
        if (propertyMap[key]) {
          transformedItem[propertyMap[key]] = item[key];
        }
      }
      return transformedItem;
    });
  }

  async generateExcel(jsonDataArray: ParsedSheetDataType[], fileName: string) {
    const { utils, writeFile } = await import('xlsx-republish');
    const workbook = utils.book_new();
    jsonDataArray.forEach(sheet => {
      const result = this.transformData(sheet.sheetDetail);
      const worksheet = utils.json_to_sheet(result);
      utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
    });
    writeFile(workbook, `${fileName}.xlsx`);
  }

  renderFileUpload() {
    return html`
      <sc-file-input
        .selectable=${!!this.tabsData}
        label=File 
        required
        deletable
        placeholder="Click or drop file here"
        .value=${this.attachments}
        accept='.xlsx'
        @sc-change=${(e: CustomEvent) => {
    this.data = undefined;
    const files = e.detail.value;
    this.uploadFile(files[0]);
    this.onValueChanged(files.map((file: any) => ({
      id: file.id,
      name: file.name,
    })), 'attachments');
  }}
        @sc-select=${(e: CustomEvent) => {
    if (this.tabsData) {
      this.generateExcel(this.tabsData, e.detail.value?.name);
    }
  }}
      >
      </sc-file-input>
    `; 
  }

  renderTabPanelConf(sheetDetail:ParsedDataType) {
    let tableConf:any[] = [], tableData:ParsedDataType[] = [];
    if (sheetDetail) {
      const { properties, contents } = sheetDetail;
      tableConf = Object.keys(properties).map((key: string) => ({
        property: key,
        header: properties[key],
        columnStyle: 'min-width: 9.375rem',
      }));
      tableData = contents;
    }
    return  html`
      ${tableData?.length >= 500 
    ? html`<sc-alert type="warning" mode="banner" open>
            <div>
              Your file exceeds the 500-row limit. Only the first 500 rows will be saved.
            </div>
          </sc-alert>` 
    : nothing}
        <div style="width:99%; margin: 0 auto;">
          <sc-data-grid 
            dynamic-column-width
            disable-flexible-column-width
            .columns=${tableConf} 
            .data=${tableData} 
            pagination 
            page-size=10></sc-data-grid>
        </div>
    `;
  }

  renderFileResult() {
    if (!this.attachments)  return nothing;
    if (!this.tabsData && this.data && this.data?.properties) {
      this.tabsData = [{
        sheetDetail: {
          contents: this.data.contents,
          properties: this.data.properties,
        },
        sheetName: 'sheet1',
        sheetNo: 0,
      }];
    }
    if (this.uploading && !this.tabsData) {
      return html`
            <div class="spinner-container">
                <sc-spinner type="component" size="sm"></sc-spinner>
            </div>
        `;
    }
    return html`
          <sc-tab-group class="sc-tabs" value=${this.selectedTab} @sc-tab-select=${
            (event: CustomEvent) => {
              this.selectedTab = event.detail.name; 
            }}
          >
          ${
            keyed(this.tabsData, this.tabsData?.map((sheet:ParsedSheetDataType) => html`
              ${ this.tabsData && this.tabsData.length > 1 ? html`
                  <sc-tab 
                    slot="nav" 
                    panel=${sheet.sheetName} 
                    ?active=${this.selectedTab === sheet.sheetName}
                  >${sheet.sheetName}</sc-tab>
                ` : nothing } 
              <sc-tab-panel
                name=${sheet.sheetName}
                ?active=${this.tabsData?.length === 1 || this.selectedTab === sheet.sheetName}
              >
                ${this.renderTabPanelConf(sheet.sheetDetail)}
              </sc-tab-panel>
            `))
          }
          </sc-tab-group>`;
  }

  render() {
    return html`
      <div class=row-container>
        <div class="row ${this.readonly && 'readonly-row'}">
          <sc-dropdown-input 
            ?readonly=${this.readonly || !!this.editData}
            required 
            hoist
            label='Data source type' 
            .value=${this.selectedSourceType} @sc-select=${
  (event: CustomEvent) => { 
    this.onValueChanged(event.detail.value, 'selectedSourceType');
  }}
          >
            <sc-dropdown-option value="api">API</sc-dropdown-option>
            <sc-dropdown-option value="excel">Excel</sc-dropdown-option>
          </sc-dropdown-input>
        </div>
        <div class="row ${this.readonly && 'readonly-row'}">
          <sc-text-input
            ?readonly=${this.readonly}
            required
            label='Data source name'
            .value=${this.sourceName}
            @sc-input=${
  (event: CustomEvent) => { this.onValueChanged(event.detail.value, 'sourceName'); }     
}
          ></sc-text-input>
        </div>
        ${
        this.selectedSourceType === 'api' ? this.renderAPIConfig() : 
    this.selectedSourceType === 'excel' ? this.renderExcelConfig() : nothing
}
      </div>
    `;
  }
}


if (!window.customElements.get('create-data-source')) {
  window.customElements.define('create-data-source', CreateDataSource);
}