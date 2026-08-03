
global.ResizeObserver = jest.fn().mockImplementation((callback: (entries: ResizeObserverEntry[])=>void) => ({
  observe: jest.fn().mockImplementation(async (element: HTMLElement) => {
    // Simulate a resize event immediately upon observing
    // if ('updateComplete' in element)
    //   await element.updateComplete;
    
    const x = element.offsetLeft,
      y = element.offsetTop,
      width = element.offsetWidth || parseFloat(element.style.width) || 1,
      height = element.offsetHeight || parseFloat(element.style.height) || 1;

    const entries: ResizeObserverEntry[] = [
      {
        target: element,
        contentRect: <DOMRectReadOnly>{
          x,
          y,
          width,
          height,
          left: x,
          top: y,
          right: x + width,
          bottom: y + height,
        },
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      },
    ];
    callback(entries);
  }),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));