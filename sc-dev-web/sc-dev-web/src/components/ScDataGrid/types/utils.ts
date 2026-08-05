export enum EPosition {
  left = 'Left',
  center = 'Center',
  right = 'Right',
}

export enum ERowPinningPosition {
  top = 'top',
  bottom = 'bottom',
}

export enum ERowPosition {
  top = 'top',
  bottom = 'bottom',
  header = 'header',
  center = 'center'
}

export type RowHeightEventType = {
  height: number;
  rowIndex: number;
  rowId: string;
  columnId: string;
};

export type TPosition = EPosition.left | EPosition.center | EPosition.right;

export type RowSelectionStrategy = 'all' | 'currentPage';

export type RowSelectionMode = 'single' | 'multiple';

export interface StyleInfo {
  [name: string]: string | number | undefined | null;
}

export type GetDynamicData = (keyword?: string) => Promise<any>;

export type GetStaticFilterData = () =>
  | {
      label: string;
      value: string;
    }[]
  | undefined;
