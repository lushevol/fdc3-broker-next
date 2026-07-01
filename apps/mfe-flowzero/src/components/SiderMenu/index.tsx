import { css } from "@emotion/react";
import cn from "classnames";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ReactRouterDom } from "src/Root/import";
import { StatisticsScope } from "src/types/statistics";

import Logo from "../Logo";
import TruncatedTooltip from "../TruncatedTooltip";
import StyledSider from "./StyledSider";
const { Link, useResolvedPath, useLocation, useNavigate } = ReactRouterDom;
import {
  Button,
  ConfigProvider,
  Menu,
  type MenuProps,
  type MenuTheme,
  Tooltip,
} from "antd";
import { observer } from "mobx-react-lite";
import { getPendingDistribution } from "src/api/statistics/Statistics";
import { getWorkflowNavigation } from "src/api/todo/Todo";
import { useBPMNContext } from "src/provider/BPMNProvider";
import { navigationStore } from "src/stores/NavigationStore";
import type { WorkflowNode } from "src/types/todo";

import {
  BASE_PATH,
  getMenuKeyFromPath,
  type MenuGroupConfig,
  type MenuItemConfig,
} from "./routeResolvers";

type MenuItem = Required<MenuProps>["items"][number];

// Menu configuration data
const MENU_CONFIG: MenuGroupConfig[] = [
  {
    label: "Workflows",
    items: [
      {
        key: "HOME",
        label: "Home",
        icon: "icon-building-bank",
        route: `${BASE_PATH}/home`,
        tooltip: "Home",
      },
      {
        key: "TASK_CENTRE",
        label: "My Request",
        icon: "icon-list-task",
        route: `${BASE_PATH}/task-center`,
        tooltip: "My Request",
      },
      {
        key: "NewRequest",
        label: "New Request",
        icon: "icon-flag",
        route: `${BASE_PATH}/new-request`,
        tooltip: "New Request",
      },
    ],
  },
  {
    label: "Design",
    items: [
      {
        key: "WorkflowManagment",
        label: "Workflow Management",
        icon: "icon-sparkle-ai",
        route: `${BASE_PATH}/workflow-management`,
        tooltip: "Workflow Management",
      },
      {
        key: "fieldconfiguration",
        label: "Field Configuration",
        icon: "icon-code-dev-laptop",
        route: `${BASE_PATH}/fields-management`,
        tooltip: "Field Configuration",
      },
      {
        key: "Form Management",
        label: "Form Management",
        icon: "icon-form-designer",
        route: `${BASE_PATH}/form-management`,
        tooltip: "Form Management",
      },
    ],
  },

  // {
  //   label: "Utilities",
  //   items: [
  //     {
  //       key: "BUSINESS_RULE",
  //       label: "Business Rule",
  //       icon: "icon-building-office",
  //       tooltip: "Business Rule",
  //     },
  //     {
  //       key: "EMAIL_TEMPLATE",
  //       label: "Email Template",
  //       icon: "icon-mail-envelope-closed",
  //       tooltip: "Email Template",
  //     },
  //   ],
  // },
];

// Helper functions to generate menu items
const createMenuIcon = (iconClass: string): React.ReactNode => (
  <span className={`flowzero-iconfont ${iconClass} dark:text-dark-text`} />
);

const createNavigationLink = (
  route: string,
  className: string,
  children: React.ReactNode,
  isSelected: boolean
): React.ReactNode => {
  return (
    <Link
      to={route}
      className={cn(`${className} no-underline`, {
        selected: isSelected,
      })}
    >
      {children}
    </Link>
  );
};

const createMenuItem = (
  config: MenuItemConfig,
  collapsed: boolean,
  pathname: string
): MenuItem => {
  const isSelected = config.route ? pathname === config.route : false;
  const className = "workflow-sidermenu-item-link";

  let icon: React.ReactNode;
  let label: React.ReactNode;

  if (config.route) {
    // Navigation item
    if (collapsed) {
      icon = createNavigationLink(
        config.route,
        className,
        createMenuIcon(config.icon),
        isSelected
      );
      label = config.tooltip ?? config.label;
    } else {
      icon = createMenuIcon(config.icon);
      label = createNavigationLink(
        config.route,
        className,
        config.label,
        isSelected
      );
    }
  } else {
    // Static item
    icon = createMenuIcon(config.icon);
    label = config.label;
  }

  return {
    key: config.key,
    icon,
    label,
  };
};

const createGroupLabel = (
  label: string,
  collapsed: boolean
): React.ReactNode => {
  if (collapsed) return "";
  return <span className="text-[#0057B8] font-semibold">{label}</span>;
};

const createToggleButton = (
  collapsed: boolean,
  toggleCollapsed: () => void
): React.ReactNode => {
  if (!collapsed) {
    return (
      <div
        className="flex items-center h-12 border-t border-light-divide-base dark:border-dark-divide-base mx-[16px] my-[4px] cursor-pointer"
        onClick={toggleCollapsed}
      >
        <span className="text-light-input-text dark:text-dark-input-text  ml-[12px] mr-2 flowzero-iconfont icon-arrow-chevron-nav-left-backward" />
        <span className=" text-light-input-text dark:text-dark-input-text">
          Collapse
        </span>
      </div>
    );
  }

  return (
    <Tooltip
      title="Expand"
      placement="right"
      color="#0250a3"
      overlayInnerStyle={{ color: "#fff", fontWeight: 500, fontSize: 14 }}
    >
      <div className="mx-[16px] border-t border-light-divide-base dark:border-dark-divide-base mb-[8px]" />
      <div
        className="w-[40px] h-[32px] flex items-center justify-center mx-[8px] cursor-pointer hover:bg-[#b3d5f8] dark:hover:bg-[#012E5D] rounded-[5px]"
        onClick={toggleCollapsed}
      >
        <span className="text-light-input-text dark:text-dark-input-text rotate-180 flowzero-iconfont icon-arrow-chevron-nav-left-backward" />
      </div>
    </Tooltip>
  );
};

const SiderMenu = ({
  onCollapse,
}: {
  onCollapse?: (collapsed: boolean) => void;
}) => {
  const COLLEPSE_WIDTH = 56;
  const EXPAND_WIDTH = 232;
  const siderRef = React.useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [navData, setNavData] = useState<WorkflowNode[]>([]);
  const [pendingMap, setPendingMap] = useState<Record<string, number>>({});
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { bpmnStore: store } = useBPMNContext();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const navActiveKey = (() => {
    if (pathname === `${BASE_PATH}/assign-to-me`) {
      const params = new URLSearchParams(search);
      const wf = params.get("workflowName");
      const tn = params.get("taskName");
      const tk = params.get("taskKey");
      if (wf && tn && tk) return `${wf}__${tn}__${tk}`;
      if (wf) return wf;
      return "ASSIGN_TO_ME";
    }
    if (pathname === `${BASE_PATH}/assign-to-me/detail`) {
      return getMenuKeyFromPath(pathname, search, navData, MENU_CONFIG);
    }
    return null;
  })();

  // Auto-expand parent workflow when navigating to a task-level route (e.g. from chart click)
  // useEffect(() => {
  //   if (!navActiveKey) return;
  //   const parts = navActiveKey.split("__");
  //   if (parts.length === 3) {
  //     const workflowName = parts[0];
  //     setOpenKeys((prev) =>
  //       prev.includes(workflowName) ? prev : [...prev, workflowName]
  //     );
  //   }
  // }, [navActiveKey]);

  const toggleCollapsed = useCallback(() => {
    onCollapse?.(!collapsed);
    setCollapsed(!collapsed);
  }, [collapsed, onCollapse]);

  const fetchPendingMap = useCallback(
    (workflowName: string) => {
      getPendingDistribution({
        workflowName,
        scope: StatisticsScope.TASK_EXECUTOR,
      })
        .then((res) => {
          const map: Record<string, number> = {};
          for (const wf of res) {
            for (const task of wf.tasks ?? []) {
              map[task.taskKey] = (map[task.taskKey] ?? 0) + task.pendingCount;
            }
          }
          // reset all task in specipied workflow to 0 when res is [];
          const workflowNode = navData.find(
            (w) => w.workflowName === workflowName
          );
          const taskKeys = workflowNode?.tasks?.map((t) => t.taskKey) ?? [];
          setPendingMap((prev) => {
            const next = { ...prev };
            for (const key of taskKeys) {
              next[key] = 0;
            }
            return { ...next, ...map };
          });
        })
        .catch(() => {});
    },
    [navData]
  );

  const menuWidth = useMemo(() => {
    return collapsed ? COLLEPSE_WIDTH : EXPAND_WIDTH;
  }, [collapsed]);

  const menus: MenuItem[] = useMemo(() => {
    const staticMenus = MENU_CONFIG.map((group) => ({
      type: "group" as const,
      label: createGroupLabel(group.label, collapsed),
      children: group.items.map((item) =>
        createMenuItem(item, collapsed, pathname)
      ),
    }));

    const assignToMeSelected = navActiveKey === "ASSIGN_TO_ME";
    const assignToMeUrl = `${BASE_PATH}/assign-to-me?assigneeOnly=true`;
    const assignToMeItem: MenuItem = {
      key: "ASSIGN_TO_ME",
      className: "assign-to-me-item",
      icon: collapsed
        ? createNavigationLink(
            assignToMeUrl,
            "workflow-sidermenu-item-link",
            createMenuIcon("icon-briefcase"),
            assignToMeSelected
          )
        : createMenuIcon("icon-briefcase"),
      label: collapsed
        ? "Assigned to me"
        : createNavigationLink(
            assignToMeUrl,
            "workflow-sidermenu-item-link",
            "Assigned to me",
            assignToMeSelected
          ),
    };

    const navGroup = {
      type: "group" as const,
      label: createGroupLabel("To Do", collapsed),
      children: [
        assignToMeItem,
        ...navData.map((workflow) => {
          const collapseIcon = createNavigationLink(
            `${BASE_PATH}/assign-to-me?workflowName=${encodeURIComponent(
              workflow.workflowName
            )}&workflowIds=${encodeURIComponent(
              JSON.stringify([workflow.workflowIds])
            )}`,
            "workflow-sidermenu-item-link",
            createMenuIcon(
              "icon-network-system-flow-diagram-right transform rotate-90"
            ),
            navActiveKey === workflow.workflowName
          );
          return {
            key: workflow.workflowName,
            icon: collapsed
              ? collapseIcon
              : createMenuIcon(
                  "icon-network-system-flow-diagram-right transform rotate-90"
                ),
            label: collapsed ? (
              workflow.workflowName
            ) : (
              <TruncatedTooltip
                text={workflow.workflowName}
                className={cn(
                  "text-light-input-text dark:text-dark-text inline-block w-[136px] truncate align-middle",
                  navActiveKey === workflow.workflowName && "submenu-selected"
                )}
                onClick={() => {
                  store?.selectMenu(workflow.workflowName);
                  fetchPendingMap(workflow.workflowName);
                  navigate(
                    `${BASE_PATH}/assign-to-me?workflowName=${encodeURIComponent(
                      workflow.workflowName
                    )}&workflowIds=${encodeURIComponent(
                      JSON.stringify([workflow.workflowIds])
                    )}`
                  );
                }}
              />
            ),
            ...(collapsed
              ? {}
              : {
                  children: workflow?.tasks?.map((task) => {
                    const taskItemKey = `${workflow.workflowName}__${task.taskName}__${task.taskKey}`;
                    return {
                      key: taskItemKey,
                      label: (
                        <div className="justify-between flex items-center">
                          <TruncatedTooltip text={task.taskName} />
                          <span
                            className={cn(
                              "task-count-badge",
                              "w-[22px] h-[22px] shrink-0 rounded-full",
                              "inline-flex items-center justify-center leading-none text-xs mr-[5px]",
                              "bg-[#F2F2F2] dark:bg-[#1a3a5c] dark:text-dark-text"
                            )}
                          >
                            {pendingMap[task.taskKey] ?? 0}
                          </span>
                        </div>
                      ),
                    };
                  }),
                }),
          };
        }),
      ],
    };
    return [staticMenus[0], navGroup, ...staticMenus.slice(1)];
  }, [collapsed, pathname, navData, navActiveKey, navigate, store, pendingMap]);

  useEffect(() => {
    getWorkflowNavigation()
      .then((res) => {
        setNavData(res);
      })
      .catch((err) => {
        console.error("Failed to fetch workflow navigation:", err);
      });
  }, []);

  useEffect(() => {
    return navigationStore.onRefresh((workflowName) => {
      getWorkflowNavigation()
        .then((res) => {
          setNavData(res);
        })
        .catch((err) => {
          console.error("Failed to fetch workflow navigation:", err);
        });
      workflowName && fetchPendingMap(workflowName);
    });
  }, [fetchPendingMap]);

  return (
    <>
      <StyledSider
        ref={siderRef}
        width={menuWidth}
        className={cn(
          "workflow-siderbar bg-white",
          collapsed
            ? "w-[72px] min-w-[72px] max-w-[72px]"
            : "w-[240px] min-w-[240px] max-w-[240px]"
        )}
      >
        <ConfigProvider
          getPopupContainer={() => siderRef.current ?? document.body}
          theme={{
            components: {
              Menu: {
                itemSelectedBg: "#9AC7F6",
                itemSelectedColor: "#0250A3",
                iconSize: 16,
              },
            },
          }}
        >
          <div className="flex flex-col h-full workflow-siderbar__collapsed">
            <Logo
              className={cn(
                "flex items-center px-1 h-[32px]  pb-[8px] border-b box-content border-light-divide-base dark:border-dark-divide-base leading-[32px]",
                collapsed ? "mx-[8px] pt-[16px]" : "mx-[16px] pt-[16px]"
              )}
              collapsed={collapsed}
            />
            <div
              ref={(el) => {
                if (el) el.id = "sider-menu-scroll-container";
              }}
              className="overflow-y-auto overflow-x-hidden"
            >
              <Menu
                theme="light"
                inlineIndent={16}
                selectedKeys={
                  navActiveKey
                    ? [navActiveKey]
                    : [
                        getMenuKeyFromPath(
                          pathname,
                          search,
                          navData,
                          MENU_CONFIG
                        ) ||
                          (store?.menuSelected ?? ""),
                      ]
                }
                mode="inline"
                inlineCollapsed={collapsed}
                items={menus}
                openKeys={openKeys}
                onOpenChange={(keys) => {
                  const newlyOpened = keys.find((k) => !openKeys.includes(k));
                  if (newlyOpened) {
                    const workflowMatch = navData.find(
                      (w) => w.workflowName === newlyOpened
                    );
                    if (workflowMatch) {
                      store?.selectMenu(newlyOpened);
                      fetchPendingMap(newlyOpened);
                      navigate(
                        `${BASE_PATH}/assign-to-me?workflowName=${encodeURIComponent(
                          newlyOpened
                        )}&workflowIds=${encodeURIComponent(
                          JSON.stringify([workflowMatch.workflowIds])
                        )}`
                      );
                    }
                  }
                  setOpenKeys(keys as string[]);
                }}
                expandIcon={({ isOpen }) =>
                  collapsed ? null : (
                    <span
                      className={cn(
                        "flowzero-iconfont icon-arrow-chevron-nav-left-backward text-light-input-text dark:text-dark-input-text absolute !right-0",
                        isOpen ? "-rotate-90" : "rotate-180"
                      )}
                    />
                  )
                }
                onClick={({ key }) => {
                  store?.selectMenu(key);
                  const workflowMatch = navData.find(
                    (w) => w.workflowName === key
                  );
                  if (workflowMatch) {
                    navigate(
                      `${BASE_PATH}/assign-to-me?workflowName=${encodeURIComponent(
                        key
                      )}&workflowIds=${encodeURIComponent(
                        JSON.stringify([workflowMatch.workflowIds])
                      )}`
                    );
                    return;
                  }
                  const parts = key.split("__");
                  if (parts.length === 3) {
                    const parentWorkflow = navData.find(
                      (w) => w.workflowName === parts[0]
                    );
                    fetchPendingMap(parts[0]);
                    const workflowIdsParam = parentWorkflow
                      ? `&workflowIds=${encodeURIComponent(
                          JSON.stringify([parentWorkflow.workflowIds])
                        )}`
                      : "";
                    navigate(
                      `${BASE_PATH}/assign-to-me?workflowName=${encodeURIComponent(
                        parts[0]
                      )}&taskName=${encodeURIComponent(
                        parts[1]
                      )}&taskKey=${encodeURIComponent(
                        parts[2]
                      )}${workflowIdsParam}`
                    );
                  }
                }}
              />
            </div>
            {createToggleButton(collapsed, toggleCollapsed)}
          </div>
        </ConfigProvider>
      </StyledSider>
    </>
  );
};

export default memo(observer(SiderMenu));
