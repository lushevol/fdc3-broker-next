import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { state } from 'lit/decorators.js';
import type {
  Dashboard,
  FilterOptions,
  FilterUpdateType,
  RangeFilterOptions,
  TableauViz,
  Worksheet,
} from '@tableau/embedding-api';
import { ScriptLoader } from '../ScriptLoader.js';
import { TableauReportProperties } from './TableauReportProperties.js';
import { TableauFilterUpdateType } from './typings.js';

export class ScTableauDashboard extends TableauReportProperties {
  private _id: string;

  private _error: string;

  private _ref: Ref<TableauViz> = createRef();

  @state()
  private _loading = true;

  constructor() {
    super();
    this.applyFilterAsync = this.applyFilterAsync.bind(this);
    this.applyRangeFilterAsync = this.applyRangeFilterAsync.bind(this);
    this.getFiltersAsync = this.getFiltersAsync.bind(this);
    this.changeParameterValueAsync = this.changeParameterValueAsync.bind(this);
    this.getParametersAsync = this.getParametersAsync.bind(this);
    this.clearFilterAsync = this.clearFilterAsync.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    this._id = this.id?.length ? this.id : `tableau-viz-${this.reportPath.replace(/[^a-zA-Z0-9-_]/g, '-')}`;
  }

  async firstUpdated() {
    try {
      await ScriptLoader.loadScript(this.scriptPath);
      this._loading = false;
    } catch (error: any) {
      console.error(error);
      this._error = error;
    }
  }

  public async applyFilterAsync(
    fieldName: string,
    values: Array<string>,
    updateType: TableauFilterUpdateType,
    filterOptions: FilterOptions,
    worksheetName?: string
  ) {
    const viz = this._ref.value;

    if (!viz?.workbook) {
      return Promise.reject(new Error('Tableau viz workbook not initialized'));
    }

    const sheet = viz.workbook.activeSheet;

    switch (sheet.sheetType) {
    case 'dashboard': {
      const dashboard = sheet as Dashboard;

      if (worksheetName) {
        const worksheet = dashboard.worksheets.find((ws: Worksheet) => ws.name === worksheetName);

        if (!worksheet) {
          return Promise.reject(new Error(`Worksheet ${worksheetName} not found`));
        }

        return worksheet.applyFilterAsync(
          fieldName,
          values,
            updateType as unknown as FilterUpdateType,
            filterOptions
        );
      }

      return (sheet as Dashboard).applyFilterAsync(
        fieldName,
        values,
          updateType as unknown as FilterUpdateType,
          filterOptions
      );
    }
    case 'worksheet':
      return (sheet as Worksheet).applyFilterAsync(
        fieldName,
        values,
          updateType as unknown as FilterUpdateType,
          filterOptions
      );
    default:
      return Promise.reject(new Error('Operation not supported'));
    }
  }

  public async applyRangeFilterAsync(fieldName: string, filterOptions: RangeFilterOptions, worksheetName?: string) {
    const viz = this._ref.value;

    if (!viz?.workbook) {
      return Promise.reject(new Error('Tableau viz workbook not initialized'));
    }

    const sheet = viz.workbook.activeSheet;

    switch (sheet.sheetType) {
    case 'dashboard': {
      const dashboard = sheet as Dashboard;

      if (worksheetName) {
        const worksheet = dashboard.worksheets.find((ws: Worksheet) => ws.name === worksheetName);

        if (!worksheet) {
          return Promise.reject(new Error(`Worksheet ${worksheetName} not found`));
        }

        return worksheet.applyRangeFilterAsync(fieldName, filterOptions);
      }

      return Promise.reject(new Error('Operation not supported'));
    }
    case 'worksheet':
      return (sheet as Worksheet).applyRangeFilterAsync(fieldName, filterOptions);
    default:
      return Promise.reject(new Error('Operation not supported'));
    }
  }

  public async getFiltersAsync(worksheetName?: string) {
    const viz = this._ref.value;

    if (!viz?.workbook) {
      return Promise.reject(new Error('Tableau viz workbook not initialized'));
    }

    const sheet = viz.workbook.activeSheet;

    switch (sheet.sheetType) {
    case 'dashboard': {
      const dashboard = sheet as Dashboard;

      if (worksheetName) {
        const worksheet = dashboard.worksheets.find((ws: Worksheet) => ws.name === worksheetName);

        if (!worksheet) {
          return Promise.reject(new Error(`Worksheet ${worksheetName} not found`));
        }

        return worksheet.getFiltersAsync();
      }

      return (sheet as Dashboard).getFiltersAsync();
    }
    case 'worksheet':
      return (sheet as Worksheet).getFiltersAsync();
    default:
      return Promise.reject(new Error('Operation not supported'));
    }
  }

  public async clearFilterAsync(fieldName: string, worksheetName?: string) {
    const viz = this._ref.value;

    if (!viz?.workbook) {
      return Promise.reject(new Error('Tableau viz workbook not initialized'));
    }

    const sheet = viz.workbook.activeSheet;

    switch (sheet.sheetType) {
    case 'dashboard': {
      const dashboard = sheet as Dashboard;

      if (worksheetName) {
        const worksheet = dashboard.worksheets.find((ws: Worksheet) => ws.name === worksheetName);

        if (!worksheet) {
          return Promise.reject(new Error(`Worksheet ${worksheetName} not found`));
        }

        return worksheet.clearFilterAsync(fieldName);
      }

      return (sheet as Dashboard).worksheets.forEach((worksheet: Worksheet) => worksheet.clearFilterAsync(fieldName));
    }
    case 'worksheet':
      return (sheet as Worksheet).clearFilterAsync(fieldName);
    default:
      return Promise.reject(new Error('Operation not supported'));
    }
  }

  public async changeParameterValueAsync(name: string, value: string | number | boolean | Date) {
    const viz = this._ref.value;

    if (!viz?.workbook) {
      return Promise.reject(new Error('Tableau viz workbook not initialized'));
    }

    return viz.workbook.changeParameterValueAsync(name, value);
  }

  public async getParametersAsync() {
    const viz = this._ref.value;

    if (!viz?.workbook) {
      return Promise.reject(new Error('Tableau viz workbook not initialized'));
    }

    return viz.workbook.getParametersAsync();
  }

  render() {
    if (this._error) {
      return html`<div class="error">Error: ${this._error}</div>`;
    }

    if (this._loading) {
      return html`<div style="height: 100%; text-align:center">
        <sc-spinner type="page" size="md"></sc-spinner>
      </div>`;
    }

    return html` <tableau-viz
            ${ref(this._ref)}
            id="${this._id}"
            src="${this.reportPath}"
            width=${ifDefined(this.width)}
            height=${ifDefined(this.height)}
            disable-url-actions-popups=${ifDefined(this.disableUrlActionsPopups)}
            hide-tabs=${ifDefined(this.hideTabs)}
            toolbar=${ifDefined(this.toolbar)}
            device=${ifDefined(this.device)}
            instance-id-to-clone=${ifDefined(this.instanceIdToClone)}
            hide-edit-button=${ifDefined(this.hideEditButton)}
            touch-optimize=${ifDefined(this.touchOptimize)}
            hide-edit-in-desktop-button=${ifDefined(this.hideEditInDesktopButton)}
            suppress-default-edit-behavior=${ifDefined(this.suppressDefaultEditBehavior)}
            token=${ifDefined(this.token)}
            debug=${ifDefined(this.debug)}
            iframe-auth=${ifDefined(this.iframeAuth)}
            iframe-attr-loading=${ifDefined(this.iframeAttributeLoading)}
            iframe-attr-style=${ifDefined(this.iframeAttributeStyle)}
            iframe-attr-class=${ifDefined(this.iframeAttributeClass)}
            @customviewloaded=${this.onCustomViewLoaded}
            @customviewremoved=${this.onCustomViewRemoved}
            @customviewsaved=${this.onCustomViewSaved}
            @customviewsetdefault=${this.onCustomViewSetDefault}
            @editbuttonclicked=${this.onEditButtonClicked}
            @filterchanged=${this.onFilterChanged}
            @firstvizsizeknown=${this.onFirstVizSizeKnown}
            @firstinteractive=${this.onFirstInteractive}
            @custommarkcontextmenu=${this.onCustomMarkContextMenuEvent}
            @markselectionchanged=${this.onMarkSelectionChanged}
            @parameterchanged=${this.onParameterChanged}
            @toolbarstatechanged=${this.onToolbarStateChanged}
            @workbookreadytoclose=${this.onWorkbookReadyToClose}
            @workbookpublished=${this.onWorkbookPublished}
            @workbookpublishedas=${this.onWorkbookPublishedAs}
            @urlaction=${this.onUrlAction}
            @tabswitched=${this.onTabSwitched}
            @storypointswitched=${this.onStoryPointSwitched}
            @editindesktopbuttonclicked=${this.onEditInDesktopButtonClicked}
          >
            ${repeat(
    this.filters ?? [],
    filter =>
      html` <viz-filter
                  field=${filter.field}
                  value=${Array.isArray(filter.value) ? filter.value.join(',') : filter.value}
                ></viz-filter>`
  )}
            ${repeat(
    this.parameters ?? [],
    parameter => html` <viz-paramter name=${parameter.name} value=${parameter.value}></viz-paramter>`
  )}
            ${repeat(
    this.customParameters ?? [],
    parameter => html` <custom-parameter name=${parameter.name} value=${parameter.value}></custom-parameter>`
  )}
          </tableau-viz>`;
  }
}
