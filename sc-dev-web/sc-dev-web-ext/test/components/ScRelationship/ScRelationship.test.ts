import { expect, fixture, waitUntil } from '@open-wc/testing';
import '@scdevkit/webkit/elements/sc-dropdown-input.js';
import '@scdevkit/webkit/elements/sc-icon.js';
import '@scdevkit/webkit/elements/sc-modal.js';
import '@scdevkit/webkit/elements/sc-search-field.js';
import { ChartEvent } from 'chart.js';
import { html } from 'lit';
import sinon from 'sinon';
import { ScRelationship } from '../../../elements/sc-relationship.js';
import { RelationshipConfig, RelEmployeeData } from '../../../src/components/ScRelationship/utils/types.js';
import '../../shared/domrect.js';
import '../../shared/fullscreen.js';
import '../../shared/resize-observer.js';

describe('ScRelationship', () => {
  const imgUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const img = document.createElement('img');
  img.src = imgUrl;
  const data: RelEmployeeData[] = [
    {
      id: '2027226',
      name: 'Santos, Jaycee',
      businessTitle: 'Senior Software Engineer',
      department: 'IT-Projects-TC-T&A SE DevOps',
      location: 'Makati City',
      links: [
        {
          id: '1574871',
          relationship: 'Manager',
        },
      ],
      imageUrl: imgUrl,
    },
    {
      id: '1574871',
      name: 'Thian, Hon Fui',
      businessTitle: 'Sr. Engineering Manager, Service Bench',
      department: 'IT-Projects-IC-T&A SE DevOps',
      location: 'Singapore',
      type: 'manager',
      links: [
        {
          id: '3440000005279030',
          relationship: 'Owner',
        },
      ],
    },
    {
      id: '3440000005279030',
      name: 'Service Bench',
      type: 'entity',
    },
  ];
  const config: RelationshipConfig = {
    linkSelectThreshold: 24,
    node: {
      shape: {
        default: 'star',
        custom: {
          manager: 'rectRounded',
          entity: 'rect',
        },
      },
      placeholder: {
        default: 'initials',
        custom: {
          entity: 'icon',
          manager: 'image',
        },
      },
      icon: {
        default: 'person--line',
        custom: { entity: 'network' },
      },
      image: { default: img },
    },
    link: {
      showText: { default: ['selected', 'x4', '200%'] },
      tail: { default: 'arrow' },
    },
  };

  it('renders relationship', async () => {
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        style="width:300px;height:300px"
      ></sc-relationship>
    `);
    await el.updateComplete;
    expect(el instanceof ScRelationship).to.be.true;
    expect(el.data.length).to.equal(data.length);
  });

  it('renders with UI elements', async () => {
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        minimap
        search
        legend
        export
        style="width:300px;height:300px"
      ></sc-relationship>
    `);
    await el.updateComplete;
    
    expect(el.$diagram).to.exist;
    expect(el.$minimap).to.exist;
    expect(el.$search).to.exist;
    expect(el.$exportModal).to.exist;
  });

  it('handles node hover', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
      .data=${data}
      style="width:300px;height:300px"
      @sc-hover=${(e:CustomEvent) => spyFn(e.detail.hover !== undefined)}
      ></sc-relationship>
    `);
    await el.updateComplete;

    el.$diagram.hover(el.$data.nodes[0].id, new DOMRect(0, 0, 10, 10));
    await waitUntil(() => spyFn.called);
    expect(spyFn, 'event.detail.hover is undefined').to.have.calledWith(true);

    el.$diagram.hover();
    await waitUntil(() => spyFn.callCount === 2);
    expect(spyFn, 'event.detail.hover is not undefined').to.be.calledWith(
      false
    );
  });

  it('handles node select', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        selectable
        zoomable
        rescale
        style="width:300px;height:300px"
        @sc-select=${() => spyFn()}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await waitUntil(() => el.$diagram?.updateComplete);
    
    el.$diagram.select([data[0].id]);
    await waitUntil(() => spyFn.called);
    expect(el.$diagram.selection).to.not.be.empty;

    el.$diagram.select([]);
    await waitUntil(() => spyFn.calledTwice);
    expect(el.$diagram.selection).to.be.empty;
  });
  
  it('handles link select', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        style="width:300px;height:300px"
        @sc-select=${() => spyFn()}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await waitUntil(() => el.$diagram?.updateComplete);
    
    el.$diagram.select([data[0].links?.[0].id ?? '']);
    await waitUntil(() => spyFn.called);
    expect(el.$diagram.selection).to.not.be.empty;

    el.$diagram.select([]);
    await waitUntil(() => spyFn.calledTwice);
    expect(el.$diagram.selection).to.be.empty;
  });
  
  it('pre-selects node', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        .selectIds=${[data[0].id]}
        style="width:300px;height:300px"
        @sc-select=${() => spyFn()}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await waitUntil(() => spyFn.calledOnce);
    expect(el.$diagram.selection).to.not.be.empty;

    el.$diagram.deselect([data[0].id]);
    await waitUntil(() => spyFn.calledTwice);
    expect(el.$diagram.selection).to.be.empty;
  });
  
  it('pre-selects link', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        .selectIds=${[data[0].links?.[0].id ?? '']}
        style="width:300px;height:300px"
        @sc-select=${() => spyFn()}
      ></sc-relationship>
    `);
    await waitUntil(() => spyFn.calledOnce);
    expect(el.$diagram.selection).to.not.be.empty;

    el.selectIds = [];
    await waitUntil(() => spyFn.calledTwice);
    expect(el.$diagram.selection).to.be.empty;
  });
  
  it('handles search', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        search
        style="width:300px;height:300px"
        @sc-rel-search-select=${(e: CustomEvent) => spyFn(e.type)}
      ></sc-relationship>
    `);
    await el.updateComplete;

    el.handleSearchInput(new CustomEvent('sc-input', { detail: { value: data[0].name } }));
    el.handleSearchSelect(new CustomEvent('sc-select', { detail: { value: data[0].id } }));

    await new Promise(resolve => setTimeout(resolve, 100));
    await waitUntil(() => spyFn.called);
    expect(el.selectIds).to.contain(data[0].id);
    el.$diagram.select([]);
    expect(el.selectIds).to.be.empty;
  });

  it('handles custom search fn', async () => {
    const search = sinon.spy(async () => data);
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        search
        style="width:300px;height:300px"
        .onSearch=${() => search()}
        @sc-rel-search-select=${(e: CustomEvent) => spyFn(e.type, e.detail.value)}
        @sc-select=${(e: CustomEvent) => spyFn(e.type, e.detail.value)}
      ></sc-relationship>
    `);
    await el.updateComplete;

    el.handleSearchInput(
      new CustomEvent('sc-input', { detail: { value: data[0].name } })
    );
    await waitUntil(() => search.called);

    el.handleSearchSelect(
      new CustomEvent('sc-select', { detail: { value: 'no-match' } })
    );
    await waitUntil(() => spyFn.called);

    el.handleSearchSelect(
      new CustomEvent('sc-select', { detail: { value: data[0].id } })
    );
    await waitUntil(() => spyFn.called);

    expect(el.selectIds).to.contain(data[0].id);
    el.$diagram.select([]);
    expect(el.selectIds).to.be.empty;
  });

  it('handles depth', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        .depth=${1}
        .selection=${[data[0].id]}
        style="width:300px;height:300px"
        @sc-rel-depth=${(e: CustomEvent) => spyFn(e.type, e.detail)}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await el.$diagram.updateComplete;
    await el.$depthDropdown?.updateComplete;
    
    expect(el.$diagram.chart).to.exist;
    expect(el.$depthDropdown?.$diagram?.chart).to.exist;

    el.$diagram.select([el.$diagram.links[0].id], true);
    el.$depthDropdown?.handleChangeValue(new CustomEvent('sc-select', { detail: { value: 3 } }));

    await waitUntil(() => spyFn.called);
    expect(el.depth).to.equal(3);
  });
  
  it('handles export', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        export
        style="width:300px;height:300px"
        @sc-export=${(e: CustomEvent) => spyFn(e.type, e.detail)}
      ></sc-relationship>
    `);
    await el.updateComplete;

    el.handleExportClick();

    expect(el.$exportModal).to.exist;
    expect(el.$exportModal?.hasAttribute('open')).to.be.true;

    el.handleModalAction(
      new CustomEvent('sc-action', { detail: { type: 'primary' } })
    );
    await waitUntil(() => spyFn.called);
    
    expect(el.$exportModal?.hasAttribute('open')).to.be.false;
  });
  
  it('handles minimap', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        .config=${config}
        .selection=${[data[0].id, data[1].id]}
        minimap
        style="width:300px;height:300px"
        @sc-collapse=${(e: CustomEvent) => spyFn(e.type)}
        @sc-expand=${(e: CustomEvent) => spyFn(e.type)}
        @sc-zoom=${(e: CustomEvent) => spyFn(e.type)}
        @sc-pan=${(e: CustomEvent) => spyFn(e.type)}
        @fullscreenchange=${(e: Event) => spyFn(e.type)}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await el.$diagram.updateComplete;
    await el.$minimap?.updateComplete;

    expect(el.$minimap?.$diagram?.chart).to.exist;    

    el.$minimap?.zoomIn();
    await waitUntil(() => spyFn.calledWith('sc-zoom'));
    expect(spyFn.calledWith('sc-zoom')).to.be.true;

    el.$diagram.centerSelected();
    await waitUntil(() => spyFn.calledWith('sc-zoom'));
    expect(spyFn.calledWith('sc-zoom')).to.be.true;

    el.$minimap?.hide();
    await waitUntil(() => spyFn.calledWith('sc-collapse'));
    expect(spyFn.calledWith('sc-collapse')).to.be.true;

    el.$minimap?.handleRedraw();
    await new Promise(resolve => setTimeout(resolve, 100));

    el.$minimap?.zoomOut();
    await waitUntil(() => spyFn.calledWith('sc-zoom'));
    expect(spyFn.calledWith('sc-zoom')).to.be.true;
    
    el.$minimap?.show();
    await waitUntil(() => spyFn.calledWith('sc-expand'));
    expect(spyFn.calledWith('sc-expand')).to.be.true;

    let ev = new MouseEvent('mousedown', { clientX: 0, clientY: 0 });
    Object.assign(ev, { offsetX: 0, offsetY: 0 });
    el.$minimap?.handlePointerDown(ev);
    ev = new MouseEvent('mousemove', { clientX: 1, clientY: 1 });
    Object.assign(ev, { offsetX: 1, offsetY: 1 });
    el.$minimap?.handlePointerMove(ev);
    expect(spyFn.calledWith('sc-zoom')).to.be.true;

    Object.defineProperty(ev, 'target', {
      value: el.$minimap?.shadowRoot?.querySelector('.target'),
    });
    el.$minimap?.handlePointerDown(ev);

    el.$minimap?.handlePointerUp(new MouseEvent('mouseup'));

    el.$minimap?.handleWheel(new WheelEvent('wheel', { deltaY: -100 }));
    expect(spyFn.calledWith('sc-zoom')).to.be.true;
    el.$minimap?.handleWheel(new WheelEvent('wheel', { deltaY: 100 }));
    expect(spyFn.calledWith('sc-zoom')).to.be.true;

    el.$minimap?.zoomReset();
    await waitUntil(() => spyFn.calledWith('sc-zoom'));
    expect(spyFn.calledWith('sc-zoom')).to.be.true;
    expect(el.$diagram.isZoomed(1.0)).to.be.true;

    el.$minimap?.toggleFullscreen();
    await waitUntil(() => spyFn.calledWith('fullscreenchange'));
    expect(spyFn.calledWith('fullscreenchange')).to.be.true;
  });
  
  it('handles click', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        .config=${config}
        minimap
        style="width:300px;height:300px"
        @sc-select=${(e: CustomEvent) => spyFn(e.type)}
        @sc-hover=${(e: CustomEvent) => spyFn(e.type)}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await el.$diagram.updateComplete;

    const chartEvent: ChartEvent = {
      type: 'click',
      x: 0,
      y: 0,
      native: new MouseEvent('click'),
    };

    // select 1st
    el.$diagram.handleClick(
      chartEvent,
      [{ element: {} as any, datasetIndex: 0, index: 0 }]
    );
    await waitUntil(() => spyFn.calledWith('sc-select'));
    expect(el.selectIds).to.contain(data[0].id);

    // select more
    el.$diagram.handleClick(
      { ...chartEvent, native: new MouseEvent('click', { ctrlKey: true }) },
      [{ element: {} as any, datasetIndex: 0, index: 1 }]
    );
    expect(el.selectIds).to.have.lengthOf(2);
    expect(el.selectIds).to.contain(data[0].id);
    expect(el.selectIds).to.contain(data[1].id);

    // deselect 1st
    el.$diagram.handleClick(
      { ...chartEvent, native: new MouseEvent('click', { ctrlKey: true }) },
      [{ element: {} as any, datasetIndex: 0, index: 0 }]
    );
    await waitUntil(() => spyFn.calledWith('sc-select'));
    expect(el.selectIds).to.not.contain(data[0].id);
    expect(el.selectIds).to.contain(data[1].id);

    // doesn't work, need to mock
    el.$diagram.getIntersectingLink(0, 0);
    jest.spyOn(el.$diagram, 'getIntersectingLink').mockReturnValueOnce(el.$diagram.links[0]);

    // select link
    el.$diagram.handleClick(chartEvent, []);
    await waitUntil(() => spyFn.calledWith('sc-select'));
    expect(spyFn.calledWith('sc-select')).to.be.true;
    expect(el.selectIds).to.be.contain(el.$diagram.links[0].id);

    // deselect all
    el.$diagram.handleClick(chartEvent, []);
    await waitUntil(() => spyFn.calledWith('sc-select'));
    expect(el.selectIds).to.be.empty;
  });

  it('handles hover', async () => {
    const spyFn = sinon.spy();
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        .config=${config}
        minimap
        style="width:300px;height:300px"
        @sc-hover=${(e: CustomEvent) => spyFn(e.type)}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await el.$diagram.updateComplete;

    const chartEvent: ChartEvent = {
      type: 'mousemove',
      x: 0,
      y: 0,
      native: new MouseEvent('mousemove'),
    };

    // hover in
    el.$diagram.handleHover(chartEvent, [
      { element: {} as any, datasetIndex: 0, index: 0 },
    ]);
    await waitUntil(() => spyFn.calledWith('sc-hover'));
    expect(el.$diagram.hovered?.id).to.equal(data[0].id);
    expect(el.hovered?.id).to.equal(data[0].id);

    // hover out
    Object.assign(el.$diagram, { _animating: true });
    el.$diagram.handleHover(chartEvent, []);
    expect(el.$diagram.hovered, 'diagram hover should be undefined').to.be.undefined;
    expect(el.hovered, 'hover out must have delay').to.not.be.undefined;
    
    await waitUntil(() => spyFn.calledWith('sc-hover'));
    
    // hover over el
    el.handleHoverOver();
    expect(el.hovered, 'must keep hover').to.not.be.undefined;
    el.hideHover();
    expect(el.hovered).to.be.undefined;
  });
  
  it('handles hover function', async () => {
    const spyFn = sinon.spy((node: any) => html`<b>${node?.name}</b>`);
    const el = await fixture<ScRelationship>(html`
      <sc-relationship
        .data=${data}
        .config=${config}
        style="width:300px;height:300px"
        .hoverFn=${spyFn}
        @sc-hover=${(e: CustomEvent) => spyFn(e.type)}
      ></sc-relationship>
    `);
    await el.updateComplete;
    await el.$diagram.updateComplete;

    const chartEvent: ChartEvent = {
      type: 'mousemove',
      x: 0,
      y: 0,
      native: new MouseEvent('mousemove'),
    };

    el.$diagram.handleHover(chartEvent, [
      { element: {} as any, datasetIndex: 0, index: 0 },
    ]);
    await waitUntil(() => spyFn.calledWith(el.$data.nodes[0]));
    expect(el.$diagram.hovered?.id).to.equal(data[0].id);

    // deselect
    el.$diagram.handleHover(chartEvent, []);
    await waitUntil(() => spyFn.calledWith(el.$data.nodes[0]));
    expect(el.$diagram.hovered).to.be.undefined;
  });
  
});
