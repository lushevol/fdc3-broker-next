import { html, LitElement } from 'lit';
import { ScTableauDashboard } from './ScTableauDashboard/ScTableauDashboard.js';
import { ScMSTRDashboard } from './MSTRDashboard/MSTRDashboard.js';
import { property } from 'lit/decorators.js';
import { ScDashboardViewerType } from './typings.js';
import { spread } from '@open-wc/lit-helpers';

export class ScDashboardViewer extends LitElement {

  @property({
    type: String,
    attribute: 'id',
  })
    id: string;

  @property({
    type: String,
    attribute: 'type',
  })
    type: ScDashboardViewerType;

  @property({
    type: Object,
    attribute: false,
  })
    config: Record<string, any>;


  static get scopedElements() {
    return {
      'sc-tableau-dashboard': ScTableauDashboard,
      'sc-mstr-dashboard': ScMSTRDashboard,
    };
  }

  protected render() {
    switch (this.type) {
    case 'tableau':
      return html`<sc-tableau-dashboard id=${this.id} ${spread(this.config)}></sc-tableau-dashboard>`;
    case 'mstr':
      return html`<sc-mstr-dashboard id=${this.id} ${spread(this.config)}></sc-mstr-dashboard>`;
    default:
      return html`<div id=${this.id}>Unsupported dashboard type ${this.type}</div>`;
    }
  }
}
