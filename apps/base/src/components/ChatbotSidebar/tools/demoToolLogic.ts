export type TimeToolArgs = {
  locale?: string;
  timezone?: string;
};

export type TimeToolResult = {
  locale?: string;
  timezone: string;
  formattedTime?: string;
  formatted?: string;
  __assistantUiGenerativeUi?: {
    componentName?: string;
    props?: Record<string, unknown>;
  };
};

export type StatusCardArgs = {
  title: string;
  tone: 'success' | 'warning' | 'info';
};

export type StatusCardResult = {
  title: string;
  message: string;
  tone: 'success' | 'warning' | 'info';
  generatedAt: string;
};

export type WorkspaceAnnouncementArgs = {
  title: string;
  audience: string;
  summary: string;
};

export type WorkspaceAnnouncementResult = {
  approved: boolean;
  audience: string;
  title: string;
  summary: string;
  reviewedAt: string;
  reviewer: string;
};

export async function executeTimeTool({ locale }: TimeToolArgs): Promise<TimeToolResult> {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const resolvedLocale = locale ?? 'en-US';
  const formattedTime = new Intl.DateTimeFormat(resolvedLocale, {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: timezone,
  }).format(now);

  return {
    locale: resolvedLocale,
    timezone,
    formattedTime,
    formatted: formattedTime,
  };
}

export async function executeStatusCardTool({
  title,
  tone,
}: StatusCardArgs): Promise<StatusCardResult> {
  return {
    title,
    tone,
    message:
      tone === 'success'
        ? 'All systems operational'
        : tone === 'warning'
          ? 'Attention needed in one monitored area'
          : 'Status generated successfully',
    generatedAt: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

export function createWorkspaceAnnouncementDecision(
  args: WorkspaceAnnouncementArgs,
  approved: boolean,
): WorkspaceAnnouncementResult {
  return {
    approved,
    audience: args.audience,
    title: args.title,
    summary: args.summary,
    reviewedAt: new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    reviewer: 'Operator',
  };
}
