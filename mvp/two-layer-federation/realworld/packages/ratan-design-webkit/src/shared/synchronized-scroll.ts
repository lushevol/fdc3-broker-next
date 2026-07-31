export const synchronizedScroll = (
  elements: Element[],
  callback?: (scrollInfo: { top?: number; left?: number }) => void,
) => {
  const syncScroll = (scrolledEle: Element, ele: Element) => {
    const scrolledPercent =
      scrolledEle.scrollTop / (scrolledEle.scrollHeight - scrolledEle.clientHeight);
    const top =
      !isNaN(scrolledPercent) && ele.clientHeight && scrolledEle.clientHeight
        ? scrolledPercent * (ele.scrollHeight - ele.clientHeight)
        : undefined;

    const scrolledWidthPercent =
      scrolledEle.scrollLeft / (scrolledEle.scrollWidth - scrolledEle.clientWidth);
    const left =
      !isNaN(scrolledWidthPercent) && ele.clientWidth && scrolledEle.clientWidth
        ? scrolledWidthPercent * (ele.scrollWidth - ele.clientWidth)
        : undefined;

    callback?.({
      left,
      top,
    });

    ele.scrollTo?.({
      // @ts-ignore
      behavior: 'instant',
      top,
      left,
    });
  };

  let lockTarget: Element | undefined;
  const handleScroll = (e: Event) => {
    if (lockTarget) return;
    lockTarget = e.target as Element;
    elements.forEach((el) => el !== lockTarget && syncScroll(lockTarget as Element, el));
    window.requestAnimationFrame(() => (lockTarget = undefined));
  };

  elements.forEach((ele) => {
    ele.addEventListener('scroll', handleScroll);
  });

  return () => elements.forEach((el) => el.removeEventListener('scroll', handleScroll));
};
