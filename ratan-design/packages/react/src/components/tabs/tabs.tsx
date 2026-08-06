import {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import {
  AriaButtonAdapter,
  AriaSeparatorAdapter,
  AriaTabAdapter,
  AriaTabListAdapter,
  AriaTabPanelAdapter,
  AriaTabsAdapter,
  useControllableState,
} from '@fm/ratan-design-foundation';

export const TAB_VARIANTS = ['filled', 'outline', 'segmented'] as const;
export type TabVariant = (typeof TAB_VARIANTS)[number];
export type TabsActivation = 'auto' | 'manual';
export type TabsAlignment = 'left' | 'center';

export interface TabsSelectionDetail {
  readonly key: string;
  readonly previousKey: string;
  readonly reason: 'selection' | 'programmatic';
}

export interface TabLifecycleDetail extends TabsSelectionDetail {
  readonly phase: 'select' | 'show' | 'hide';
}

export interface TabCloseDetail {
  readonly key: string;
  readonly reason: 'close-button';
}

export interface TabsHandle {
  readonly element: HTMLDivElement | null;
  show(panel: string): void;
  updateScrollControls(): void;
  hideClosedTab(): void;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  readonly selectedKey?: string;
  readonly defaultSelectedKey?: string;
  readonly onSelectionChange?: (key: string) => void;
  readonly onTabSelect?: (detail: TabLifecycleDetail) => void;
  readonly onTabShow?: (detail: TabLifecycleDetail) => void;
  readonly onTabHide?: (detail: TabLifecycleDetail) => void;
  readonly activation?: TabsActivation;
  readonly alignment?: TabsAlignment;
  readonly variant?: TabVariant;
  readonly showTabsBottomLine?: boolean;
  readonly orientation?: 'horizontal' | 'vertical';
  readonly children: ReactNode;
}

const TabsVariantContext = createContext<TabVariant>('outline');

export const Tabs = forwardRef<TabsHandle, TabsProps>(function Tabs(
  {
    selectedKey,
    defaultSelectedKey = '',
    onSelectionChange,
    onTabSelect,
    onTabShow,
    onTabHide,
    activation = 'auto',
    alignment = 'left',
    variant = 'outline',
    showTabsBottomLine = false,
    orientation = 'horizontal',
    className,
    children,
    ...props
  },
  forwardedRef,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selection = useControllableState({
    value: selectedKey,
    defaultValue: defaultSelectedKey,
    onChange: ({ value, previousValue, reason }) => {
      const selectionReason = reason === 'selection' ? 'selection' : 'programmatic';
      onSelectionChange?.(value);
      onTabSelect?.({ key: value, previousKey: previousValue, reason: selectionReason, phase: 'select' });
      if (previousValue) {
        onTabHide?.({ key: previousValue, previousKey: previousValue, reason: selectionReason, phase: 'hide' });
      }
      onTabShow?.({ key: value, previousKey: previousValue, reason: selectionReason, phase: 'show' });
    },
  });

  const requestSelection = (key: string, reason: 'selection' | 'programmatic') => {
    selection.setValue(key, reason);
  };

  useImperativeHandle(
    forwardedRef,
    () => ({
      element: rootRef.current,
      show: (panel) => requestSelection(panel, 'programmatic'),
      updateScrollControls: () => {
        rootRef.current
          ?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
          ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      },
      hideClosedTab: () => {
        const selected = [...(rootRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])]
          .find((tab) => tab.dataset.key === selection.value);
        if (selected) return;
        const firstTab = rootRef.current?.querySelector<HTMLElement>('[role="tab"]:not([aria-disabled="true"])');
        const firstKey = firstTab?.dataset.key;
        if (firstKey) requestSelection(firstKey, 'programmatic');
      },
    }),
    [selection.value],
  );

  return (
    <TabsVariantContext.Provider value={variant}>
      <AriaTabsAdapter
        {...props}
        ref={rootRef}
        selectedKey={selection.value || undefined}
        onSelectionChange={(key) => requestSelection(String(key), 'selection')}
        keyboardActivation={activation === 'auto' ? 'automatic' : 'manual'}
        orientation={orientation}
        className={className}
        data-ratan-component="Tabs"
        data-variant={variant}
        data-activation={activation}
        data-alignment={alignment}
        data-bottom-line={showTabsBottomLine}
        data-orientation={orientation}
      >
        {children}
      </AriaTabsAdapter>
    </TabsVariantContext.Provider>
  );
});

export interface TabListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly children: ReactNode;
}

export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { children, className, ...props },
  forwardedRef,
) {
  return (
    <AriaTabListAdapter
      {...props}
      ref={forwardedRef}
      className={className ? `ratan-tabs__list ${className}` : 'ratan-tabs__list'}
    >
      {children}
    </AriaTabListAdapter>
  );
});

export interface TabProps {
  readonly id?: string;
  readonly panel?: string;
  readonly children: ReactNode;
  readonly closable?: boolean;
  readonly closeLabel?: string;
  readonly onClose?: (detail: TabCloseDetail) => void;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly noActiveBottomLine?: boolean;
  readonly error?: boolean;
  readonly icon?: ReactNode;
  readonly counter?: number;
  readonly variant?: TabVariant;
  readonly className?: string;
}

export const Tab = forwardRef<HTMLDivElement, TabProps>(function Tab(
  {
    id,
    panel,
    children,
    closable = false,
    closeLabel,
    onClose,
    active = false,
    disabled = false,
    noActiveBottomLine = false,
    error = false,
    icon,
    counter,
    variant,
    className,
  },
  forwardedRef,
) {
  const key = id ?? panel;
  if (!key) throw new TypeError('Tab requires an id or legacy panel key.');
  const inheritedVariant = useContext(TabsVariantContext);
  const resolvedVariant = variant ?? inheritedVariant;
  const accessibleLabel = closeLabel ?? `Close ${typeof children === 'string' ? children : key}`;

  return (
    <AriaTabAdapter
      ref={forwardedRef}
      id={key}
      isDisabled={disabled}
      className={className ? `ratan-tabs__tab ${className}` : 'ratan-tabs__tab'}
      data-key={key}
      data-active={active}
      data-error={error}
      data-no-active-bottom-line={noActiveBottomLine}
      data-variant={resolvedVariant}
    >
      {icon ? <span className="ratan-tabs__icon">{icon}</span> : null}
      <span className="ratan-tabs__label">{children}</span>
      {counter !== undefined ? <span className="ratan-tabs__counter">{counter}</span> : null}
      {closable ? (
        <AriaButtonAdapter
          slot="close"
          className="ratan-tabs__close"
          aria-label={accessibleLabel}
          onPress={() => onClose?.({ key, reason: 'close-button' })}
        >
          <span aria-hidden="true">×</span>
        </AriaButtonAdapter>
      ) : null}
    </AriaTabAdapter>
  );
});

export interface TabPanelProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'id'> {
  readonly id?: string;
  readonly name?: string;
  readonly active?: boolean;
  readonly children: ReactNode;
}

export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { id, name, active = false, children, className, ...props },
  forwardedRef,
) {
  const key = id ?? name;
  if (!key) throw new TypeError('TabPanel requires an id or legacy name key.');
  return (
    <AriaTabPanelAdapter
      {...props}
      ref={forwardedRef}
      id={key}
      className={className ? `ratan-tabs__panel ${className}` : 'ratan-tabs__panel'}
      data-active={active}
    >
      {children}
    </AriaTabPanelAdapter>
  );
});

export const TabDivider = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function TabDivider({ className, ...props }, forwardedRef) {
    return (
      <AriaSeparatorAdapter
        {...props}
        ref={forwardedRef}
        className={className ? `ratan-tabs__divider ${className}` : 'ratan-tabs__divider'}
        data-ratan-component="TabDivider"
      />
    );
  },
);
