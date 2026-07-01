/// <reference types="react" />
export interface ModalProps {
  title?: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  isDraggable?: boolean;
  isResizeble?: boolean;
  isLoading?: boolean;
  actionComponents: any;
  columns: any[];
  record: any;
  onChange: (value: any, field: string) => void;
  resetId: number;
}
export interface FieldProps {
  column: any;
  columnId: number;
  record: any;
  onChange: (value: any, field: string) => void;
  resetId: number;
}
