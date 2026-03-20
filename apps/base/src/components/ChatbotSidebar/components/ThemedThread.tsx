import React from 'react';
import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  type DataMessagePartProps,
  type ToolCallMessagePartProps,
} from '@assistant-ui/react';
import { ArrowUpward, SmartToyOutlined } from '@mui/icons-material';
import { ToolCallRenderer } from './ToolCallRenderer';
import { GenerativeUIRenderer } from './GenerativeUIRenderer';

const UserMessage: React.FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-[44rem] justify-end px-2 py-3">
      <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-2.5 text-sm text-foreground">
        <MessagePrimitive.Content />
      </div>
    </div>
  );
};

const AssistantMessage: React.FC = () => {
  const ToolPart: React.FC<
    ToolCallMessagePartProps<Record<string, unknown>, unknown> & {
      requiresConfirmation?: boolean;
      error?: string;
    }
  > = ({ toolCallId, toolName, args, result, isError, error, interrupt, requiresConfirmation }) => (
    <ToolCallRenderer
      toolCallId={toolCallId}
      toolName={toolName}
      args={args}
      result={result}
      isError={isError}
      error={error}
      requiresConfirmation={requiresConfirmation || interrupt?.type === 'human'}
    />
  );

  const GenerativeUIPart: React.FC<
    DataMessagePartProps<{ componentName: string; props: Record<string, unknown> }>
  > = ({ data }) => <GenerativeUIRenderer componentName={data.componentName} props={data.props} />;

  return (
    <div className="mx-auto w-full max-w-[44rem] px-2 py-3">
      <div className="rounded-2xl bg-background px-2 text-sm leading-relaxed text-foreground">
        <MessagePrimitive.Parts
          components={{
            tools: { Override: ToolPart },
            data: {
              by_name: {
                'generative-ui': GenerativeUIPart,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-[44rem] flex-1 flex-col justify-center px-4 py-8">
      <div className="flex items-center gap-3 text-foreground">
        <SmartToyOutlined className="text-muted-foreground" fontSize="large" />
        <div>
          <h2 className="text-2xl font-semibold">Hello there!</h2>
          <p className="mt-1 text-base text-muted-foreground">How can I help you today?</p>
        </div>
      </div>
    </div>
  );
};

export const ThemedThread: React.FC = () => {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-1 flex-col bg-background">
      <ThreadPrimitive.Viewport className="flex flex-1 flex-col overflow-y-auto px-4 pt-4">
        <ThreadPrimitive.Empty>
          <EmptyState />
        </ThreadPrimitive.Empty>
        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

export const ThemedComposer: React.FC = () => {
  return (
    <div className="border-t border-border bg-background px-4 py-4">
      <ComposerPrimitive.Root className="mx-auto flex w-full max-w-[44rem] flex-col">
        <div className="flex items-end gap-2 rounded-[24px] border border-border bg-background p-2 shadow-sm">
          <ComposerPrimitive.Input
            placeholder="Send a message..."
            aria-label="Message input"
            className="min-h-10 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground/80"
          />
          <ComposerPrimitive.Send asChild>
            <button
              type="button"
              aria-label="Send message"
              className="inline-flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90"
            >
              <ArrowUpward fontSize="small" />
            </button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </div>
  );
};

export default ThemedThread;
