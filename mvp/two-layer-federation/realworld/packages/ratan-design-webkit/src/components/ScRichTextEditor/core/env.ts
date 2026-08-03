const userAgent = navigator.userAgent;

const isEdge = /Edge\/\d+/.test(userAgent);
const isSupportExec = !!(document.execCommand || 'execCommand' in document);

export default {
  isMac: navigator.appVersion.indexOf('Mac') > -1,
  isEdge,
  isSupportExec,
  isWebkit: !isEdge && /webkit/i.test(userAgent),
  isChrome: !isEdge && /chrome/i.test(userAgent),
  isSafari: !isEdge && /safari/i.test(userAgent) && (!/chrome/i.test(userAgent)),
  isW3CRangeSupport: !!document.createRange,
};
