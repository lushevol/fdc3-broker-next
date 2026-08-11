import { ICON_SIZE } from '../ScIcon/IconBase.js';

export type FileUploadStatus = 'default' | 'error' | 'uploading' | 'success';

export interface FileData {
  id: string;
  name: string;
  size: number;
  selectable: boolean;
  deletable: boolean;
  canceled?: boolean;
  selected?: boolean;
  deleted?: boolean;
  'icon-size': ICON_SIZE;
  'no-border': boolean;
  'no-icon': boolean;
  'progress-size': number;
  'progress-text': string;
  'progress-type': 'success' | 'warning' | 'error';
  status?: FileUploadStatus;
  extra?: string;
  width?: string;
}

/**
 * this type is used to define a return type for filtered added files
 */
export type AddedFilesType = {
  validFiles: FileData[];
  invalidFiles?: FileData[];
}
