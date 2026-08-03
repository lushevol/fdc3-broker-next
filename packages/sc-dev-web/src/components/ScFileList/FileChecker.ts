import { msg } from '@lit/localize';
import { FileData } from './FileData.js';

export function filteringFiles(accept: string, maxSize: number, files: any) {
    const acceptedTypes = new Set(accept.split(',').map(item => item.trim()));
    const invalidFiles: FileData[] = [];
    const validFiles: FileData[] =  Array.prototype.filter.call(
      files,
      ({ name, size, type: mimeType = '', ...props }) => {
        const fileExtensionRegExp = /\.[^.]+$/;
        const hasFileExtension = fileExtensionRegExp.test(name);
        const [fileExtension] = !hasFileExtension
          ? [undefined]
          : fileExtensionRegExp.exec(name) ?? [];
        if (accept) {
          if (!acceptedTypes.has(mimeType) && fileExtension &&  !acceptedTypes.has(fileExtension.toLocaleLowerCase())) {
            invalidFiles.push({
              ...props,
              name,
              size,
              status: 'error', 
              extra: msg('Invalid File Format',  { id: 'sc-file-input-invalid-format' }),
            });
            return false;
          }
        }

        if (maxSize && size > maxSize) {
          invalidFiles.push({
            ...props,
            name,
            size,
            status: 'error', 
            extra: msg('Exceeded Limit Size', { id: 'sc-file-input-exceed-limit-size' }),
          });
          return false;
        }

        return (
          (!accept || acceptedTypes.has(mimeType) || (fileExtension && acceptedTypes.has(fileExtension.toLocaleLowerCase()))) &&
          (!maxSize || size <= maxSize)
        );
      }
    );
    return {
      validFiles,
      invalidFiles,
    };
}