export function defineElement(
  name: string,
  elementClass: CustomElementConstructor,
): void {
  if (!window.customElements.get(name)) {
    window.customElements.define(name, elementClass);
  }
}
