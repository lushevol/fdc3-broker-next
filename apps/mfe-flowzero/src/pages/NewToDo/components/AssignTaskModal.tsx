import { ExclamationCircleFilled } from "@ant-design/icons";
import { css, styled } from "@mui/material/styles";
import { Input, Modal, Spin } from "antd";
import cn from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getAssignableUsers } from "src/api/todo/Todo";
import AvatarImg from "src/images/Avatar.png";
import type { AssignableUserVo } from "src/types/todo";

const darkBgColor = "#262626";
const grayColor = "#666666";

const StyleRoot = styled("div")(
  () => css`
    .assign-task {
      border-radius: 6px;
      .ant-modal-content {
        padding-top: 0;
        padding-bottom: 0;
        padding-left: 0;
        padding-right: 0;
        .dark & {
          background: ${darkBgColor} !important;
          .anticon-close {
            color: #9ac7f6;
          }
        }
      }
      .ant-modal-close-x {
        color: ##012246;
      }
      .ant-modal-title {
        height: 59px;
        line-height: 59px;
        .dark & {
          color: #f2f2f2;
          background: ${darkBgColor} !important;
        }
      }
      .ant-modal-header {
        height: 59px;
        margin-bottom: 0;
        margin-left: 24px;
        margin-right: 24px;
        .dark & {
          background: ${darkBgColor} !important;
        }
      }
      .ant-modal-body {
        .dark & {
          background: ${darkBgColor} !important;
        }
      }
      .ant-modal-footer {
        border-top: 1px solid #cccccc;
        padding: 0 24px;
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 0;
        .dark & {
          background: ${darkBgColor} !important;
          border-top-color: ${grayColor};
        }
      }
    }
  `
);

// ── Lazy-load avatar: only request axess URL once the element enters viewport ──
const LazyAvatar: React.FC<{ bankId?: string; alt?: string }> = ({
  bankId,
  alt,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setInViewport(false);
    setError(false);
    if (!bankId || !imgRef.current) return;
    const el = imgRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInViewport(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [bankId]);

  const src =
    bankId && inViewport && !error
      ? `https://axess.sc.net/scb-axess-cms/api/users/${bankId}/photo`
      : AvatarImg;

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt ?? "avatar"}
      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shrink-0"
      onError={() => setError(true)}
    />
  );
};

interface AssignTaskModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (user: AssignableUserVo) => void;
  loading?: boolean;
  taskCount?: number;
  workflowName?: string;
  taskName?: string;
}

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  taskCount,
  workflowName = "",
  taskName = "",
}) => {
  const [users, setUsers] = useState<AssignableUserVo[]>([]);
  const [selectedUser, setSelectedUser] = useState<AssignableUserVo | null>(
    null
  );
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const initialUsersRef = useRef<AssignableUserVo[]>([]);

  const loadInitialUsers = useCallback(async () => {
    setSearchLoading(true);
    try {
      const list: AssignableUserVo[] =
        (await getAssignableUsers({ workflowName, taskName })) ?? [];
      initialUsersRef.current = list;
      setUsers(list);
    } catch {
      setUsers([]);
    } finally {
      setSearchLoading(false);
    }
  }, [workflowName, taskName]);

  useEffect(() => {
    if (open) {
      setSelectedUser(null);
      setSearchValue("");
      loadInitialUsers();
    }
  }, [open, loadInitialUsers]);

  const handleSearchClick = () => {
    const term = searchValue.trim();
    if (!term) {
      setUsers(initialUsersRef.current);
      return;
    }
    const lower = term.toLowerCase();
    setUsers(
      initialUsersRef.current.filter(
        (u) =>
          u.userName?.toLowerCase().includes(lower) ||
          u.bankId?.toLowerCase().includes(lower)
      )
    );
  };

  // Typing does frontend filtering against the already-loaded list
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (!val.trim()) {
      setUsers(initialUsersRef.current);
      return;
    }
    const term = val.toLowerCase();
    setUsers(
      initialUsersRef.current.filter(
        (u) =>
          u.userName?.toLowerCase().includes(term) ||
          u.bankId?.toLowerCase().includes(term)
      )
    );
  };

  const handleClear = () => {
    setSearchValue("");
    setUsers(initialUsersRef.current);
  };

  return (
    <StyleRoot>
      <Modal
        title={
          <span className="text-base font-semibold text-light-content-title dark:text-dark-content-title">
            Assign Task
          </span>
        }
        open={open}
        onCancel={onClose}
        onOk={() => selectedUser && onConfirm(selectedUser)}
        okText="Confirm"
        cancelText="Cancel"
        confirmLoading={loading}
        okButtonProps={{
          disabled: !selectedUser,
          className:
            "!rounded-[16px] dark:!bg-[#1677ff] dark:!text-white dark:!border-[#1677ff]",
          style: selectedUser ? {} : { cursor: "default", opacity: 0.5 },
        }}
        cancelButtonProps={{
          className:
            "!rounded-[16px] dark:!bg-transparent dark:!text-[#9AC7F6] dark:!border-[#555555] dark:hover:!border-[#9AC7F6] dark:hover:!text-[#d9d9d9]",
        }}
        width={600}
        centered
        destroyOnClose
        zIndex={1600}
        className="assign-task bg-light-container-layer dark:bg-dark-container-layer"
        getContainer={false}
      >
        <div className="border-b border-[#ccc] dark:border-[#666] mb-4"></div>
        <div className="!pl-[24px] pb-4">
          <div className="mb-4 mr-[24px]">
            <Input
              suffix={
                <span
                  className="flowzero-iconfont icon-search cursor-pointer"
                  style={{ fontSize: 15, color: "#0473EA" }}
                  role="button"
                  tabIndex={0}
                  aria-label="Search"
                  onClick={handleSearchClick}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                />
              }
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
              allowClear
              onClear={handleClear}
              className="rounded-full dark:bg-dark-container-layer"
            />
          </div>

          <p className="text-sm text-gray-500 mb-3">
            Select a user from your group to assign the selected tasks to
          </p>

          {taskCount !== undefined && taskCount > 1 && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg mb-3 mr-[24px]",
                "bg-[#FFF9EC] border border-[#F0C040]"
              )}
            >
              <ExclamationCircleFilled
                style={{ color: "#D97706", fontSize: 16 }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "#92400E" }}
              >
                {taskCount} tasks were selected
              </span>
            </div>
          )}

          <Spin spinning={searchLoading}>
            <div className="max-h-72 overflow-y-auto flex flex-col gap-2 pr-6">
              {users.map((user) => (
                <div
                  key={user.id ?? user.bankId}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors",
                    selectedUser?.id === user.id
                      ? "border-[#0473EA] bg-gray-50 dark:bg-[#00172e]"
                      : "border-[#CCCCCC] bg-white hover:border-[#AAAAAA] hover:bg-gray-50 dark:bg-transparent dark:border-[#555] dark:hover:bg-[#1f1f1f]"
                  )}
                  onClick={() => setSelectedUser(user)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedUser(user)}
                >
                  <LazyAvatar bankId={user.bankId} alt={user.userName} />
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "font-medium text-sm truncate",
                        selectedUser?.id === user.id
                          ? "text-[#0473EA] dark:text-[#4f9df0]"
                          : "text-light-content-title dark:text-dark-content-title"
                      )}
                    >
                      {user.userName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.email}&nbsp;&nbsp;Role: {user.roleName}
                    </div>
                  </div>
                </div>
              ))}
              {!searchLoading && users.length === 0 && (
                <div className="text-center text-gray-400 py-8 text-sm">
                  No users found
                </div>
              )}
            </div>
          </Spin>
        </div>
      </Modal>
    </StyleRoot>
  );
};

export default AssignTaskModal;
