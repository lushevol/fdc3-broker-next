import React from "react";
import {
  KeyboardDoubleArrowDown as KeyboardDoubleArrowDownIcon,
  KeyboardDoubleArrowUp as KeyboardDoubleArrowUpIcon,
} from "@mui/icons-material";
import MuiFab from "@mui/material/Fab";
import MuiStack, { type StackProps } from "@mui/material/Stack";
import { darken, styled } from "@mui/material/styles";
import { newStyleTokens } from "./tokens/webkit.js";

const COLLAPSED_HEIGHT = "49px";
const LEGACY_ACTION_OFFSET = "8px";
const LEGACY_ACTION_SIZE = "30px";
const LEGACY_END_PADDING = "56px";
const CLIP_TOLERANCE = 0.5;
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export const searchConditionContainerModeStyle = (mode: string) =>
  mode === "dark" ? "rgba(0, 0, 0, 1)" : "rgba(243, 243, 243, 1)";

export const searchConditionContainerBorderStyle = (mode: string) =>
  mode === "dark"
    ? "1px solid rgba(44, 63, 94, 1)"
    : "1px solid rgba(208, 208, 208, 1)";

const SearchConditionContainerRoot = styled(MuiStack)(({ theme }) => {
  const webkit = theme.ratan?.designGeneration === "webkit";

  return {
    position: "relative",
    backgroundColor: webkit
      ? newStyleTokens.color.surface
      : searchConditionContainerModeStyle(theme.palette.mode),
    padding: webkit ? newStyleTokens.spacing.small : theme.spacing(1),
    paddingBottom: webkit
      ? newStyleTokens.spacing.xsmall
      : theme.spacing(0.5),
    borderRadius: webkit ? newStyleTokens.radius.medium : theme.shape.borderRadius,
    border: webkit
      ? `1px solid ${newStyleTokens.color.border}`
      : searchConditionContainerBorderStyle(theme.palette.mode),
    paddingRight: webkit
      ? `calc(${newStyleTokens.spacing.xlarge} + ${newStyleTokens.spacing.large})`
      : LEGACY_END_PADDING,
    overflow: "hidden",
    "& .MuiFab-root": {
      position: "absolute",
      top: webkit ? newStyleTokens.spacing.small : LEGACY_ACTION_OFFSET,
      right: webkit ? newStyleTokens.spacing.small : LEGACY_ACTION_OFFSET,
      height: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      width: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      minHeight: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      minWidth: webkit ? newStyleTokens.spacing.xlarge : LEGACY_ACTION_SIZE,
      backgroundColor: webkit
        ? newStyleTokens.color.surfaceRaised
        : theme.palette.background.paper,
      color: webkit
        ? newStyleTokens.color.text
        : theme.palette.getContrastText(theme.palette.background.paper),
      boxShadow: webkit
        ? `0 0 ${newStyleTokens.spacing.small} 0 ${newStyleTokens.shadow.color}`
        : `0px 0px 8px 0px ${theme.palette.getContrastText(
            theme.palette.background.paper
          )}`,
      "&:hover": {
        backgroundColor: webkit
          ? newStyleTokens.color.surfaceSelected
          : darken(theme.palette.background.paper, 0.5),
        color: webkit
          ? newStyleTokens.color.text
          : theme.palette.getContrastText(
              darken(theme.palette.background.paper, 0.5)
            ),
      },
    },
  };
});

export const SearchConditionContainer = /*#__PURE__*/ React.forwardRef<
  HTMLDivElement,
  StackProps
>(function SearchConditionContainer(
  {
    id,
    spacing: _spacing,
    direction: _direction,
    useFlexGap: _useFlexGap,
    children,
    ...rest
  },
  ref
) {
  const [expanded, setExpanded] = React.useState(false);
  const generatedId = React.useId();
  const containerId = id ?? `ratan-search-conditions-${generatedId}`;
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const actionRef = React.useRef<HTMLButtonElement | null>(null);
  const managedItems = React.useRef(
    new Map<HTMLElement, { ariaHidden: string | null; inert: string | null }>()
  );

  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement);

  const restoreItem = React.useCallback((item: HTMLElement) => {
    const previous = managedItems.current.get(item);
    if (!previous) return;

    if (previous.ariaHidden === null) item.removeAttribute("aria-hidden");
    else item.setAttribute("aria-hidden", previous.ariaHidden);
    if (previous.inert === null) item.removeAttribute("inert");
    else item.setAttribute("inert", previous.inert);
    managedItems.current.delete(item);
  }, []);

  const syncCollapsedItems = React.useCallback(() => {
    const root = rootRef.current;
    const action = actionRef.current;
    if (!root || !action) return;

    const items = Array.from(root.children).filter(
      (element): element is HTMLElement =>
        element !== action && element instanceof HTMLElement
    );
    const itemSet = new Set(items);
    for (const managed of managedItems.current.keys()) {
      if (!itemSet.has(managed)) restoreItem(managed);
    }

    const rootBounds = root.getBoundingClientRect();
    for (const item of items) {
      const itemBounds = item.getBoundingClientRect();
      const clipped =
        !expanded &&
        (itemBounds.top < rootBounds.top - CLIP_TOLERANCE ||
          itemBounds.bottom > rootBounds.bottom + CLIP_TOLERANCE);

      if (!clipped) {
        restoreItem(item);
        continue;
      }

      if (item.contains(document.activeElement)) action.focus();
      if (!managedItems.current.has(item)) {
        managedItems.current.set(item, {
          ariaHidden: item.getAttribute("aria-hidden"),
          inert: item.getAttribute("inert"),
        });
      }
      item.setAttribute("aria-hidden", "true");
      item.setAttribute("inert", "");
    }
  }, [expanded, restoreItem]);

  useIsomorphicLayoutEffect(() => {
    syncCollapsedItems();
    const root = rootRef.current;
    const observer =
      root && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(syncCollapsedItems)
        : undefined;
    if (root && observer) {
      observer.observe(root);
      for (const item of Array.from(root.children)) observer.observe(item);
    }
    const mutationObserver =
      root && typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            if (observer) {
              for (const item of Array.from(root.children)) observer.observe(item);
            }
            syncCollapsedItems();
          })
        : undefined;
    if (root && mutationObserver) {
      mutationObserver.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    window.addEventListener("resize", syncCollapsedItems);

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", syncCollapsedItems);
      for (const item of Array.from(managedItems.current.keys())) {
        restoreItem(item);
      }
    };
  }, [children, restoreItem, syncCollapsedItems]);

  const handleFab = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.focus();
    setExpanded((current) => !current);
  };

  return (
    <SearchConditionContainerRoot
      id={containerId}
      ref={rootRef}
      spacing={1}
      direction="row"
      useFlexGap
      sx={{ flexWrap: "wrap" }}
      {...rest}
      style={{ height: expanded ? "auto" : COLLAPSED_HEIGHT }}
    >
      {children}
      <MuiFab
        ref={actionRef}
        color="primary"
        aria-label={expanded ? "Collapse search criteria" : "Expand search criteria"}
        aria-controls={containerId}
        aria-expanded={expanded}
        size="small"
        onClick={handleFab}
        data-testid="SearchConditionContainer-fab"
      >
        {expanded ? (
          <KeyboardDoubleArrowUpIcon />
        ) : (
          <KeyboardDoubleArrowDownIcon />
        )}
      </MuiFab>
    </SearchConditionContainerRoot>
  );
});
