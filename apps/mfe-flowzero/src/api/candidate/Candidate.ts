import { Service } from "src/Root/import";
import type {
  CandidateGroupPageResponse,
  CandidateGroupVo,
  GetCandidateGroupPageParams,
  GetCandidateGroupSearchParams,
} from "src/types/candidate";

import { DEFAULT_HEADERS, WORKFLOW } from "../index";

const { service } = Service;

// 1. Query candidate groups with pagination
export const getCandidateGroupPage = (params: GetCandidateGroupPageParams) =>
  service.get<GetCandidateGroupPageParams, CandidateGroupPageResponse>(
    `${WORKFLOW}/candidate-group/page`,
    { params, headers: DEFAULT_HEADERS }
  );

// 2. Get candidate group detail by ID
export const getCandidateGroupDetail = (id: string) =>
  service.get<string, CandidateGroupVo>(
    `${WORKFLOW}/candidate-group/detail/${id}`,
    { headers: DEFAULT_HEADERS }
  );

// 3. Search candidate groups by name
export const searchCandidateGroups = (params?: GetCandidateGroupSearchParams) =>
  service.get<GetCandidateGroupSearchParams | undefined, CandidateGroupVo[]>(
    `${WORKFLOW}/candidate-group/search`,
    { params, headers: DEFAULT_HEADERS }
  );
