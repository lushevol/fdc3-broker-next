'use client';

import { memo, useCallback, useRef, useState } from 'react';
import { AlertCircleIcon, CheckIcon, ChevronDownIcon, LoaderIcon, XCircleIcon } from 'lucide-react';
import {
  useScrollLock,
  type ToolCallMessagePartStatus,
  type ToolCallMessagePartComponent,
} from '@assistant-ui/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const ANIMATION_DURATION = 200;

export type ToolFallbackRootProps = Omit<
  React.ComponentProps<typeof Collapsible>,
  'open' | 'onOpenChange'
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

function ToolFallbackRoot({
  className,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  ...props
}: ToolFallbackRootProps) {
  const collapsibleRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const lockScroll = useScrollLock(collapsibleRef, ANIMATION_DURATION);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        lockScroll();
      }
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      controlledOnOpenChange?.(open);
    },
    [lockScroll, isControlled, controlledOnOpenChange],
  );

  return (
    <Collapsible
      ref={collapsibleRef}
      data-slot="tool-fallback-root"
      open={isOpen}
      onOpenChange={handleOpenChange}
      className={cn(
        'aui-tool-fallback-root group/tool-fallback-root w-full rounded-lg border py-3',
        className,
      )}
      style={
        {
          '--animation-duration': `${ANIMATION_DURATION}ms`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Collapsible>
  );
}

type ToolStatus = ToolCallMessagePartStatus['type'];

type ToolArgsSummary = {
  primary?: string;
  secondary?: string;
};

function safeParseToolArgs(argsText?: string): Record<string, unknown> | null {
  if (!argsText) {
    return null;
  }

  try {
    const parsed = JSON.parse(argsText);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
}

function formatToolDateLabel(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function getToolArgsSummary(argsText?: string): ToolArgsSummary | null {
  const parsedArgs = safeParseToolArgs(argsText);

  if (!parsedArgs) {
    return null;
  }

  const primary =
    typeof parsedArgs.appName === 'string'
      ? parsedArgs.appName
      : typeof parsedArgs.appId === 'string'
        ? parsedArgs.appId
        : typeof parsedArgs.query === 'string'
          ? parsedArgs.query
          : undefined;
  const startLabel = formatToolDateLabel(parsedArgs.startTime);
  const endLabel = formatToolDateLabel(parsedArgs.endTime);

  return {
    primary,
    secondary: startLabel && endLabel ? `${startLabel} - ${endLabel}` : startLabel ?? endLabel ?? undefined,
  };
}

const statusIconMap: Record<ToolStatus, React.ElementType> = {
  running: LoaderIcon,
  complete: CheckIcon,
  incomplete: XCircleIcon,
  'requires-action': AlertCircleIcon,
};

function ToolFallbackTrigger({
  toolName,
  argsText,
  status,
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger> & {
  toolName: string;
  argsText?: string;
  status?: ToolCallMessagePartStatus;
}) {
  const statusType = status?.type ?? 'complete';
  const isRunning = statusType === 'running';
  const isCancelled = status?.type === 'incomplete' && status.reason === 'cancelled';
  const argsSummary = getToolArgsSummary(argsText);

  const Icon = statusIconMap[statusType];
  const label = isCancelled ? 'Cancelled tool' : 'Used tool';

  return (
    <CollapsibleTrigger
      data-slot="tool-fallback-trigger"
      className={cn(
        'aui-tool-fallback-trigger group/trigger flex w-full items-start gap-3 px-4 text-sm transition-colors',
        className,
      )}
      {...props}
    >
      <Icon
        data-slot="tool-fallback-trigger-icon"
        className={cn(
          'aui-tool-fallback-trigger-icon size-4 shrink-0',
          isCancelled && 'text-muted-foreground',
          isRunning && 'animate-spin',
        )}
      />
      <span
        data-slot="tool-fallback-trigger-label"
        className={cn(
          'aui-tool-fallback-trigger-label-wrapper relative inline-block grow text-left',
          isCancelled && 'text-muted-foreground line-through',
        )}
      >
        <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/85">
          {label}
        </span>
        <span className="mt-1 block text-sm font-semibold leading-5">{toolName}</span>
        <span className="mt-1.5 block text-xs text-muted-foreground">
          <b>{toolName}</b>
        </span>
        {argsSummary ? (
          <span className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium leading-4">
            {argsSummary.primary ? (
              <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-foreground shadow-sm">
                {argsSummary.primary}
              </span>
            ) : null}
            {argsSummary.secondary ? (
              <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-foreground shadow-sm">
                {argsSummary.secondary}
              </span>
            ) : null}
          </span>
        ) : null}
        {isRunning && (
          <span
            aria-hidden
            data-slot="tool-fallback-trigger-shimmer"
            className="aui-tool-fallback-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none"
          >
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em]">{label}</span>
              <span className="mt-1 block text-sm font-semibold leading-5">{toolName}</span>
            </span>
        )}
      </span>
      <ChevronDownIcon
        data-slot="tool-fallback-trigger-chevron"
        className={cn(
          'aui-tool-fallback-trigger-chevron size-4 shrink-0',
          'transition-transform duration-(--animation-duration) ease-out',
          'group-data-[state=closed]/trigger:-rotate-90',
          'group-data-[state=open]/trigger:rotate-0',
        )}
      />
    </CollapsibleTrigger>
  );
}

function ToolFallbackContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="tool-fallback-content"
      className={cn(
        'aui-tool-fallback-content relative overflow-hidden text-sm outline-none',
        'group/collapsible-content ease-out',
        'data-[state=closed]:animate-collapsible-up',
        'data-[state=open]:animate-collapsible-down',
        'data-[state=closed]:fill-mode-forwards',
        'data-[state=closed]:pointer-events-none',
        'data-[state=open]:duration-(--animation-duration)',
        'data-[state=closed]:duration-(--animation-duration)',
        className,
      )}
      {...props}
    >
      <div className="mt-4 flex flex-col gap-3 border-t border-border/70 px-4 pt-3">{children}</div>
    </CollapsibleContent>
  );
}

function ToolFallbackArgs({
  argsText,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  argsText?: string;
}) {
  if (!argsText) return null;

  return (
    <div
      data-slot="tool-fallback-args"
      className={cn('aui-tool-fallback-args', className)}
      {...props}
    >
      <p className="aui-tool-fallback-args-header text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Request
      </p>
      <pre className="aui-tool-fallback-args-value mt-2 overflow-x-auto rounded-xl border border-border/70 bg-muted/35 px-3 py-2.5 text-xs leading-6 whitespace-pre-wrap">
        {argsText}
      </pre>
    </div>
  );
}

function ToolFallbackResult({
  result,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  result?: unknown;
}) {
  if (result === undefined) return null;

  return (
    <div
      data-slot="tool-fallback-result"
      className={cn('aui-tool-fallback-result border-t border-dashed border-border/70 pt-3', className)}
      {...props}
    >
      <p className="aui-tool-fallback-result-header text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Response
      </p>
      <pre className="aui-tool-fallback-result-content mt-2 overflow-x-auto rounded-xl border border-border/70 bg-background/60 px-3 py-2.5 text-xs leading-6 whitespace-pre-wrap">
        {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

function ToolFallbackError({
  status,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  status?: ToolCallMessagePartStatus;
}) {
  if (status?.type !== 'incomplete') return null;

  const error = status.error;
  const errorText = error ? (typeof error === 'string' ? error : JSON.stringify(error)) : null;

  if (!errorText) return null;

  const isCancelled = status.reason === 'cancelled';
  const headerText = isCancelled ? 'Cancelled reason:' : 'Error:';

  return (
    <div
      data-slot="tool-fallback-error"
      className={cn('aui-tool-fallback-error', className)}
      {...props}
    >
      <p className="aui-tool-fallback-error-header text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {headerText}
      </p>
      <p className="aui-tool-fallback-error-reason mt-2 rounded-xl border border-border/70 bg-muted/35 px-3 py-2.5 text-sm text-muted-foreground">
        {errorText}
      </p>
    </div>
  );
}

const ToolFallbackImpl: ToolCallMessagePartComponent = ({ toolName, argsText, result, status }) => {
  const isCancelled = status?.type === 'incomplete' && status.reason === 'cancelled';

  return (
    <ToolFallbackRoot
      className={cn(
        'rounded-2xl border-border/70 bg-background/85 shadow-[0_18px_44px_-32px_rgba(15,23,42,0.55)] backdrop-blur-sm',
        isCancelled && 'border-muted-foreground/30 bg-muted/30',
      )}
    >
      <ToolFallbackTrigger toolName={toolName} argsText={argsText} status={status} />
      <ToolFallbackContent>
        <ToolFallbackError status={status} />
        <ToolFallbackArgs argsText={argsText} className={cn(isCancelled && 'opacity-60')} />
        {!isCancelled && <ToolFallbackResult result={result} />}
      </ToolFallbackContent>
    </ToolFallbackRoot>
  );
};

const ToolFallback = memo(ToolFallbackImpl) as unknown as ToolCallMessagePartComponent & {
  Root: typeof ToolFallbackRoot;
  Trigger: typeof ToolFallbackTrigger;
  Content: typeof ToolFallbackContent;
  Args: typeof ToolFallbackArgs;
  Result: typeof ToolFallbackResult;
  Error: typeof ToolFallbackError;
};

ToolFallback.displayName = 'ToolFallback';
ToolFallback.Root = ToolFallbackRoot;
ToolFallback.Trigger = ToolFallbackTrigger;
ToolFallback.Content = ToolFallbackContent;
ToolFallback.Args = ToolFallbackArgs;
ToolFallback.Result = ToolFallbackResult;
ToolFallback.Error = ToolFallbackError;

export {
  ToolFallback,
  ToolFallbackRoot,
  ToolFallbackTrigger,
  ToolFallbackContent,
  ToolFallbackArgs,
  ToolFallbackResult,
  ToolFallbackError,
};
