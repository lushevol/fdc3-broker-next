import { LitElement, PropertyValueMap, html } from 'lit';
import { state, property, queryAsync } from 'lit/decorators.js';
import { Annotation } from './Annotation.js';
import { ImgViewer } from './ImgViewer.js';
import ScTheme from '../../styles/ScTheme.js';
import ScImgDocViewerStyle from './ImgDocViewer.style.js';



export interface DocumentProps {
  name: string;
  pages: string[];
}

export interface PanelConfiguration {
  zoomLvl: number;
  currDocNo: number;
  containerHeight: number;
  containerWidth: number;
}

export interface SwooshExtractionProps {
  name: string;
  value: string;
  confidence?: number;
  pageNo?: number;
  xmin: number;
  xmax: number;
  ymin: number;
  ymax: number;
}

export enum NavigationAction {
  PREVIOUS = 'previous',
  NEXT = 'next',
}

export enum ZoomAction {
  IN = 'in',
  OUT = 'out',
}

const defaultPanelConfig = {
  zoomLvl: 1,
  currDocNo: 0,
  containerHeight: 0,
  containerWidth: 0,
};

export class ScDocumentImageViewer extends LitElement {

  static styles = ScTheme.getStyles().concat([ScImgDocViewerStyle]);


  static get scopedElements() {
    return {
      'img-viewer': ImgViewer,
      'doc-annotation': Annotation,
    };
  }


  disconnectedCallback(): void {
    this.data = { name: '', pages: [] };
    this.selections = [];
    this.panelConfig = defaultPanelConfig; 
  }

  @state()
    panelConfig: PanelConfiguration = defaultPanelConfig;

  @property({ attribute: true, type: Object })
    data: DocumentProps;

  @property({ attribute: true, type: Array })
    selections: SwooshExtractionProps[];

  @queryAsync('#viewer-container')
    viewerContainer: HTMLDivElement;


  protected async updated(
    changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ) {
    const container = await this?.viewerContainer;
    if (this.panelConfig.containerWidth === 0 && container && container.clientWidth) {
      this.updateContainerDimension();
    }
    if (
      changedProps.has('selections')) {
      this.panelConfig = {
        ...this.panelConfig,
        currDocNo: this.selections?.[0]?.pageNo ? this.selections[0].pageNo - 1 : 0,
      };
    }
  }

  async updateContainerDimension() {
    const container = await this.viewerContainer;

    this.panelConfig = {
      ...this.panelConfig,
      containerHeight: container.clientHeight,
      containerWidth: container.clientWidth,
    };
  }


  protected setCurrDocNo(navAction: NavigationAction) {
    let docNo = this.panelConfig.currDocNo;

    if (navAction === NavigationAction.PREVIOUS) {
      if (this.panelConfig.currDocNo > 0) {
        docNo = this.panelConfig.currDocNo - 1;
      }
    } else {
      if (this.panelConfig.currDocNo < this.getDocPageCount() - 1) {
        docNo = this.panelConfig.currDocNo + 1;
      }
    }

    this.panelConfig = {
      ...this.panelConfig,
      currDocNo: docNo,
    };
  }

  protected getDocPageCount() {
    return this.data?.pages?.length || 0;
  }

  private _setZoom(zoomDelta: number) {
    const nextZoom = this.panelConfig.zoomLvl + zoomDelta;
    if (nextZoom >= 0.25) {
      this.panelConfig = {
        ...this.panelConfig,
        zoomLvl: nextZoom,
      };
    }
  }

  protected roundTo50percent(x: number) {
    return Math.ceil(x / .5) * .5;
  }

  protected setZoomLvl(zoomAction: ZoomAction) {

    let zoomDelta = 0;
    const prevZoom = this.panelConfig.zoomLvl;
    if (zoomAction === ZoomAction.IN) {
      zoomDelta = this.roundTo50percent(prevZoom + 0.5) - prevZoom;
    } else {
      zoomDelta = this.roundTo50percent(prevZoom - 0.5) - prevZoom;
    }

    this._setZoom(zoomDelta);

  }

  protected getTopSection() {
    return html`<div class="top-section">
      <div class="top-left-section">
        <div>${this.data?.name}</div>
        <div id="page-no-status">${this.panelConfig.currDocNo + 1} / ${this.getDocPageCount()}</div>
      </div>
      <sc-divider
        size="xxs"
        line-width="xxs"
        line-height="xxs"
      >
      </sc-divider>
      <div class="zoom-section" style="width:20%">
        <sc-icon-button
          id="inc-zoom"
          type="default"
          size="sm"
          name="zoom-in--line"
          no-border="true"
          @click=${() => this.setZoomLvl(ZoomAction.IN)}
        >
        </sc-icon-button>
        <span id="zoom-status">${Number(this.panelConfig.zoomLvl * 100).toFixed(0)}%</span>
        <sc-icon-button
          id="dec-zoom"
          type="default"
          size="sm"
          name="zoom-out--line"
          no-border="true"
          @click=${() => this.setZoomLvl(ZoomAction.OUT)}
        >
        </sc-icon-button>
      </div>
      <sc-divider
        size="xxs"
        line-width="xxs"
        line-height="xxs"
      >
      </sc-divider>
      <div style="width:40%"></div>
    </div>`;
  }

  getViewer() {
    return html`<div id="viewer-container" class="viewer">
      ${!this.data?.pages?.length
    ? html`<sc-spinner type="component" size="lg"></sc-spinner>`
    : html`<img-viewer
            .src=${this.data.pages[this.panelConfig.currDocNo]}
            .data=${this.data}
            .config=${this.panelConfig}
            .annotations=${this.selections?.filter(
    sel => sel.pageNo === this.panelConfig.currDocNo + 1
  )}
            .setZoomIncrement=${(zoom: number) => {
    this._setZoom(zoom);
  }}
          ></img-viewer>`}
    </div>`;
  }

  getViewerSection() {
    return html`<div class="viewer-template">
      <sc-icon-button
        id="backward"
        type="default"
        size="md"
        name="arrow-ios-backward"
        no-border="true"
        ?disabled=${this.panelConfig.currDocNo === 0 ? true : false}
        @click=${() => this.setCurrDocNo(NavigationAction.PREVIOUS)}
        class="nav-icon"
      >
      </sc-icon-button>
      ${this.getViewer()}
      <sc-icon-button
        id="forward"
        type="default"
        size="md"
        name="arrow-ios-forward"
        no-border="true"
        ?disabled=${this.panelConfig.currDocNo >= this.getDocPageCount() - 1
    ? true
    : false}
        @click=${() => this.setCurrDocNo(NavigationAction.NEXT)}
        class="nav-icon"
      >
      </sc-icon-button>
    </div>`;
  }

  render() {
    return html`<div class="container">
      ${this.getTopSection()} ${this.getViewerSection()}
    </div>`;
  }
}
