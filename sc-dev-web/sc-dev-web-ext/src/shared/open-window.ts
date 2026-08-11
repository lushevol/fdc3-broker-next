export const openNewWindow = (href: string) => {
  const aTag = document.createElement('a');
  aTag.rel = 'noopener';
  aTag.target = '_blank';
  aTag.href = href;
  aTag.click();
};