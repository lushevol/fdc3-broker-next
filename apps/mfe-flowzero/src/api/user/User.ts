import { Service } from "src/Root/import";
import type { GetUserSearchParams, UserResponse } from "src/types/user";

import { DEFAULT_HEADERS, WORKFLOW } from "../index";

const { service } = Service;

// 1. Get user by bankId
export const getUserByBankId = (bankId: string) =>
  service.get<string, UserResponse>(`${WORKFLOW}/user/bankId/${bankId}`, {
    headers: DEFAULT_HEADERS,
  });

// 2. Get user by email
export const getUserByEmail = (email: string) =>
  service.get<string, UserResponse>(`${WORKFLOW}/user/email/${email}`, {
    headers: DEFAULT_HEADERS,
  });

// 3. Get users by country code
export const getUsersByCountry = (countryCode: string) =>
  service.get<string, UserResponse[]>(
    `${WORKFLOW}/user/country/${countryCode}`,
    { headers: DEFAULT_HEADERS }
  );

// 4. Get users by user name (fuzzy search)
export const getUsersByUserName = (userName: string) =>
  service.get<string, UserResponse[]>(`${WORKFLOW}/user/userName/${userName}`, {
    headers: DEFAULT_HEADERS,
  });

// 5. Get all users
export const getAllUsers = () =>
  service.get<undefined, UserResponse[]>(`${WORKFLOW}/user/all`, {
    headers: DEFAULT_HEADERS,
  });

// 6. Search users by conditions
export const searchUsers = (params?: GetUserSearchParams) =>
  service.get<GetUserSearchParams | undefined, UserResponse[]>(
    `${WORKFLOW}/user/search`,
    { params, headers: DEFAULT_HEADERS }
  );
