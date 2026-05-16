import fdc3Definitions from '../../../../../fdc3/declarations/fdc3-definitions.json';
import contexts from '../../../../../fdc3/declarations/contexts.json';
import intents from '../../../../../fdc3/declarations/intents.json';
import workflows from '../../../../../fdc3/declarations/workflows.json';

type JsonObject = Record<string, unknown>;

type IntentDeclaration = {
  name: string;
  description?: string;
};

type ContextDeclaration = {
  description?: string;
  schema?: JsonObject;
  simples?: JsonObject[];
};

type ChatbotMetadata = {
  actionId?: string;
  title?: string;
  approvalTitle?: string;
  approvalBody?: string;
};

type IntentListener = {
  intent?: string;
  contexts?: string[];
  chatbot?: ChatbotMetadata;
};

type Fdc3AppDeclaration = {
  appId: string;
  interop?: {
    intents?: {
      listensFor?: IntentListener[];
    };
  };
};

type WorkflowDeclaration = {
  workflowId?: string;
  title?: string;
  description?: string;
};

export type Fdc3ChatActionDefinition = {
  id: string;
  title: string;
  description: string;
  approvalTitle: string;
  approvalBody: string;
  intent: string;
  contextType: string;
  defaultContext: JsonObject;
  argumentSchema: JsonObject;
  resultSchemaHint: JsonObject;
};

function getContextType(context: ContextDeclaration): string | undefined {
  const properties = context.schema?.properties;
  if (!properties || typeof properties !== 'object') {
    return undefined;
  }

  const typeProperty = (properties as JsonObject).type;
  if (!typeProperty || typeof typeProperty !== 'object') {
    return undefined;
  }

  const contextType = (typeProperty as JsonObject).const;
  return typeof contextType === 'string' ? contextType : undefined;
}

function getDefaultContext(context: ContextDeclaration): JsonObject | undefined {
  const [simple] = Array.isArray(context.simples) ? context.simples : [];
  return simple && typeof simple === 'object' ? simple : undefined;
}

function buildFallbackTitle(intentName: string, appId: string): string {
  return `${intentName} via ${appId}`;
}

export function getFdc3ChatActionDefinitions(): Fdc3ChatActionDefinition[] {
  const declaredIntents = intents as IntentDeclaration[];
  const declaredContexts = contexts as ContextDeclaration[];

  return (fdc3Definitions as Fdc3AppDeclaration[]).flatMap((app) => {
    const listeners = app.interop?.intents?.listensFor ?? [];

    return listeners.flatMap((listener) => {
      const chatbot = listener.chatbot;
      const intentName = listener.intent;
      const [contextType] = listener.contexts ?? [];

      if (!chatbot?.actionId || !intentName || !contextType) {
        return [];
      }

      const intent = declaredIntents.find((i) => i.name === intentName);
      const context = declaredContexts.find(
        (c) => c.description === contextType || getContextType(c) === contextType,
      );

      return [
        {
          id: chatbot.actionId,
          title: chatbot.title ?? buildFallbackTitle(intentName, app.appId),
          description: intent?.description ?? '',
          approvalTitle: chatbot.approvalTitle ?? chatbot.title ?? intentName,
          approvalBody: chatbot.approvalBody ?? intent?.description ?? '',
          intent: intentName,
          contextType,
          defaultContext: getDefaultContext(context ?? {}) ?? { type: contextType },
          argumentSchema: (context?.schema as JsonObject) ?? {},
          resultSchemaHint: (context?.schema as JsonObject) ?? {},
        },
      ];
    });
  });
}

export function getFdc3WorkflowCatalogDescription(): string {
  const declaredWorkflows = workflows as WorkflowDeclaration[];
  if (declaredWorkflows.length === 0) {
    return 'No declaration-backed FDC3 workflows are currently available.';
  }

  return declaredWorkflows
    .map(
      (workflow) =>
        `${workflow.workflowId}: ${workflow.description ?? workflow.title ?? ''}`,
    )
    .join(' ');
}
