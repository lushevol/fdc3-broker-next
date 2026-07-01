import styled from "@emotion/styled";
import { Node } from "@xyflow/react";
import { Form, Input, Select, Spin, Switch } from "antd";
import cn from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { searchCandidateGroups } from "src/api/candidate/Candidate";
import { searchUsers } from "src/api/user/User";
import AvatarImg from "src/images/Avatar.png";
import type { CandidateGroupVo } from "src/types/candidate";
import type { UserResponse } from "src/types/user";

import { WorkflowNodeType } from "../../types/nodeTypes";
import { PropertiesPanelProps } from "../config/ILayoutsConfig";
import CloseIcon from "../node_icon/close.svg";
import Close2Icon from "../node_icon/close2.svg";

const FormWrapper = styled("div")`
  .ant-select-in-form-item {
    height: 32px;
  }
  .ant-input {
    border-color: #ccc !important;
  }
  .ant-select-selector {
    border-color: #ccc !important;
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #0473ea;
    border-color: #0473ea;
  }
`;

// ──────── Avatar ────────
const UserAvatar: React.FC<{ bankId?: string; alt?: string }> = ({
  bankId,
  alt,
}) => {
  const [error, setError] = useState(false);
  const src =
    bankId && !error
      ? `https://axess.sc.net/scb-axess-cms/api/users/${bankId}/photo`
      : AvatarImg;
  return (
    <img
      src={src}
      alt={alt ?? "avatar"}
      className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
      onError={() => setError(true)}
    />
  );
};

// ──────── UserSelectDropdown ────────
interface UserSelectDropdownProps {
  value: UserResponse | UserResponse[] | null;
  onChange: (val: UserResponse | UserResponse[] | null) => void;
  multiple?: boolean;
  preloadedUsers?: UserResponse[];
  closeSignal?: number;
}

const UserSelectDropdown: React.FC<UserSelectDropdownProps> = ({
  value,
  onChange,
  multiple = false,
  preloadedUsers,
  closeSignal,
}) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setOpen(false);
    setSearchText("");
  }, [closeSignal]);

  const selected: UserResponse[] = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value && !Array.isArray(value)
    ? [value]
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as HTMLElement)
      ) {
        setOpen(false);
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback(async (term: string) => {
    setLoading(true);
    try {
      const trimmed = term.trim();
      const isNumeric = /^\d+$/.test(trimmed);
      const res = await searchUsers(
        trimmed
          ? isNumeric
            ? { bankId: trimmed }
            : { userName: trimmed }
          : undefined
      );
      setResults(res ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    if (preloadedUsers !== undefined) {
      setResults(preloadedUsers);
      return;
    }
    if (results.length === 0 && !loading) {
      doSearch("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchText(val);
    if (preloadedUsers !== undefined) {
      const lower = val.toLowerCase();
      setResults(
        val.trim()
          ? preloadedUsers.filter(
              (u) =>
                u.userName?.toLowerCase().includes(lower) ||
                u.bankId?.toLowerCase().includes(lower)
            )
          : preloadedUsers
      );
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const isSelected = (user: UserResponse) =>
    selected.some(
      (u) =>
        (u.id && u.id === user.id) || (u.bankId && u.bankId === user.bankId)
    );

  const handleSelect = (user: UserResponse) => {
    if (multiple) {
      if (isSelected(user)) {
        onChange(
          selected.filter((u) => u.id !== user.id || u.bankId !== user.bankId)
        );
      } else {
        onChange([...selected, user]);
      }
    } else {
      onChange(user);
      setOpen(false);
      setSearchText("");
    }
  };

  const handleRemoveTag = (user: UserResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(
      selected.filter((u) => u.id !== user.id || u.bankId !== user.bankId)
    );
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(multiple ? [] : null);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "min-h-[32px] py-[3px] px-[12px] rounded-lg border cursor-pointer",
          "flex flex-wrap items-center gap-1.5",
          "bg-white dark:bg-[#171d24]",
          open ? "border-[#0473ea]" : "border-[#ccc] dark:border-[#737373]"
        )}
        onClick={handleOpen}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      >
        {selected.length === 0 ? (
          <span className="text-gray-400 text-sm flex-1 select-none">
            {/* Select */}
          </span>
        ) : multiple ? (
          <>
            <div className="flex flex-wrap gap-1 flex-1">
              {selected.map((u) => (
                <span
                  key={u.id ?? u.bankId}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 h-[22px]",
                    "rounded border border-[#CCCCCC] text-[12px]",
                    "bg-[#F2F2F2] dark:bg-[#2a2a2a] text-[#00172E] dark:text-gray-200"
                  )}
                >
                  {u.userName}
                  <span
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-center cursor-pointer ml-0.5 opacity-70 hover:opacity-100"
                    onMouseDown={(e) => handleRemoveTag(u, e)}
                  >
                    <img
                      src={Close2Icon}
                      alt="remove"
                      className="w-[9px] h-[9px]"
                    />
                  </span>
                </span>
              ))}
            </div>
            {open && selected.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                className="shrink-0 flex items-center justify-center cursor-pointer"
                onMouseDown={handleClearAll}
                aria-label="Clear all"
              >
                <img
                  src={CloseIcon}
                  alt="clear"
                  className="w-[14px] h-[14px]"
                />
              </span>
            )}
          </>
        ) : (
          <span className="text-sm text-gray-700 dark:text-gray-200 flex-1 truncate">
            {selected[0].userName}
          </span>
        )}
        {/* Chevron */}
        <span className="shrink-0">
          <span
            className="flowzero-iconfont icon-arrow-chevron-nav-downward"
            style={{ fontSize: 13, color: "#0473EA" }}
          />
        </span>
      </div>

      {/* Dropdown panel – opens upward */}
      {open && (
        <div
          className={cn(
            "absolute left-0 right-0 bottom-full mb-[36px] z-50",
            "bg-white dark:bg-[#1f1f1f]",
            "border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg"
          )}
        >
          {/* Search bar */}
          <div className="px-3 pt-3 pb-2">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full",
                "border border-gray-200 dark:border-gray-600",
                "bg-white dark:bg-[#2a2a2a]"
              )}
            >
              <input
                className="flex-1 text-sm outline-none bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400"
                placeholder="Search"
                value={searchText}
                onChange={handleSearchChange}
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
              />
              <span
                className="flowzero-iconfont icon-search shrink-0 cursor-pointer"
                style={{ fontSize: 15, color: "#0473EA" }}
                role="button"
                aria-label="Search"
                tabIndex={0}
                onClick={() => {
                  clearTimeout(debounceRef.current);
                  doSearch(searchText);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    clearTimeout(debounceRef.current);
                    doSearch(searchText);
                  }
                }}
              />
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700" />
          {/* User list */}
          <div className="max-h-52 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-6">
                <Spin size="small" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-6">
                No users found
              </div>
            ) : (
              results.map((user) => {
                const sel = isSelected(user);
                return (
                  <div
                    key={user.id ?? user.bankId}
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                      sel
                        ? "bg-gray-100 dark:bg-[#2a2a2a]"
                        : "hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                    )}
                    onClick={() => handleSelect(user)}
                    onKeyDown={(e) => e.key === "Enter" && handleSelect(user)}
                  >
                    <UserAvatar bankId={user.bankId} alt={user.userName} />
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "font-medium text-sm truncate",
                          sel
                            ? "text-[#0473ea]"
                            : "text-gray-800 dark:text-gray-100"
                        )}
                      >
                        {user.userName}
                      </div>
                      <div className="text-xs text-gray-400 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ──────── GroupSelectDropdown ────────
interface GroupSelectDropdownProps {
  value: CandidateGroupVo | null;
  onChange: (val: CandidateGroupVo | null) => void;
  preloadedGroups?: CandidateGroupVo[];
  closeSignal?: number;
}

const GroupSelectDropdown: React.FC<GroupSelectDropdownProps> = ({
  value,
  onChange,
  preloadedGroups,
  closeSignal,
}) => {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<CandidateGroupVo[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setOpen(false);
  }, [closeSignal]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as HTMLElement)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = async () => {
    setOpen(true);
    if (preloadedGroups !== undefined) {
      setGroups(preloadedGroups);
      return;
    }
    if (!loadedRef.current) {
      loadedRef.current = true;
      setLoading(true);
      try {
        const res = await searchCandidateGroups();
        setGroups(res ?? []);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "h-[32px] px-3 rounded-lg border cursor-pointer flex items-center",
          "bg-white dark:bg-[#171d24]",
          open ? "border-[#0473ea]" : "border-[#ccc] dark:border-[#737373]"
        )}
        onClick={handleOpen}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
      >
        {value ? (
          <span className="text-sm text-gray-700 dark:text-gray-200 flex-1 truncate">
            {value.name}
          </span>
        ) : (
          <span className="text-gray-400 text-sm flex-1 select-none">
            {/* Select */}
          </span>
        )}
        <span className="shrink-0">
          <span
            className="flowzero-iconfont icon-arrow-chevron-nav-downward"
            style={{ fontSize: 13, color: "#0473EA" }}
          />
        </span>
      </div>

      {/* Group dropdown – opens upward */}
      {open && (
        <div
          className={cn(
            "absolute left-0 right-0 bottom-full mb-[36px] z-50",
            "bg-white dark:bg-[#1f1f1f]",
            "border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg"
          )}
        >
          <div className="max-h-52 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-6">
                <Spin size="small" />
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-6">
                No groups found
              </div>
            ) : (
              groups.map((group) => (
                <div
                  key={group.id ?? group.name}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "px-4 py-3 cursor-pointer text-sm transition-colors",
                    value?.id === group.id
                      ? "bg-gray-50 dark:bg-[#2a2a2a] text-[#00172E] dark:text-gray-100 font-semibold"
                      : "text-[#00172E] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                  )}
                  onClick={() => {
                    onChange(group);
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onChange(group);
                      setOpen(false);
                    }
                  }}
                >
                  {group.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const UserTaskNodeForm: React.FC<PropertiesPanelProps> = ({
  nodeData,
  nodeType,
  upstreamNodes = [],
  allNodes = [],
  onNodeDataChange,
}) => {
  const [form] = Form.useForm();
  const [showRejectSelect, setShowRejectSelect] = useState(true);

  // ── Nomination state ──────────────────────────────────────────────────────
  const [assigneeUser, setAssigneeUser] = useState<UserResponse | null>(null);
  const [candidateUsers, setCandidateUsers] = useState<UserResponse[]>([]);
  const [candidateUsersError, setCandidateUsersError] = useState<string | null>(
    null
  );
  const [candidateGroup, setCandidateGroup] = useState<CandidateGroupVo | null>(
    null
  );

  // ── Preloaded lists (fetched once, shared by all dropdowns) ───────────────
  const [allUsers, setAllUsers] = useState<UserResponse[] | undefined>(
    undefined
  );
  const [allCandidateGroups, setAllCandidateGroups] = useState<
    CandidateGroupVo[] | undefined
  >(undefined);
  const listsRef = useRef<{
    users: UserResponse[];
    groups: CandidateGroupVo[];
  } | null>(null);

  // ── Close dropdowns when switching nodes ────────────────────────────────
  const [closeDropdownsSignal, setCloseDropdownsSignal] = useState(0);
  const prevNodeDataRef = useRef(nodeData);

  const handleRejectChange = (checked: boolean) => {
    setShowRejectSelect(checked);
  };

  useEffect(() => {
    if (prevNodeDataRef.current !== nodeData) {
      prevNodeDataRef.current = nodeData;
      setCloseDropdownsSignal((n) => n + 1);
      setCandidateUsersError(null);
    }

    form.resetFields();

    const defaultValues = {
      approveButton: 1,
      rejectButton: 1,
      terminateButton: 0,
      ...nodeData,
    };
    if (upstreamNodes.length === 1) {
      defaultValues.rejectButton = 0;
      nodeData.rejectButton = 0;
      nodeData.approveButton = 1;
    }

    // Clear rejectTo if the referenced node no longer exists in upstream nodes
    const validRejectIds = upstreamNodes
      .filter((node) => node.type === WorkflowNodeType.USER_TASK)
      .map((node) => node.id);
    if (
      defaultValues.rejectTo &&
      !validRejectIds.includes(defaultValues.rejectTo)
    ) {
      defaultValues.rejectTo = undefined;
      nodeData.rejectTo = undefined;
    }

    form.setFieldsValue(defaultValues);

    // Hydrate nomination fields from nodeData using the preloaded lists.
    // Lists are fetched once (cached in listsRef) and reused on every nodeData change.
    const hydrate = async () => {
      // ── Load lists once ────────────────────────────────────────────────────
      if (!listsRef.current) {
        const [users, groups] = await Promise.all([
          searchUsers().catch(() => [] as UserResponse[]),
          searchCandidateGroups().catch(() => [] as CandidateGroupVo[]),
        ]);
        listsRef.current = { users: users ?? [], groups: groups ?? [] };
        setAllUsers(listsRef.current.users);
        setAllCandidateGroups(listsRef.current.groups);
      }
      const allU = listsRef.current.users;
      const allG = listsRef.current.groups;

      // ── Assignee ──────────────────────────────────────────────────────────
      const assigneeRaw = nodeData?.assignee;
      if (!assigneeRaw) {
        setAssigneeUser(null);
      } else {
        const found = allU.find((u) => u.bankId === String(assigneeRaw));
        setAssigneeUser(
          found ?? ({ bankId: String(assigneeRaw) } as UserResponse)
        );
      }

      // ── Candidate Users ────────────────────────────────────────────────────
      const cuRaw = nodeData?.candidateUsers;
      if (!cuRaw || (Array.isArray(cuRaw) && cuRaw.length === 0)) {
        setCandidateUsers([]);
        setCandidateUsersError(null);
      } else {
        const ids: string[] = Array.isArray(cuRaw)
          ? (cuRaw as string[])
          : String(cuRaw)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
        const hydratedUsers = allU.filter((u) => ids.includes(u.bankId ?? ""));
        setCandidateUsers(hydratedUsers);
        setCandidateUsersError(
          hydratedUsers.length === 1
            ? "Please select at least 2 candidate users."
            : null
        );
      }

      // ── Candidate Group ────────────────────────────────────────────────────
      const cgRaw = nodeData?.candidateGroup;
      if (!cgRaw) {
        setCandidateGroup(null);
      } else {
        const found = allG.find((g) => g.name === String(cgRaw));
        setCandidateGroup(found ?? { name: String(cgRaw) });
      }
    };

    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeData, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (nodeData) {
      Object.assign(nodeData, allValues);
      if (onNodeDataChange) {
        onNodeDataChange(allValues);
      }
    }
  };

  const propagateNomination = (patch: Record<string, any>) => {
    if (nodeData) {
      Object.assign(nodeData, patch);
      onNodeDataChange?.({ ...form.getFieldsValue(), ...patch });
    }
  };

  const handleAssigneeChange = (val: UserResponse | UserResponse[] | null) => {
    const user = Array.isArray(val) ? null : (val as UserResponse | null);
    setAssigneeUser(user);
    setCandidateUsers([]);
    setCandidateGroup(null);
    propagateNomination({
      assignee: user?.bankId ?? null,
      candidateUsers: [],
      candidateGroup: null,
    });
  };

  const handleCandidateUsersChange = (
    val: UserResponse | UserResponse[] | null
  ) => {
    const list = Array.isArray(val) ? val : val ? [val] : [];
    setCandidateUsers(list);
    setCandidateUsersError(
      list.length === 1 ? "Please select at least 2 candidate users." : null
    );
    setAssigneeUser(null);
    setCandidateGroup(null);
    propagateNomination({
      assignee: null,
      candidateUsers: list.map((u) => u.bankId).filter(Boolean) as string[],
      candidateGroup: null,
    });
  };

  const handleCandidateGroupChange = (group: CandidateGroupVo | null) => {
    setCandidateGroup(group);
    setAssigneeUser(null);
    setCandidateUsers([]);
    propagateNomination({
      assignee: null,
      candidateUsers: [],
      candidateGroup: group?.name ?? null,
    });
  };

  const getAprovalList = () => {
    if (!upstreamNodes?.length) return [];
    return upstreamNodes
      .filter((node) => node.type === WorkflowNodeType.USER_TASK)
      .map((node) => ({ label: node.data?.label || "", value: node.id }));
  };

  const isLabelDuplicate = (_value?: string) => false;

  const isNotFirst = () => {
    if (!upstreamNodes?.length) return false;
    return upstreamNodes.some(
      (node) => node.type === WorkflowNodeType.USER_TASK
    );
  };

  return (
    <FormWrapper>
      <Form layout="vertical" form={form} onValuesChange={handleValuesChange}>
        <Form.Item
          label={
            <span className="font-medium text-light-content-label-text dark:text-dark-content-label-text">
              Label
            </span>
          }
          name="label"
          validateTrigger="onBlur"
          rules={[
            {
              validator: (_, value) =>
                isLabelDuplicate(value)
                  ? Promise.reject(
                      new Error("Workflow step name already exists!")
                    )
                  : Promise.resolve(),
            },
          ]}
        >
          <Input className="h-[32px]" maxLength={200} />
        </Form.Item>

        {/* ── Nomination ────────────────────────────────────────────────── */}
        <h2 className="mb-2 font-bold text-[12px] text-[#0367D2] dark:text-[#9AC7F6]">
          Nomination
        </h2>
        <div className="border-b border-light-divide-base dark:border-dark-divide-base mb-4" />

        {/* Note alert */}
        <div
          className={cn(
            "flex gap-2 p-3 mb-5 rounded-lg",
            "bg-[#EBF2FD] dark:bg-[#00172E]"
          )}
        >
          <span className="shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="8" fill="#0367D2" />
              <text
                x="8"
                y="12"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="white"
              >
                i
              </text>
            </svg>
          </span>
          <div>
            <p className="text-[#0367D2] font-semibold text-xs mb-0.5">Note</p>
            <p className="text-gray-600 dark:text-dark-content-body text-xs leading-4 mb-0">
              Assignee, candidate user, and candidate group are mutually
              exclusive. Only one assignment method can be selected at a time.
              Selecting a new method will clear the previous selection.
            </p>
          </div>
        </div>

        {/* Assignee */}
        <div className="mb-4">
          <span className="block font-medium text-sm text-light-content-label-text dark:text-dark-content-label-text mb-1.5">
            Assignee
          </span>
          <UserSelectDropdown
            value={assigneeUser}
            onChange={handleAssigneeChange}
            multiple={false}
            preloadedUsers={allUsers}
            closeSignal={closeDropdownsSignal}
          />
        </div>

        {/* Candidate User */}
        <div className="mb-1.5">
          <span className="block font-medium text-sm text-light-content-label-text dark:text-dark-content-label-text mb-1.5">
            Candidate User
          </span>
          <UserSelectDropdown
            value={candidateUsers}
            onChange={handleCandidateUsersChange}
            multiple={true}
            preloadedUsers={allUsers}
            closeSignal={closeDropdownsSignal}
          />
          {candidateUsersError && (
            <p className="text-xs text-red-500 mt-1 mb-0">
              {candidateUsersError}
            </p>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Force multi-user selection (minimum 2 users required)
        </p>

        {/* Candidate Group */}
        <div className="mb-1.5">
          <span className="block font-medium text-sm text-light-content-label-text dark:text-dark-content-label-text mb-1.5">
            Candidate Group
          </span>
          <GroupSelectDropdown
            value={candidateGroup}
            onChange={handleCandidateGroupChange}
            preloadedGroups={allCandidateGroups}
            closeSignal={closeDropdownsSignal}
          />
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Single group selection only
        </p>

        {/* ── Action Setting ───────────────────────────────────────────── */}
        <h2 className="mb-2 font-bold text-[12px] text-[#0367D2] dark:text-[#9AC7F6]">
          Action Setting
        </h2>
        <div className="border-b border-light-divide-base dark:border-dark-divide-base mb-[8px]" />
        <Form.Item
          label={
            <span className="font-medium font-[12px] text-[#808080] dark:text-dark-content-label-text">
              The buttons bellow will be visible on the task detail page when
              enabled.
            </span>
          }
        >
          <div className="flex gap-8 items-center">
            <div className="flex items-center gap-2 w-[168px]">
              <Form.Item
                name="approveButton"
                valuePropName="checked"
                getValueFromEvent={(e) => (e ? 1 : 0)}
                getValueProps={(value) => ({ checked: value == 1 })}
                noStyle
              >
                <Switch defaultChecked={true} size="small" />
              </Form.Item>
              <span className="text-light-input-text dark:text-dark-input-text text-[14px] font-[400]">
                Approve
              </span>
            </div>
            {isNotFirst() && (
              <div className="flex items-center gap-2 w-[168px]">
                <Form.Item
                  name="rejectButton"
                  valuePropName="checked"
                  noStyle
                  getValueFromEvent={(e) => (e ? 1 : 0)}
                  getValueProps={(value) => ({ checked: value == 1 })}
                >
                  <Switch
                    size="small"
                    defaultChecked={true}
                    onChange={handleRejectChange}
                    checked={showRejectSelect}
                  />
                </Form.Item>
                <span className="text-light-input-text dark:text-dark-input-text text-[14px] font-[400]">
                  Reject
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 w-[168px]">
              <Form.Item
                name="terminateButton"
                valuePropName="checked"
                noStyle
                getValueFromEvent={(e) => (e ? 1 : 0)}
                getValueProps={(value) => ({ checked: value == 1 })}
              >
                <Switch defaultChecked={true} size="small" />
              </Form.Item>
              <span className="text-light-input-text dark:text-dark-input-text text-[14px] font-[400]">
                Terminate
              </span>
            </div>
          </div>
        </Form.Item>
        {showRejectSelect && Boolean(getAprovalList()?.length) && (
          <Form.Item
            label={
              <span className="font-medium text-light-content-label-text dark:text-dark-content-label-text">
                Reject to
              </span>
            }
            className="mt-0 mb-4"
            name={"rejectTo"}
            rules={[{ required: false }]}
          >
            <Select
              className="w-full max-w-[360px]"
              placeholder="Select an option"
              options={getAprovalList()}
              allowClear
            />
          </Form.Item>
        )}
      </Form>
    </FormWrapper>
  );
};

export default UserTaskNodeForm;
