import { html } from 'lit';
import { fixture } from '@open-wc/testing';
import { ScDashboardViewer } from '../../../src/components/ScDashboardViewer/ScDashboardViewer.js';
import '../../../elements/sc-dashboard-viewer.js';
import sinon from 'sinon';
import { ScTableauDashboard } from '../../../src/components/ScDashboardViewer/ScTableauDashboard/ScTableauDashboard.js';
import { TableauFilterUpdateType } from '../../../src/components/ScDashboardViewer/ScTableauDashboard/typings.js';

const host = 'https://uattreasuryanalytics.global.standardchartered.com/';

const scriptPath = `${host}/javascripts/api/tableau.embedding.3.latest.js`;
const reportPath = `${host}/#/views/NSFRSummaryandSourceUses-Entity/NSFRSummary`;

describe('ScTableauDashboard', () => {

  it('renders', async () => {
    const appendChild = document.body.appendChild.bind(document.body);
    const appendChildStub = sinon.stub(document.body, 'appendChild').callsFake(node => {
      appendChild(node);
      if (node instanceof HTMLScriptElement) {
        node.onload?.(new Event('load'));
      }
      return node;
    });

    const scDashboardViewer = await fixture<ScDashboardViewer>(html`
      <sc-dashboard-viewer type="tableau" .config=${{
    scriptPath, reportPath, width: '100%', height: '500px',
  }}
      </sc-dashboard-viewer>
    `);

    appendChildStub.restore();

    const scriptElement = document.querySelector(`script[src="${scriptPath}"]`) as HTMLScriptElement;
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.src).toBe(scriptPath);

    const scTableauDashboard = scDashboardViewer.shadowRoot?.querySelector('sc-tableau-dashboard');
    expect(scTableauDashboard).not.toBeNull();
    expect(scTableauDashboard?.shadowRoot?.querySelector('tableau-viz')).not.toBeNull();
  });

  it('renders with filters and parameters', async () => {
    const appendChild = document.body.appendChild.bind(document.body);
    const appendChildStub = sinon.stub(document.body, 'appendChild').callsFake(node => {
      appendChild(node);
      if (node instanceof HTMLScriptElement) {
        node.onload?.(new Event('load'));
      }
      return node;
    });

    const scDashboardViewer = await fixture<ScDashboardViewer>(html`
      <sc-dashboard-viewer type="tableau" .config=${{
    scriptPath, reportPath, width: '100%', height: '500px',
    '.filters': [{ field: 'field', value: 'value' }],
    '.parameters': [{ name: 'name', value: 'value' }],
    '.customParameters': [{ name: 'name', value: 'value' }],
  }}
      </sc-dashboard-viewer>
    `);

    appendChildStub.restore();

    const scriptElement = document.querySelector(`script[src="${scriptPath}"]`) as HTMLScriptElement;
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.src).toBe(scriptPath);

    const scTableauDashboard = scDashboardViewer.shadowRoot?.querySelector('sc-tableau-dashboard');
    expect(scTableauDashboard).not.toBeNull();
    expect(scTableauDashboard?.shadowRoot?.querySelector('tableau-viz')).not.toBeNull();
    expect(scTableauDashboard?.shadowRoot?.querySelector('viz-filter')).not.toBeNull();
    expect(scTableauDashboard?.shadowRoot?.querySelector('viz-paramter')).not.toBeNull();
    expect(scTableauDashboard?.shadowRoot?.querySelector('custom-parameter')).not.toBeNull();
  });

  it('renders with script loading pending', async () => {
    await fixture<ScDashboardViewer>(html`
      <sc-dashboard-viewer type="tableau" .config=${{
    scriptPath,
    reportPath,
    width: '100%',
    height: '500px',
  }}
      </sc-dashboard-viewer>
    `);

    const scriptElement = document.querySelector(`script[src="${scriptPath}"]`) as HTMLScriptElement;
    expect(scriptElement).not.toBeNull();
    expect(scriptElement?.src).toBe(scriptPath);
  });

  it('call internal viz function', async () => {
    const appendChild = document.body.appendChild.bind(document.body);
    const appendChildStub = sinon.stub(document.body, 'appendChild').callsFake(node => {
      appendChild(node);
      if (node instanceof HTMLScriptElement) {
        node.onload?.(new Event('load'));
      }
      return node;
    });

    const scDashboardViewer = await fixture<ScDashboardViewer>(html`
      <sc-dashboard-viewer type="tableau" .config=${{
    scriptPath, reportPath, width: '100%', height: '500px',
  }}
      </sc-dashboard-viewer>
    `);

    appendChildStub.restore();

    const scTableauDashboard = scDashboardViewer.shadowRoot?.querySelector('sc-tableau-dashboard') as ScTableauDashboard;
    expect(scTableauDashboard).not.toBeNull();
    expect(scTableauDashboard?.shadowRoot?.querySelector('tableau-viz')).not.toBeNull();


    await expect(() => scTableauDashboard.applyFilterAsync('Entity', [], TableauFilterUpdateType.Add, { isExcludeMode: false }, 'Summary Table')).rejects.toThrow('Tableau viz workbook not initialized');
    await expect(() => scTableauDashboard.applyFilterAsync('Entity', [], TableauFilterUpdateType.All, { isExcludeMode: false }, 'Summary Table')).rejects.toThrow('Tableau viz workbook not initialized');
    await expect(() => scTableauDashboard.applyFilterAsync('Entity', [], TableauFilterUpdateType.Replace, { isExcludeMode: false }, 'Summary Table')).rejects.toThrow('Tableau viz workbook not initialized');
    await expect(() => scTableauDashboard.applyFilterAsync('Entity', [], TableauFilterUpdateType.Remove, { isExcludeMode: false }, 'Summary Table')).rejects.toThrow('Tableau viz workbook not initialized');

    await expect(scTableauDashboard.applyRangeFilterAsync).rejects.toThrow('Tableau viz workbook not initialized');
    await expect(scTableauDashboard.getFiltersAsync).rejects.toThrow('Tableau viz workbook not initialized');
    await expect(scTableauDashboard.changeParameterValueAsync).rejects.toThrow('Tableau viz workbook not initialized');
    await expect(scTableauDashboard.getParametersAsync).rejects.toThrow('Tableau viz workbook not initialized');
    await expect(scTableauDashboard.clearFilterAsync).rejects.toThrow('Tableau viz workbook not initialized');
  });
});
