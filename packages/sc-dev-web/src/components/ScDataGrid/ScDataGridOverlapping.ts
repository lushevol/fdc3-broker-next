import { html } from 'lit';
import { queryAsync } from 'lit/decorators.js';
import '../../../elements/sc-dropdown-input.js';
import '../../../elements/sc-spinner.js';
import { PopupHandledMixin } from '../../mixins/popup-handled-mixin.js';
import { PopupMixin } from '../../mixins/popup-mixin.js';
import ScElement from '../../shared/sc-element.js';
import ScTheme from '../../styles/ScTheme.js';
import { StyleToolMixin } from './mixins/style-tool-mixin.js';
import style, { classNamePrefix } from './ScDataGridOverlapping.style.js';

type TLiftCycle = {
  beforeShow?: () => void;
  afterShow?: () => void;
  beforeHide?: () => void;
  afterHide?: () => void;
};

export class ScDataGridOverlapping extends StyleToolMixin(classNamePrefix)(
  PopupHandledMixin(PopupMixin(ScElement))
) {
  static styles = ScTheme.getStyles().concat([style]);

  hoistingComponentParent?: HTMLElement;

  hoistingComponent?: Element;

  placeholder?: Element;

  slotContents: Map<HTMLSlotElement, {
    contents: Node[];
    placeholders: Node[];
    children: Node[];
  }> = new Map();

  private beforeShow?: () => void;
  private afterShow?: () => void;
  private beforeHide?: () => void;
  private afterHide?: () => void;

  @queryAsync('.sc-data-grid-overlapping-root')
  root: Promise<HTMLDivElement>;

  setLifeCycle(props: TLiftCycle) {
    this.beforeShow = props.beforeShow;
    this.afterShow = props.afterShow;
    this.beforeHide = props.beforeHide;
    this.afterHide = props.afterHide;
  }

  setHoistingComponentParent(el: HTMLElement) {
    this.hoistingComponentParent = el;
  }

  setHostingComponent(hostComponent: HTMLElement) {
    if (hostComponent.parentElement) {
      this.hoistingComponent = hostComponent;
      this.setHoistingComponentParent(hostComponent.parentElement);
    }
  }

  override hidePopup() {
    if (
      this.hoistingComponentParent &&
      this.hoistingComponent &&
      this.placeholder
    ) {
      this.beforeHide?.();
      super.hidePopup();
      this.afterHide?.();
      Array.from(this.slotContents.entries()).forEach(
        ([slot, { contents, children, placeholders }]) => {
          placeholders.forEach((p, i) =>
            p.parentNode?.replaceChild(contents[i], p)
          );
          slot.replaceChildren(...children);
        }
      );
      this.placeholder.replaceWith(this.hoistingComponent);
      this.hoistingComponentParent = undefined;
      this.hoistingComponent = undefined;
      this.placeholder = undefined;
      this.beforeShow = undefined;
      this.afterShow = undefined;
      this.beforeHide = undefined;
      this.afterHide = undefined;
      this.slotContents.clear();
    }
  }

  override showPopup() {
    if (this.hoistingComponent && !this.placeholder) {
      this.hoistingComponent.querySelectorAll('slot')
        .forEach(slot => {
          const contents = slot.assignedNodes({ flatten: true });
          const placeholders = contents.map(n => this.cloneAndStripIds(n));
          const children = Array.from(slot.childNodes);
          this.slotContents.set(slot, { contents, placeholders, children });
        });
      this.placeholder = this.makePlaceholder(this.hoistingComponent);
      this.positionPopup(this.hoistingComponent);
      this.beforeShow?.();
      super.showPopup();
      this.afterShow?.();
      this.hoistingComponent.replaceWith(this.placeholder);
      this.root.then(root => {
        this.hoistingComponent && root.appendChild(this.hoistingComponent);
        Array.from(this.slotContents.entries()).forEach(
          ([slot, { contents, placeholders }]) => {
            contents.forEach((c, i) =>
              c.parentNode?.replaceChild(placeholders[i], c)
            );
            slot.replaceChildren(...contents);
          }
        );
      });
    }
  }

  /** @deprecated just use `showPopup()` */
  showAndMount() {
    this.showPopup();
  }
  /** @deprecated just use `hidePopup()` */
  hideAndUnmount() {
    this.hidePopup();
  }

  private cloneAndStripIds(node: Node): Node {
    const clone = node.cloneNode(true);
    if (node.nodeType === Node.ELEMENT_NODE && clone.nodeType === Node.ELEMENT_NODE) {
      this.stripIds(clone as Element);
    }
    return clone;
  }

  private stripIds(root: Element) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let current = root as Element | null;
    while (current) {
      if (current.hasAttribute('id')) {
        current.removeAttribute('id');
      }
      current = walker.nextNode() as Element | null;
    }
  }

  makePlaceholder(hoistingComponent: Element) {
    const rect = hoistingComponent.getBoundingClientRect();
    const placeholder = hoistingComponent.cloneNode(true) as HTMLElement;
    placeholder.style.setProperty('pointer-events', 'none');
    placeholder.style.setProperty('width', `${rect.width}px`);
    placeholder.style.setProperty('opacity', '0');
    placeholder.toggleAttribute('disabled', true);

    return placeholder;
  }

  positionPopup(hoistingComponent: Element) {
    const rect = hoistingComponent.getBoundingClientRect();
    const adjustedRect = new DOMRect(
      rect.x,
      rect.y - rect.height,
      rect.width,
      rect.height
    );

    this.setVirtualAnchor({
      getBoundingClientRect() {
        return adjustedRect;
      },
    });
  }

  connectedCallback(): void {
    super.connectedCallback();
    // for date picker
    this.addEventListener('sc-change', this.popupHandleStopPropagation);
    this.addEventListener('sc-select', this.popupHandleStopPropagation);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('sc-change', this.popupHandleStopPropagation);
    this.removeEventListener('sc-select', this.popupHandleStopPropagation);
  }

  render() {
    return html`
      <sl-popup placement="bottom" strategy="fixed" flip sync="both">
        <div class="${this.makeClassName('root')}"></div>
      </sl-popup>
    `;
  }
}
