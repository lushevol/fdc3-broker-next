import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScStepper } from '../../src/components/ScStepper/ScStepper.js';
import { ScStep } from '../../src/components/ScStepper/ScStep.js';
import '../../elements/sc-stepper.js';
import '../../elements/sc-step.js';

describe('ScStepper', () => {
  it('renders stepper', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper>
        <sc-step><span slot="title">First</span></sc-step>
        <sc-step><span slot="title">Second</span></sc-step>
        <sc-step><span slot="title">Third</span></sc-step>
      </sc-stepper>
    `);
    await fixture<ScStepper>(html`
      <sc-stepper>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
      </sc-stepper>
    `);
    await fixture<ScStepper>(html` <sc-stepper
      direction="horizontal"
      title-position="top"
    >
      <sc-step status="finish" title="First" description="finish step"></sc-step>
      <sc-step active title="Second" description="active step"></sc-step>
      <sc-step disabled title="Third" description="disabled step"></sc-step>
    </sc-stepper>`);
    await fixture<ScStepper>(html` <sc-stepper
      direction="horizontal"
      mode="indicator"
    >
      <sc-step status="wait" title="First"></sc-step>
      <sc-step active title="Second"></sc-step>
      <sc-step active status="process" title="Third"></sc-step>
    </sc-stepper>`);
    await fixture<ScStepper>(html` <sc-stepper
      direction="vertical"
      mode="full"
      title-position="left"
    >
      <sc-step status="error" title="First" description="error step"></sc-step>
      <sc-step active title="Second" description="active step"></sc-step>
      <sc-step disabled title="Third" description="disabled step"></sc-step>
    </sc-stepper>`);
    await fixture<ScStepper>(html` <sc-stepper
      direction="vertical"
      title-position="right"
      mode="indicator"
    >
      <sc-step status="process" title="First" description="process step"></sc-step>
      <sc-step active title="Second" description="active step"></sc-step>
      <sc-step status="finish" title="Third" description="finish step"></sc-step>
    </sc-stepper>`);
    await fixture<ScStepper>(html` <sc-stepper
      direction="vertical"
      title-position="bottom"
      mode="indicator"
      compact
    >
      <sc-step status="process" title="First" description="process step"></sc-step>
      <sc-step disabled title="Second" description="disabled step"></sc-step>
      <sc-step status="finish" title="Third" description="finish step"></sc-step>
      <sc-step
        active
        status="error"
        last-finished
        title="Fourth"
        description="active step"
      ></sc-step>
    </sc-stepper>`);
    await fixture<ScStepper>(html` <sc-stepper
      direction="vertical"
      title-position="right"
      mode="indicator"
      compact
    >
      <sc-step status="process"
        hover
        title="First"
        description="process step"
      ></sc-step>
      <sc-step
        disabled
        title="Second"
        description="disabled step"
      ></sc-step>
      <sc-step
        status="wait"
        title="Third"
        description="wait step"
      ></sc-step>
      <sc-step
        active
        status="error"
        last-finished
        title="Fourth"
        description="error step"
      ></sc-step>
    </sc-stepper>`);

    el.titlePosition = 'bottom';
    el.compact = false;

    el.dispatchEvent(new MouseEvent('mouseover'));
    el.dispatchEvent(new MouseEvent('mouseout'));

    expect(el.direction).to.equal('horizontal');
  });

  it('test step status change', async () => {
    const el = await fixture<ScStep>(html`
        <sc-step title="First"></sc-step>
    `);

    el.status = 'finish';

    expect(el.status).to.equal('finish');
  });

  it('test stepper vertical direction change', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
      </sc-stepper>
    `);

    el.direction = 'vertical';

    expect(el.direction).to.equal('vertical');
  });

  it('test stepper horizontal direction change', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper title-position="top">
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
      </sc-stepper>
    `);

    el.direction = 'horizontal';

    expect(el.direction).to.equal('horizontal');
  });

  it('test stepper mode full change', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
      </sc-stepper>
    `);

    el.mode = 'indicator';

    expect(el.mode).to.equal('indicator');
  });

  it('test stepper title position vertical change', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper title-positon='right'>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
      </sc-stepper>
    `);

    el.titlePosition = 'bottom';

    expect(el.titlePosition).to.equal('bottom');
  });

  it('test stepper title position empty change', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper title-positon='right'>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
      </sc-stepper>
    `);

    el.setAttribute('title-position', '');
    expect(el.titlePosition).to.equal('');
  });

  it('test stepper compact change', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
      </sc-stepper>
    `);

    el.compact = true;

    expect(el.compact).to.equal(true);
  });

  it('tests expand and collapse initialization', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper direction='vertical' presence-numbers='1'>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
        <div class="expand-collapse display-none">
          <span>Show more</span>
          <sc-icon size='xxs' name='plus'></sc-icon>
        </div>
      </sc-stepper>
    `);

    el.initExpandCollapse();
    await el.updateComplete;
    expect(el.showExpandCollapse).to.equal(true);
  });

  it('tests expand and collapse click events', async () => {
    const el = await fixture<ScStepper>(html`
      <sc-stepper direction='vertical' presence-numbers='1'>
        <sc-step title="First"></sc-step>
        <sc-step title="Second"></sc-step>
        <sc-step title="Third"></sc-step>
        <div class="expand-collapse display-none">
          <span>Show more</span>
          <sc-icon size='xxs' name='plus'></sc-icon>
        </div>
      </sc-stepper>
    `);

    el.initExpandCollapse();
    await el.updateComplete;
    el.toggleExpandCollapse();
    expect(el.expanded).to.equal(true);

    el.toggleExpandCollapse();
    expect(el.expanded).to.equal(false);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ScStepper>(
      html`<sc-stepper direction="vertical"
        ><sc-step>test</sc-step></sc-stepper
      >`
    );

    await expect(el).shadowDom.to.be.accessible();
  });

  it('render slots', async () => {
    const el = await fixture<ScStepper>(
      html`<sc-stepper direction="vertical">
        <sc-step show-description><div slot=description>This is the description</div></sc-step>
        <sc-step show-time><div slot=time>This is the time slot</div></sc-step>
        <sc-step show-view><div slot=view-link>This is the view link slot</div></sc-step>
      </sc-stepper>`
    );
    expect(el.querySelector('sc-step')?.showDescription).to.equal(true);
    expect(el.querySelectorAll('sc-step')[1]?.showTime).to.equal(true);
    expect(!!el.querySelectorAll('sc-step')[2]?.shadowRoot?.querySelector('div[part=view]')).to.equal(true);
  });

  describe('responsive', () => {
    it('horizontal -> vertical', async () => {
      const el = await fixture<ScStepper>(
        html`<sc-stepper direction="horizontal" min-horizontal-response="vertical">
          <sc-step show-description><div slot=description>This is the description</div></sc-step>
          <sc-step show-time><div slot=time>This is the time slot</div></sc-step>
          <sc-step show-view><div slot=view-link>This is the view link slot</div></sc-step>
        </sc-stepper>`
      );
      (el as any)._handleResize([{ target: el, contentRect: { width: 200 } }]);
      await el.updateComplete;

      el.container.dispatchEvent(new Event('scrollend'));
      el.container.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 }));
      el.container.dispatchEvent(new MouseEvent('mouseup'));

      expect(el.minHorizontalResponse).to.equal('vertical');
      expect(el.effectiveDirection).to.equal('vertical');
      expect(el.container.className).to.contain('vertical');
    });


    it('horizontal scroll', async () => {
      const el = await fixture<ScStepper>(
        html`<sc-stepper direction="horizontal">
          <sc-step show-description><div slot=description>This is the description</div></sc-step>
          <sc-step show-time><div slot=time>This is the time slot</div></sc-step>
          <sc-step show-view><div slot=view-link>This is the view link slot</div></sc-step>
        </sc-stepper>`
      );
      const entries = [{ target: el, contentRect: { width: 200 } }];
      (el as any)._handleResize(entries);
      (el as any)._handleResize(entries); // call twice
      await el.updateComplete;

      expect(el.minHorizontalResponse).to.equal('scroll');
      expect(el.effectiveDirection).to.equal('horizontal');
      expect(el.container.className).to.contain('horizontal');

      // apply invalid, should be corrected
      el.minHorizontalResponse = 'somethingElse' as any;
      await el.updateComplete;

      expect(el.minHorizontalResponse).to.equal('scroll');
      el.container.scrollLeft = 0;
      el.container.dispatchEvent(new MouseEvent('mousedown', { clientX: 100 }));
      el.container.dispatchEvent(new MouseEvent('mousemove', { clientX: 50 }));
      el.container.dispatchEvent(new MouseEvent('mouseup'));
      
      expect(el.container.scrollLeft).to.equal(50);
    });
  });
});
