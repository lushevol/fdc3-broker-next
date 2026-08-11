export type TConfig = {
  createElements: (size: number) => HTMLElement[];
  updateElement: (el: HTMLElement, index: number) => void;
  scrollTarget: HTMLElement;
  scrollContainer: HTMLElement;
  elementsContainer?: HTMLElement;
  reorderElements?: boolean;
  createCallback?: () => void;
};
