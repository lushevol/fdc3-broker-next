export const litHtmlToString = (data: any, preserveTags?: string[]): string => {
  if (
    !data ||
    typeof data !== 'object' ||
    !('strings' in data && 'values' in data)
  ) {
    return '';
  }

  const { strings, values } = data;
  const v = [...values, ''];
  const reduced = strings.reduce((acc: string, s: string, i: number) => acc + s + v[i], '');

  if (preserveTags?.length) {
    const regex = new RegExp(`<(?!/?(?:${preserveTags.join('|')})(?:\\s[^>]*)?\\s*>)[^>]*>`, 'g');
    return reduced.replace(regex, '').trim();
  }

  return reduced.replace(/<[^>]+>/g, '').trim();
};

export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

