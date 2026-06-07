export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type SortDirection = "ASC" | "DESC";

export interface GetUserPageParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  id?: string;
  bankId?: string;
  userName?: string;
  countryCode?: string;
  email?: string;
  roleName?: string;
  status?: UserStatus;
}

export interface UserResponse {
  id?: string;
  bankId?: string;
  userName?: string;
  countryCode?: string;
  email?: string;
  roleName?: string;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  version?: number;
}

export interface UserPageResponse {
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  data?: UserResponse[];
}

export interface GetUserSearchParams {
  userName?: string;
  bankId?: string;
  countryCode?: string;
  email?: string;
  roleName?: string;
}
