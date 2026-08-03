import type { ReactiveController, ReactiveControllerHost } from 'lit';

/** A reactive controller that determines when slots exist. */
export class HasSlotController implements ReactiveController {
  host: ReactiveControllerHost & Element;
  slotNames: string[] = [];

  constructor(host: ReactiveControllerHost & Element, ...slotNames: string[]) {
    (this.host = host).addController(this);
    this.slotNames = slotNames;
  }

  private hasDefaultSlot() {
    return [...this.host.childNodes].some((node) => {
      if (node.nodeType === node.TEXT_NODE && node.textContent?.trim() !== '') {
        return true;
      }

      if (node.nodeType === node.ELEMENT_NODE) {
        const el = node as HTMLElement;

        // If it doesn't have a slot attribute, it's part of the default slot
        if (!el.hasAttribute('slot')) {
          return true;
        }
      }

      return false;
    });
  }

  private hasNamedSlot(name: string) {
    // match all passed slot for host(light) el (not SD).
    return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
  }

  test(slotName: string) {
    return slotName === '[default]' ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
  }

  hostConnected() {
    this.host.shadowRoot?.addEventListener('slotchange', this.handleSlotChange);
  }

  hostDisconnected() {
    this.host.shadowRoot?.removeEventListener('slotchange', this.handleSlotChange);
  }

  private handleSlotChange = (event: Event) => {
    const slot = event.target as HTMLSlotElement;

    if (
      (this.slotNames.includes('[default]') && !slot.name) ||
      (slot.name && this.slotNames.includes(slot.name))
    ) {
      this.host.requestUpdate();
    }
  };
}

/**
 * Given a slot, this function iterates over all of its assigned element and text nodes and returns the concatenated
 * HTML as a string. This is useful because we can't use slot.innerHTML as an alternative.
 */
export function getInnerHTML(slot: HTMLSlotElement): string {
  const nodes = slot.assignedNodes({ flatten: true });
  let html = '';

  [...nodes].forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      html += (node as HTMLElement).outerHTML;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      html += node.textContent;
    }
  });

  return html;
}

/**
 * Given a slot, this function iterates over all of its assigned text nodes and returns the concatenated text as a
 * string. This is useful because we can't use slot.textContent as an alternative.
 */
export function getTextContent(slot: HTMLSlotElement | undefined | null): string {
  if (!slot) {
    return '';
  }
  const nodes = slot.assignedNodes({ flatten: true });
  let text = '';

  const extractText = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach((childNode) => extractText(childNode));
    }
  };

  nodes.forEach((node) => extractText(node));

  return text;
}

/**
 * Given a host element and named slot, this function reads all light-dom nodes assigned to that slot and returns
 * concatenated text content. Supports forwarded slot elements by reading their assigned text as well.
 */
export function getNamedSlotTextContent(host: Element, slotName: string): string {
  const slotNodes = Array.from(host.querySelectorAll(`:scope > [slot="${slotName}"]`));

  return slotNodes
    .map((node) => {
      if (node instanceof HTMLSlotElement) {
        return getTextContent(node).trim();
      }
      return (node.textContent || '').trim();
    })
    .join('')
    .trim();
}
