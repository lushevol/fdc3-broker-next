export const customElement =
  (tagName: string): ClassDecorator =>
  elementClass => {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(
        tagName,
        elementClass as unknown as CustomElementConstructor,
      );
    }
  };
