  import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ScTour } from '../../../src/components/ScTour/ScTour.js';
import '../../../elements/sc-tour.js';
it('shows Remind me later button only when enableReminder is true and not last step', async () => {
    const el = await fixture<ScTour>(html`<sc-tour enable-reminder></sc-tour>`);
    // Simulate popover and nav container
    const navContainer = document.createElement('div');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const closeButton = document.createElement('button');
    navContainer.append(prevButton, nextButton);
    // Not last step
    const footer = document.createElement('div');
    const progressText = document.createElement('div');
    progressText.className = 'driver-popover-progress-text';
    progressText.textContent = '1 / 3';
    footer.append(progressText);
    const popover = { previousButton: prevButton, nextButton, closeButton, wrapper: document.createElement('div'), progressText } as any;
    (el as any).getNavigationContainer = () => navContainer;
    (el as any).getPopoverFooter = () => footer;
    (el as any).decorateButtons(popover, null);
    const remindBtn: HTMLElement | null = footer.querySelector('sc-link[data-sc-tour-button="remind-me-later"]');
    expect(remindBtn).to.exist;
    expect(remindBtn?.style.display).to.not.equal('none');

    // Simulate last step
    progressText.textContent = '3 / 3';
    (el as any).decorateButtons(popover, null);
    expect(remindBtn?.style.display).to.equal('none');
  });

  it('does not show Remind me later button when enableReminder is false', async () => {
    const el = await fixture<ScTour>(html`<sc-tour></sc-tour>`);
    const navContainer = document.createElement('div');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const closeButton = document.createElement('button');
    navContainer.append(prevButton, nextButton);
    const progressText = document.createElement('div');
    progressText.className = 'driver-popover-progress-text';
    progressText.textContent = '1 / 3';
    const popover = { previousButton: prevButton, nextButton, closeButton, wrapper: document.createElement('div'), progressText } as any;
    (el as any).getNavigationContainer = () => navContainer;
    (el as any).getPopoverFooter = () => ({ querySelector: () => progressText });
    (el as any).decorateButtons(popover, null);
    const remindBtn = navContainer.querySelector('sc-button[data-sc-tour-button="remind-me-later"]');
    expect(remindBtn).to.not.exist;
  });

  it('Remind me later button emits event and stops tour', async () => {
    const el = await fixture<ScTour>(html`<sc-tour enable-reminder></sc-tour>`);
    const navContainer = document.createElement('div');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const closeButton = document.createElement('button');
    navContainer.append(prevButton, nextButton);
    const progressText = document.createElement('div');
    progressText.className = 'driver-popover-progress-text';
    progressText.textContent = '1 / 3';
    const popover = { previousButton: prevButton, nextButton, closeButton, wrapper: document.createElement('div'), progressText } as any;
    const footer = document.createElement('div');
    const progressFooterText = document.createElement('div');
    progressFooterText.className = 'driver-popover-progress-text';
    progressFooterText.textContent = '1 / 3';
    footer.append(progressFooterText);
    (el as any).getNavigationContainer = () => navContainer;
    (el as any).getPopoverFooter = () => footer;
    let stopped = false;
    (el as any).stop = () => { stopped = true; };
    let eventDetail: any = null;
    el.addEventListener('sc-action', (e: any) => { eventDetail = e.detail; });
    (el as any).decorateButtons(popover, null);
    const remindBtn: HTMLElement | null = footer.querySelector('sc-link[data-sc-tour-button="remind-me-later"]');
    expect(remindBtn).to.exist;
    remindBtn?.click();
    expect(stopped).to.equal(true);
    expect(eventDetail).to.include({ action: 'remind-me-later', button: 'remind-me-later', text: 'Remind me later' });
  });

describe('ScTour', () => {
  it('renders default tour', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);

    expect(el.autostart).to.equal(false);
  });

  it('renders auto start tour', async () => {
    const steps = [
        { element: 'body',popover: { title: 'Shadow root',description: 'This target is inside a shadow root.' } },
      ];
    const el = await fixture<ScTour>(html` <sc-tour autostart .steps=${steps}></sc-tour>`);

    expect(el.autostart).to.equal(true);
  });

  it('hides previous button when disabled', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);

    const navContainer = document.createElement('div');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const closeButton = document.createElement('button');

    prevButton.disabled = true;
    navContainer.append(prevButton, nextButton);

    (el as any).decorateButtons({
      previousButton: prevButton,
      nextButton,
      closeButton,
      wrapper: document.createElement('div'),
    }, null);

    const previousScButton = navContainer.querySelector('sc-button[data-sc-tour-button="previous"]') as HTMLElement;
    expect(previousScButton).to.exist;
    expect(previousScButton.style.display).to.equal('none');

    prevButton.disabled = false;
    (el as any).decorateButtons({
      previousButton: prevButton,
      nextButton,
      closeButton,
      wrapper: document.createElement('div'),
    }, null);

    expect(previousScButton.style.display).to.equal('');
  });

  it('refreshPopoverLayout refreshes and clears pending class', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);

    const wrapper = document.createElement('div');
    wrapper.classList.add('sc-tour-layout-pending');
    const container = document.createElement('div');
    container.classList.add('driver-popover-container');
    wrapper.append(container);

    const popover = { wrapper } as any;
    let refreshed = false;
    (el as any).driverInstance = { refresh: () => { refreshed = true; } };

    (el as any).refreshPopoverLayout(popover);
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(refreshed).to.equal(true);
    const res = (el as any).refreshPopoverLayout({});
    expect(res).to.equal(undefined);
    (el as any).driverInstance = {};
    const res2 = (el as any).refreshPopoverLayout(popover);
    expect(res2).to.equal(undefined);
  });

  it('onHighlighted triggers refreshPopoverLayout', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    const popover = { wrapper: document.createElement('div') } as any;
    (el as any).popoverInstance = popover;

    const originalRefresh = (el as any).refreshPopoverLayout;
    let called = false;
    (el as any).refreshPopoverLayout = () => {
      called = true;
    };

    const driverInstance = (el as any).getDriver();
    const config = driverInstance.getConfig();
    config.onHighlighted?.();

    expect(called).to.equal(true);
    (el as any).refreshPopoverLayout = originalRefresh;
  });

  it('parses steps from JSON string and resolves selector', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    const target = document.createElement('div');
    target.id = 'tour-target';
    document.body.append(target);

    el.steps = JSON.stringify([{ element: '#tour-target' }]);
    const parsed = (el as any).parseSteps();

    expect(parsed).to.have.length(1);
    expect(parsed[0].element).to.equal(target);

    document.body.removeChild(target);
  });

  it('returns empty steps when JSON parse fails', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    const warnStub = window.console.warn;
    let warned = false;
    window.console.warn = () => { warned = true; };

    el.steps = '{invalid json';
    const parsed = (el as any).parseSteps();

    expect(parsed).to.deep.equal([]);
    expect(warned).to.equal(true);

    window.console.warn = warnStub;
  });

  it('decorates title and description nodes', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);

    const title = document.createElement('div');
    title.textContent = 'Welcome';
    const description = document.createElement('div');
    description.textContent = 'Intro text';

    (el as any).decorateTitle({ title } as any);
    (el as any).decorateDescription({ description } as any);

    expect(title.querySelector('sc-title')?.textContent).to.equal('Welcome');
    expect(description.querySelector('sc-paragraph')?.textContent).to.equal('Intro text');
  });

  it('preserves HTML when decorating description', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    const description = document.createElement('div');
    description.innerHTML = '<strong>Bold</strong> copy';

    (el as any).decorateDescription({ description } as any);

    const paragraph = description.querySelector('sc-paragraph') as HTMLElement | null;
    expect(paragraph).to.exist;
    expect(paragraph?.innerHTML).to.equal('<strong>Bold</strong> copy');
  });

  it('replaceCloseWithSkip hides close button when skip is disabled', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    el.showButtons = ['previous', 'next'];

    const closeButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const navContainer = document.createElement('div');
    navContainer.append(nextButton);
    const popover = { closeButton, nextButton } as any;

    (el as any).replaceCloseWithSkip(popover);
    expect(closeButton.style.display).to.equal('none');
  });

  it('replaceCloseWithSkip creates skip button when enabled', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    el.showButtons = ['skip'];

    const closeButton = document.createElement('button');
    const nextButton = document.createElement('button');
    const navContainer = document.createElement('div');
    navContainer.append(nextButton);
    const popover = { closeButton, nextButton } as any;

    (el as any).replaceCloseWithSkip(popover);
    const skipButton = navContainer.querySelector('sc-link[data-sc-tour-button="close"]') as HTMLElement;

    expect(skipButton).to.exist;
    expect(skipButton.textContent).to.equal('Skip');
    expect(closeButton.style.display).to.equal('none');
  });

  it('decorateProgress renders dots and hides text', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    const footer = document.createElement('div');
    const progressText = document.createElement('div');
    progressText.classList.add('driver-popover-progress-text');
    progressText.textContent = '1 / 3';
    footer.append(progressText);

    (el as any).decorateProgress({ footer } as any);

    const dots = footer.querySelectorAll('sc-dot-status');
    expect(dots.length).to.equal(3);
    expect(progressText.style.display).to.equal('none');
  });

  it('updateSidePosition toggles side based on arrow position', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    const wrapper = document.createElement('div');
    const arrow = document.createElement('div');
    arrow.classList.add('driver-popover-arrow');
    wrapper.append(arrow);
    const side = document.createElement('div');

    (arrow as any).getBoundingClientRect = () => ({ left: 120, width: 10 });
    (wrapper as any).getBoundingClientRect = () => ({ left: 0, width: 100 });

    (el as any).updateSidePosition({ wrapper } as any, side);
    expect(side.classList.contains('sc-tour-side-left')).to.equal(true);
    const res = (el as any).updateSidePosition({}, side);
    expect(res).to.equal(undefined);
  });

  it('ensurePopoverStyles only injects style once', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    const existing = document.getElementById('sc-tour-popover-styles');
    if (existing?.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    (el as any).ensurePopoverStyles();
    (el as any).ensurePopoverStyles();

    const styles = document.querySelectorAll('#sc-tour-popover-styles');
    expect(styles.length).to.equal(1);
  });

  it('publishButtonClick sends analytics event', async () => {
    const el = await fixture<ScTour>(html` <sc-tour></sc-tour>`);
    let eventName = '';
    let eventPayload: any;

    (el as any)._analytics = {
      publishEvent: (name: string, payload: object) => {
        eventName = name;
        eventPayload = payload;
      },
    };

    (el as any).publishButtonClick('next', 'Continue');

    expect(eventName).to.equal('sc-webkit-comp-click');
    expect(eventPayload.name).to.deep.equal('sc-tour');
  });

  // ── querySelectorDeep: multi-level shadow root traversal ──────────────────
  //
  // Before the fix, querySelectorDeep only checked one level up and only added
  // the document to its search roots when the immediate host's root was the
  // document itself. This made it impossible to target elements that live in
  // an ancestor shadow root when sc-tour is nested more than one level deep.
  //
  // The fix walks the full shadow root chain upward (ShadowRoot → host.getRootNode()
  // → … → Document) so every ancestor context is searched.
  //
  // DOM structure used by the multi-level tests:
  //
  //   document
  //   └── container (plain div, added/removed per test)
  //       └── l1Host                          ← in document light DOM
  //           └── #shadow-root  (level 1)
  //               ├── l1Target  #chain-l1
  //               └── l2Host
  //                   └── #shadow-root  (level 2)
  //                       ├── l2Target  #chain-l2
  //                       └── l3Host
  //                           └── #shadow-root  (level 3)
  //                               ├── l3Target  #chain-l3
  //                               └── <sc-tour>  ← deepest level
  describe('querySelectorDeep — multi-level shadow root traversal', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.append(container);
    });

    afterEach(() => {
      container.parentNode?.removeChild(container);
    });

    function buildChain() {
      const l1Host = document.createElement('div');
      container.append(l1Host);
      const l1Root = l1Host.attachShadow({ mode: 'open' });

      const l1Target = document.createElement('div');
      l1Target.id = 'chain-l1';
      l1Root.append(l1Target);

      const l2Host = document.createElement('div');
      l1Root.append(l2Host);
      const l2Root = l2Host.attachShadow({ mode: 'open' });

      const l2Target = document.createElement('div');
      l2Target.id = 'chain-l2';
      l2Root.append(l2Target);

      const l3Host = document.createElement('div');
      l2Root.append(l3Host);
      const l3Root = l3Host.attachShadow({ mode: 'open' });

      const l3Target = document.createElement('div');
      l3Target.id = 'chain-l3';
      l3Root.append(l3Target);

      const tour = document.createElement('sc-tour') as ScTour;
      l3Root.append(tour);

      return { tour, l1Host, l1Target, l2Target, l3Target };
    }

    it('finds an element in the document from inside a single shadow root', async () => {
      const docTarget = document.createElement('div');
      docTarget.id = 'chain-doc-single';
      container.append(docTarget);

      const host = document.createElement('div');
      container.append(host);
      const shadow = host.attachShadow({ mode: 'open' });
      const tour = document.createElement('sc-tour') as ScTour;
      shadow.append(tour);
      await tour.updateComplete;

      expect((tour as any).querySelectorDeep('#chain-doc-single')).to.equal(docTarget);
    });

    it('finds the enclosing host element in the document light DOM when sc-tour is 3 levels deep', async () => {
      const { tour, l1Host } = buildChain();
      l1Host.setAttribute('data-chain-host', 'l1');
      await tour.updateComplete;

      // l1Host lives in the document; sc-tour is three shadow root levels below it.
      // This was the primary case broken before the fix.
      expect((tour as any).querySelectorDeep('[data-chain-host="l1"]')).to.equal(l1Host);
    });

    it('finds an element in the level-1 shadow root from level-3 sc-tour', async () => {
      const { tour, l1Target } = buildChain();
      await tour.updateComplete;

      expect((tour as any).querySelectorDeep('#chain-l1')).to.equal(l1Target);
    });

    it('finds an element in the level-2 shadow root from level-3 sc-tour', async () => {
      const { tour, l2Target } = buildChain();
      await tour.updateComplete;

      expect((tour as any).querySelectorDeep('#chain-l2')).to.equal(l2Target);
    });

    it('finds an element in the same shadow root as sc-tour (level 3)', async () => {
      const { tour, l3Target } = buildChain();
      await tour.updateComplete;

      expect((tour as any).querySelectorDeep('#chain-l3')).to.equal(l3Target);
    });

    it('returns null when the selector matches nothing across the entire chain', async () => {
      const { tour } = buildChain();
      await tour.updateComplete;

      expect((tour as any).querySelectorDeep('#nonexistent-in-chain')).to.be.null;
    });

    it('normalizeSteps resolves element selectors that live outside the enclosing shadow root', async () => {
      const { tour, l1Target } = buildChain();
      await tour.updateComplete;

      // element is a string selector pointing to l1Target, which is two shadow
      // root levels above sc-tour; normalizeSteps must resolve it to the actual Element.
      const steps = [{ element: '#chain-l1', popover: { title: 'L1 step', description: '' } }];
      const normalized = (tour as any).normalizeSteps(steps);

      expect(normalized[0].element).to.equal(l1Target);
    });
  });
});
