export const docxTypes = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
export const pptxTypes = [
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];
export const excelTypes = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
export const pdfTypes = ['application/pdf'];
export const msgTypes = ['msg'];
export const imgTypes = [
  'image/png',
  'image/svg+xml',
  'image/jpg',
  'image/jpeg',
];
export const videoTypes = ['video/mp4', 'video/webm', 'webm'];
export const textTypes = [
  'text/plain',
  'text/css',
  'md',
  'toml',
  'yml',
  'yaml',
  'application/json',
  'go',
  'java',
  'py',
  'text/javascript',
  'text/html',
];
export const textLanguages: Record<string, string> = {
  'text/plain': 'text',
  'text/css': 'css',
  md: 'markdown',
  toml: 'toml',
  yml: 'yml',
  yaml: 'yaml',
  'application/json': 'json',
  go: 'go',
  java: 'java',
  py: 'python',
  'text/javascript': 'js',
  'text/html': 'html',
};
export const zoomAvailableTypes = [
  ...docxTypes,
  ...pdfTypes,
  ...pptxTypes,
  ...imgTypes,
  ...msgTypes,
];
export const rotationAvailableTypes = [...imgTypes, ...pdfTypes];

export const navigationAvailableTypes = [...pdfTypes];

export const scriberAvailableTypes = [
  ...docxTypes,
  ...pptxTypes,
  ...pdfTypes,
  ...msgTypes,
];
