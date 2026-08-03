export const waitForEvent = <T = unknown>(
  element: HTMLElement,
  eventName: string
): Promise<CustomEvent<T>> =>
  new Promise(resolve => {
    const handler = (event: Event) => {
      element.removeEventListener(eventName, handler as EventListener);
      resolve(event as CustomEvent<T>);
    };
    element.addEventListener(eventName, handler as EventListener);
  });
