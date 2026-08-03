import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { type Driver, type DriveStep, type PopoverDOM, driver } from 'driver.js';
import '../../../elements/sc-button.js';
import '../../../elements/sc-dot-status.js';
import '../../../elements/sc-icon.js';
import '../../../elements/sc-link.js';
import '../../../elements/sc-paragraph.js';
import '../../../elements/sc-title.js';
import ScElement from '../../shared/sc-element.js';

export class ScTour extends ScElement {
  private static readonly popoverStyleId = 'sc-tour-popover-styles';
  private static readonly analyticsButtonEvent = 'sc-webkit-comp-click';

  @property({ type: Array, attribute: 'steps' }) steps: DriveStep[] | string = [];

  @property({ type: Boolean, attribute: 'autostart' }) autostart = false;

  @property({ type: Boolean, attribute: 'show-progress' }) showProgress = false;

  @property({ type: Boolean, attribute: 'disable-close' }) disableClose = false;

  @property({ type: Boolean, attribute: 'disable-auto-animate' }) disableAutoAnimate = false;

  @property({ type: Boolean, attribute: 'smooth-scroll' }) smoothScroll = false;

  @property({ type: Number, attribute: 'overlay-opacity' }) overlayOpacity = 0.5;

  @property({ type: String, attribute: 'overlay-color' }) overlayColor = 'black';

  @property({ type: String, attribute: 'prev-btn-text' }) prevBtnText = 'Back';

  @property({ type: String, attribute: 'next-btn-text' }) nextBtnText = 'Next';

  @property({ type: String, attribute: 'done-btn-text' }) doneBtnText = 'Done';

  @property({ type: String, attribute: 'skip-btn-text' }) skipBtnText = 'Skip';

  @property({ type: Array, attribute: 'show-buttons' }) showButtons = ['previous', 'next', 'skip'];

  @property({ type: Boolean, attribute: 'enable-reminder' }) enableReminder = false;


  private driverInstance?: Driver;

  private popoverInstance: PopoverDOM | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.ensurePopoverStyles();
  }

  firstUpdated() {
    if (this.autostart) {
      this.start();
    }
  }

  private parseSteps(): DriveStep[] {
    if (!this.steps) {
      return [];
    }

    if (Array.isArray(this.steps)) {
      return this.normalizeSteps(this.steps);
    }

    if (typeof this.steps === 'string') {
      try {
        const parsed = JSON.parse(this.steps);
        const steps = Array.isArray(parsed) ? parsed : [];
        return this.normalizeSteps(steps);
      }
      catch (error) {
        // eslint-disable-next-line no-console
        console.warn('sc-tour: failed to parse steps JSON', error);
        return [];
      }
    }

    return [];
  }

  private normalizeSteps(steps: DriveStep[]): DriveStep[] {
    return steps.map(step => {
      if (!step?.element || typeof step.element !== 'string') {
        return step;
      }

      const resolved = this.querySelectorDeep(step.element);
      return resolved ? { ...step, element: resolved } : step;
    });
  }

  private querySelectorDeep(selector: string): Element | null {
    const searchRoots: Array<Document | ShadowRoot | Element> = [];

    // Walk up the full shadow root chain so that elements living in any
    // ancestor context (including the top-level document) can be targeted.
    // A single-level check fails when sc-tour is nested inside multiple
    // component shadow roots (e.g. sc-tour inside component-a's shadow root
    // which is itself rendered inside component-b's shadow root).
    let node: Node = this.getRootNode();
    while (node instanceof ShadowRoot) {
      searchRoots.push(node);
      node = node.host.getRootNode();
    }
    if (node instanceof Document) {
      searchRoots.push(node);
    }

    if (searchRoots.length === 0) {
      searchRoots.push(document);
    }

    for (const root of searchRoots) {
      const found = this.querySelectorDeepInRoot(root, selector);
      if (found) {
        return found;
      }
    }

    return null;
  }

  private querySelectorDeepInRoot(root: Document | ShadowRoot | Element, selector: string): Element | null {
    const direct = root.querySelector?.(selector);
    if (direct) {
      return direct;
    }

    const treeRoot = root instanceof Document ? root.documentElement : root;
    if (!treeRoot) {
      return null;
    }

    // Walk elements to traverse open shadow roots for deep queries.
    const walker = document.createTreeWalker(treeRoot, NodeFilter.SHOW_ELEMENT);
    let current = walker.currentNode as Element | null;

    while (current) {
      const shadowRoot = (current as Element).shadowRoot;
      if (shadowRoot) {
        const found = this.querySelectorDeepInRoot(shadowRoot, selector);
        if (found) {
          return found;
        }
      }
      current = walker.nextNode() as Element | null;
    }

    return null;
  }

  private getDriver(): Driver {
    if (this.driverInstance) {
      return this.driverInstance;
    }

    this.driverInstance = driver({
      steps: this.parseSteps(),
      animate: !this.disableAutoAnimate,
      overlayColor: this.overlayColor,
      overlayOpacity: this.overlayOpacity,
      overlayClickBehavior: () => {},
      smoothScroll: this.smoothScroll,
      allowClose: !this.disableClose,
      // @ts-ignore
      showButtons: this.showButtons.map(btn => btn === 'skip' ? 'close' : btn),
      showProgress: this.showProgress,
      onPopoverRender: (popover, opts) => {
        this.decoratePopover(popover, opts.state.activeStep ?? null);
        opts.state.activeStep?.popover?.onPopoverRender?.(popover, opts);
      },
      onHighlighted: () => {
        if (this.popoverInstance) {
          this.refreshPopoverLayout(this.popoverInstance);
        }
      },
    });

    return this.driverInstance;
  }

  start() {
    const tour = this.getDriver();
    tour.setSteps(this.parseSteps());
    tour.drive();
  }

  stop() {
    this.driverInstance?.destroy();
  }

  private decoratePopover = (popover: PopoverDOM, step: DriveStep | null) => {
    this.popoverInstance = popover;
    const container = document.createElement('div');
    container.classList.add('driver-popover-container');
    popover.wrapper.append(container);
    popover.wrapper.classList.add('sc-tour-layout-pending');
    this.wrapPopoverContent(popover, container);
    this.decorateTitle(popover);
    this.decorateDescription(popover);
    this.decorateButtons(popover, step);
    this.decorateProgress(popover);
  };

  private refreshPopoverLayout(popover: PopoverDOM) {
    const wrapper = (popover as { wrapper?: HTMLElement }).wrapper ?? null;
    if (!wrapper) {
      return;
    }

    const driverApi = this.driverInstance as { refresh?: () => void } | undefined;
    if (!driverApi?.refresh) {
      wrapper.classList.remove('sc-tour-layout-pending');
      return;
    }

    requestAnimationFrame(() => {
      driverApi.refresh?.();
      setTimeout(() => {
        this.decorateSideAccent(popover);
        wrapper.classList.remove('sc-tour-layout-pending');
      }, 0);
    });
  }

  private wrapPopoverContent(popover: PopoverDOM, container: HTMLElement) {
    const content = document.createElement('div');
    content.classList.add('sc-tour-popover-content');

    const nodes: Array<HTMLElement | null | undefined> = [
      popover.title,
      popover.description,
      (popover as { footer?: HTMLElement }).footer
        ?? popover.wrapper?.querySelector('.driver-popover-footer') as HTMLElement | null,
    ];

    nodes.forEach(node => {
      if (node && node.parentElement) {
        content.append(node);
      }
    });

    container.append(content);
  }

  private decorateTitle(popover: PopoverDOM) {
    const title = popover.title;
    if (!title) {
      return;
    }

    const text = title.textContent?.trim();
    if (!text) {
      title.innerHTML = '';
      return;
    }

    let scTitle = title.querySelector('sc-title');
    if (!scTitle) {
      title.innerHTML = '';
      scTitle = document.createElement('sc-title');
      scTitle.setAttribute('level', '5');
      title.append(scTitle);
    }

    scTitle.textContent = text;
  }

  private decorateDescription(popover: PopoverDOM) {
    const description = popover.description;
    if (!description) {
      return;
    }

    const rawHtml = description.innerHTML.trim();
    const text = description.textContent?.trim() ?? '';
    if (!rawHtml && !text) {
      description.innerHTML = '';
      return;
    }

    let paragraph = description.querySelector('sc-paragraph');
    if (!paragraph) {
      description.innerHTML = '';
      paragraph = document.createElement('sc-paragraph');
      paragraph.setAttribute('size', 'md');
      paragraph.setAttribute('ellipsis', '');
      paragraph.setAttribute('rows', '3');
      description.append(paragraph);
    }

    if (rawHtml) {
      paragraph.innerHTML = rawHtml;
    } else {
      paragraph.textContent = text;
    }
  }

  private decorateButtons(popover: PopoverDOM, step: DriveStep | null) {
    const popoverConfig = step?.popover as { prevBtnText?: string; nextBtnText?: string } | undefined;
    const prevLabel = popoverConfig?.prevBtnText ?? this.prevBtnText;
    const nextBaseLabel = popoverConfig?.nextBtnText ?? this.nextBtnText;
    const nextLabel = popover.nextButton?.textContent?.trim().toLowerCase() === 'done'
      ? this.doneBtnText
      : nextBaseLabel;
    this.replaceButtonWithScButton(popover.previousButton, 'previous', {
      type: 'secondary',
      text: prevLabel,
      size: 'sm',
    }, step);
    this.replaceButtonWithScButton(popover.nextButton, 'next', {
      type: 'primary',
      text: nextLabel,
      size: 'sm',
    }, step);

    // Add Remind Me Later button after Next button, except on last step and only if enableReminder is true
    const navContainer = this.getNavigationContainer(popover);
    let isLastStep = false;
    const progressText = (popover as { progressText?: HTMLElement }).progressText || (this.getPopoverFooter(popover)?.querySelector('.driver-popover-progress-text') as HTMLElement | null);
    if (progressText) {
      const match = progressText.textContent?.trim().match(/(\d+)\s*(?:\/|of)\s*(\d+)/i);
      if (match) {
        const current = Number.parseInt(match[1], 10);
        const total = Number.parseInt(match[2], 10);
        if (Number.isFinite(current) && Number.isFinite(total) && total > 0 && current === total) {
          isLastStep = true;
        }
      }
    }
    const footer = this.getPopoverFooter(popover);
    let footerLeft = footer?.querySelector('.sc-tour-footer-left') as HTMLElement | null;
    if (this.enableReminder && !isLastStep) {
      if (!footerLeft && footer) {
        footerLeft = document.createElement('div');
        footerLeft.classList.add('sc-tour-footer-left');
        footer.prepend(footerLeft);
      }
      if (footerLeft) {
        let remindBtn = footerLeft.querySelector('sc-link[data-sc-tour-button="remind-me-later"]') as HTMLElement | null;
        if (!remindBtn) {
          remindBtn = document.createElement('sc-link');
          remindBtn.setAttribute('data-sc-tour-button', 'remind-me-later');
          footerLeft.prepend(remindBtn);
        }
        remindBtn.textContent = 'Remind me later';
        remindBtn.onclick = () => {
          this.publishButtonClick('remind-me-later', 'Remind me later', step);
          this.emit('sc-action', {
            detail: { action: 'remind-me-later', button: 'remind-me-later', text: 'Remind me later', element: this.getStepElementInfo(step) },
          });
          this.stop();
        };
        remindBtn.style.display = '';
      }
    } else if (footer) {
      const remindBtn = footer.querySelector('sc-link[data-sc-tour-button="remind-me-later"]') as HTMLElement | null;
      if (remindBtn) remindBtn.style.display = 'none';
    }
    this.replaceCloseWithSkip(popover, step);
  }

  private publishButtonClick = (kind: string, label: string, step: DriveStep | null = null) => {
    const elementInfo = this.getStepElementInfo(step);
    this._analytics?.publishEvent(ScTour.analyticsButtonEvent, {
      name: 'sc-tour',
      button: kind,
      text: label,
      element: elementInfo,
    });
    this.emit('sc-action', {
      detail: { action: 'button-click', button: kind, text: label, element: elementInfo },
    });
  };

  private getStepElementInfo(step: DriveStep | null): {
    selector: string | null;
    tagName: string | null;
    id: string | null;
    className: string | null;
  } {
    const rawElement = step?.element;
    if (!rawElement) {
      return {
        selector: null,
        tagName: null,
        id: null,
        className: null,
      };
    }

    if (typeof rawElement === 'string') {
      return {
        selector: rawElement,
        tagName: null,
        id: null,
        className: null,
      };
    }

    const element = rawElement as Element;
    return {
      selector: null,
      tagName: element.tagName?.toLowerCase() ?? null,
      id: element.id || null,
      className: element.className || null,
    };
  }

  private replaceButtonWithScButton(
    button: HTMLButtonElement | null,
    kind: string,
    options: { type?: string; size?: string; text?: string } = {},
    step: DriveStep | null = null,
  ) {
    if (!button || !button.parentElement) {
      return;
    }

    const parent = button.parentElement;
    parent.classList.add('sc-tour-buttons');

    let scButton: HTMLElement | null = parent.querySelector(`sc-button[data-sc-tour-button="${kind}"]`);
    if (!scButton) {
      scButton = document.createElement('sc-button');
      scButton.setAttribute('data-sc-tour-button', kind);
      parent.insertBefore(scButton, button);
    }

    scButton.onclick = () => {
      const label = scButton?.textContent?.trim() || '';
      this.publishButtonClick(kind, label, step);
      button.click();
    };

    scButton.removeAttribute('icon-button');
    scButton.removeAttribute('aria-label');
    if (options.type) {
      scButton.setAttribute('type', options.type);
    }
    if (options.size) {
      scButton.setAttribute('size', options.size);
    }
    if (options.text) {
      scButton.textContent = options.text;
    } else {
      scButton.textContent = button.textContent?.trim() || '';
    }

    scButton.toggleAttribute('disabled', button.disabled);
    if (kind === 'previous') {
      scButton.style.display = button.disabled ? 'none' : '';
    }
    button.style.display = 'none';
  }

  private replaceCloseWithSkip(popover: PopoverDOM, step: DriveStep | null = null) {
    const closeButton = popover.closeButton;
    if (!closeButton) {
      return;
    }

    // Hide skip button if on last step
    let isLastStep = false;
    const progressText = (popover as { progressText?: HTMLElement }).progressText || (this.getPopoverFooter(popover)?.querySelector('.driver-popover-progress-text') as HTMLElement | null);
    if (progressText) {
      const match = progressText.textContent?.trim().match(/(\d+)\s*(?:\/|of)\s*(\d+)/i);
      if (match) {
        const current = Number.parseInt(match[1], 10);
        const total = Number.parseInt(match[2], 10);
        if (Number.isFinite(current) && Number.isFinite(total) && total > 0 && current === total) {
          isLastStep = true;
        }
      }
    }

    if (!this.showButtons.includes('skip') || isLastStep) {
      closeButton.style.display = 'none';
      // Also hide custom skip button if present
      const navContainer = this.getNavigationContainer(popover);
      if (navContainer) {
        const skipButton: HTMLElement | null = navContainer.querySelector('sc-link[data-sc-tour-button="close"]');
        if (skipButton) skipButton.style.display = 'none';
      }
      return;
    }

    const navContainer = this.getNavigationContainer(popover);
    if (!navContainer) {
      closeButton.style.display = 'none';
      return;
    }

    navContainer.classList.add('sc-tour-buttons');
    let skipButton: HTMLElement | null = navContainer.querySelector('sc-link[data-sc-tour-button="close"]');
    if (!skipButton) {
      skipButton = document.createElement('sc-link');
      skipButton.setAttribute('data-sc-tour-button', 'close');
      navContainer.prepend(skipButton);
    }

    skipButton.onclick = () => {
      const label = skipButton?.textContent?.trim() || '';
      this.publishButtonClick('close', label, step);
      closeButton.click();
    };

    skipButton.textContent = this.skipBtnText || 'Skip';
    skipButton.toggleAttribute('disabled', closeButton.disabled);
    skipButton.style.display = '';
    closeButton.style.display = 'none';
  }

  private decorateProgress(popover: PopoverDOM) {
    const footer = this.getPopoverFooter(popover);
    if (!footer) {
      return;
    }

    const progressText =
      (popover as { progressText?: HTMLElement }).progressText
      ?? (footer.querySelector('.driver-popover-progress-text') as HTMLElement | null);

    const progressValue = progressText?.textContent?.trim();
    if (!progressValue) {
      return;
    }

    const match = progressValue.match(/(\d+)\s*(?:\/|of)\s*(\d+)/i);
    if (!match) {
      return;
    }

    const current = Number.parseInt(match[1], 10);
    const total = Number.parseInt(match[2], 10);
    if (!Number.isFinite(current) || !Number.isFinite(total) || total <= 0) {
      return;
    }

    let dots = footer.querySelector('.sc-tour-progress');
    if (!dots) {
      dots = document.createElement('div');
      dots.classList.add('sc-tour-progress');
      footer.append(dots);
    }

    dots.innerHTML = '';
    for (let i = 1; i <= total; i += 1) {
      const dot = document.createElement('sc-dot-status');
      dot.setAttribute('mode', 'default');
      dot.setAttribute('size', 'sm');
      dot.setAttribute('type', i === current ? 'info' : 'neutral');
      dot.setAttribute('compact', '');
      dot.setAttribute('inline', 'true');
      dots.append(dot);
    }

    if (progressText) {
      progressText.style.display = 'none';
    }
  }

  private decorateSideAccent(popover: PopoverDOM) {
    const container =
      (popover as { popover?: HTMLElement }).popover
      ?? (popover as { wrapper?: HTMLElement }).wrapper?.querySelector('.driver-popover-container') as HTMLElement | null
      ?? null;

    if (!container) {
      return;
    }

    let side = container.querySelector('.sc-tour-side');
    if (!side) {
      side = document.createElement('div');
      side.classList.add('sc-tour-side');

      const iconWrap = document.createElement('div');
      iconWrap.classList.add('sc-tour-side-icon');

      const icon = document.createElement('sc-icon');
      icon.setAttribute('name', 'compass--line');
      icon.setAttribute('size', 'md');
      iconWrap.append(icon);

      side.append(iconWrap);
      container.append(side);
    }

    requestAnimationFrame(() => this.updateSidePosition(popover, side as HTMLElement));
  }

  private updateSidePosition(popover: PopoverDOM, side: HTMLElement) {
    const wrapper = (popover as { wrapper?: HTMLElement }).wrapper ?? null;
    if (!wrapper) {
      return;
    }

    const arrow = wrapper.querySelector('.driver-popover-arrow') as HTMLElement | null;
    if (!arrow) {
      return;
    }

    const arrowRect = arrow.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const arrowCenter = arrowRect.left + (arrowRect.width / 2);
    const wrapperCenter = wrapperRect.left + (wrapperRect.width / 2);
    const isArrowRight = arrowCenter > wrapperCenter;

    side.classList.toggle('sc-tour-side-left', isArrowRight);
  }

  private getNavigationContainer(popover: PopoverDOM): HTMLElement | null {
    const nextParent = popover.nextButton?.parentElement ?? null;
    if (nextParent) {
      return nextParent;
    }

    return popover.previousButton?.parentElement ?? null;
  }

  private getPopoverFooter(popover: PopoverDOM): HTMLElement | null {
    const footer = (popover as { footer?: HTMLElement }).footer ?? null;
    if (footer) {
      return footer;
    }

    return (popover as { wrapper?: HTMLElement }).wrapper?.querySelector('.driver-popover-footer') ?? null;
  }

  private ensurePopoverStyles() {
    if (document.getElementById(ScTour.popoverStyleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = ScTour.popoverStyleId;
    style.textContent = `
      .driver-popover {
        border-radius: 0.5rem;
        box-shadow: 0 0.5rem 1rem 0 rgba(153, 153, 153, 0.20);
        background: var(--sc-color-white);
        box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.12);
        padding: 0;
        max-width: 33rem;
      }

      .driver-popover * {
        font-family: var(--sc-font-family, inherit);
      }

      .sc-tour-layout-pending {
        visibility: hidden;
      }

      .driver-popover-title sc-title {
        margin: 0;
      }

      .driver-popover-description sc-paragraph {
        margin: 0;
        color: var(--sc-color-grey-700);
      }

      .driver-popover-footer {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 0.75rem;
        gap: 0.75rem;
      }

      .driver-popover-footer .sc-tour-buttons {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-left: auto;
      }

      .driver-popover-close-btn {
        display: none !important;
      }

      .sc-tour-footer-left {
        display: flex;
        align-items: center;
      }

      .sc-tour-progress {
        display: inline-flex;
        align-items: center;
        width: 100%;
        order: 1;
      }

      .driver-popover-container {
        display: flex;
      }

      .sc-tour-popover-content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1rem;
      }

      .sc-tour-side {
        width: 2.5rem;
        border-radius: 0 0.5rem 0.5rem 0;
        background: var(--sc-color-blue-500);
        display: flex;
        justify-content: center;
        padding-top: 0.75rem;
      }

      .sc-tour-side.sc-tour-side-left {
        order: -1;
        border-radius: 0.5rem 0 0 0.5rem;
      }

      .sc-tour-side-icon {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 62.4375rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .sc-tour-side-icon sc-icon {
        color: var(--sc-color-white);
      }
    `;

    document.head.append(style);
  }

  render() {
    return html`<slot></slot>`;
  }
}
