
Object.defineProperty(document, 'fullscreenEnabled', {
  value: true,
  writable: true,
});
Object.defineProperty(document, 'fullscreenElement', {
  value: null,
  writable: true,
});

Element.prototype.requestFullscreen = jest.fn().mockImplementation(function (this: Element) {
  Object.assign(document, { fullscreenElement: this });
  this.dispatchEvent(new Event('fullscreenchange', { bubbles: true, composed: true }));
  return Promise.resolve();
});