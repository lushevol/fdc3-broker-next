export const resizePosition = (
  triggerElement: HTMLElement | null, 
  element: HTMLElement | null | undefined, 
  margin?: number,
  type?: string,
  hoist?: boolean
) => {
  const _margin = margin || (hoist ? 8 : 16);  
  if (triggerElement && element) {
    const viewportHeight = window.innerHeight;
    const elementHeight = element.clientHeight;
    const top = triggerElement.getBoundingClientRect().top;
    const triggerElementHeight = triggerElement.clientHeight;
    const bottomHeight = triggerElementHeight + top + elementHeight;
    const remainingHeight = bottomHeight - viewportHeight;
    const remainingTopHeight = elementHeight > top ? elementHeight - top : 0;
    // Top and bottom reposition
    if (bottomHeight > viewportHeight && remainingHeight > remainingTopHeight) {
      if (hoist) {
        element.style.top = `${top - elementHeight - _margin}px`;
      } else {
        element.style.top = `${-elementHeight - triggerElementHeight - _margin  }px`;
      }
    } else {
      if (hoist) {
        element.style.top = `${top + triggerElementHeight + _margin}px`;
      } else {
        element.style.top = '0';
      }
    }
    // Left and right reposition
    const left = triggerElement.getBoundingClientRect().left;
    const right = triggerElement.getBoundingClientRect().right;
    const elementWidth = element.clientWidth;
    let viewportWidth = window.innerWidth;
    const bodyWidth = document.body.clientWidth;
    if (viewportWidth > bodyWidth) {
      viewportWidth = bodyWidth;
    }
    let remainingWidth = left + elementWidth - viewportWidth;
    // Align left when clicking on the left side
    if (type === 'start' && remainingWidth > 0) {
      remainingWidth = 0;
    }
    if (type === 'end') {
      remainingWidth = right - elementWidth;
      const wholeWidth = triggerElement.clientWidth * 2;
      let step = viewportWidth - right;
      if (wholeWidth + step < elementWidth) {
        if (!hoist && (right - wholeWidth + elementWidth > viewportWidth)) {
          step = elementWidth - wholeWidth - step;
        }
        element.style.right = `${step}px`;
        element.style.left = 'unset';
        return;
      } else {
        if (hoist) {
          element.style.left = `${right - wholeWidth}px`;
          element.style.right = 'unset';
        } else {
          element.style.right = '0';
        }
      }
      return;
    }
    if (remainingWidth > 0) {
      element.style.marginLeft = `-${remainingWidth + _margin}px`;
    } else {
      element.style.marginLeft = '0';
    }
  }
};