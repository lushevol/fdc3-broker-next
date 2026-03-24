export type TimeToolArgs = {
  locale: string;
};

export type TimeToolResult = {
  locale: string;
  timezone: string;
  formattedTime: string;
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

export async function executeTimeTool({ locale }: TimeToolArgs): Promise<TimeToolResult> {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  return {
    locale,
    timezone,
    formattedTime: new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: timezone,
    }).format(now),
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
