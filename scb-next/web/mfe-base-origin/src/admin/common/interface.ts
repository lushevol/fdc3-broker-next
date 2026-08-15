export interface AdminModuleProps {
  children?: React.ReactNode;
  module: string;
  tile: string;
  panelId: string;
  tabId: string;
  parameters?: Record<string, unknown>;
}

export interface AdminRecord extends Record<string, unknown> {
  id?: string | number;
  applicationCategoryId?: string | number;
  applicationCategoryAuditId?: string | number;
  applicationConfigId?: string | number;
  applicationTileId?: string | number;
  applicationTileAuditId?: string | number;
  importMapId?: string | number;
  importMapAuditId?: string | number;
  label?: string;
  keyName?: string;
  applicationCategory?: AdminRecord | null;
  importMap?: AdminRecord | null;
  mode?: "new" | "verify" | "edit" | "deactivate" | string;
  readOnly?: boolean;
  active?: boolean;
  createdAt?: string | number | Date;
  updatedAt?: string | number | Date;
  createdBy?: string;
  updatedBy?: string;
}

export type AdminDataSetter = (data: AdminRecord[]) => void;
