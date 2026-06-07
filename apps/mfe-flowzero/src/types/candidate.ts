export type SortDirection = "ASC" | "DESC";

export interface CandidateGroupVo {
  id?: string;
  name?: string;
  description?: string;
}

export interface GetCandidateGroupPageParams {
  name?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface CandidateGroupPageResponse {
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  data?: CandidateGroupVo[];
}

export interface GetCandidateGroupSearchParams {
  name?: string;
}
