import { LitElement } from 'lit';

// const a = {
//   detail: {
//     value: '1',
//   },
// };
export default class ScElement extends LitElement {
  emit(name: string, options?: Record<string, any>): void {
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: false,
      composed: false,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);
    return event as any;
  }
}
