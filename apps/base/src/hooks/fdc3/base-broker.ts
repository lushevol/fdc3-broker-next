import type {
  AppIdentifier,
  AppIntent,
  Context,
  IntentHandler,
  IntentResolution,
  IntentResult,
  Listener,
} from '@finos/fdc3';
import { Subject } from 'rxjs';
import { authorizeIntent, getAllDeclaredIntents } from './app-directory';
import type { TileFullInfo } from './interfaces/dto';
import type { DeclaredIntent, IntentType } from './interfaces/types';
import { getExternalFDC3 } from './useExternalFDC3';
import type { Container } from '../model/workspaces';

type TaskResult = {
  status: 'processing' | 'completed' | 'failed';
  resolvedApp: {
    app: AppIdentifier;
    tileFullInfo: TileFullInfo;
  } | null;
  data?: IntentResult;
  message: string;
};

type Task = {
  id: string;
  intentRaiser?: AppIdentifier;
  intent: IntentType;
  result: TaskResult | null;
};

const generateId = () => {
  return `${Math.random().toString(36).substring(2, 15)}-${Math.random()
    .toString(36)
    .substring(2, 15)}`;
};

export class BaseFDC3Broker {
  private intentListeners: Map<
    string,
    Array<{
      id: string;
      timestamp: number;
      handler: IntentHandler;
      source?: AppIdentifier;
    }>
  > = new Map();
  private intentListenerEvents = new Subject<{
    id: string;
    intent: string;
    source?: AppIdentifier;
    event: 'add' | 'remove';
  }>();
  private tasks = new Subject<Task>();
  private declaredIntents: DeclaredIntent[] | null = null;

  private mfeWorkspaceOpenFile: (
    tile: {
      container: string;
      module: string;
      tile: string;
    },
    options?: {
      workspaceId?: string;
    },
  ) => Promise<{
    workspaceId?: string;
    newTile: boolean;
    opened: boolean;
    failedReason: string;
  }>;

  constructor() {
    console.log('[BaseFDC3Broker] Initializing broker...');
    this.getAllDeclaredIntents();
    this.proxyIntents();
  }

  async handleRaiseIntent(
    intent: string,
    context: Context,
    app?: AppIdentifier,
  ): Promise<IntentResolution> {
    console.log(
      `[BaseFDC3Broker] handleRaiseIntent called with intent: ${intent}, app: ${app?.appId}`,
    );
    const intentDirection = await this.checkIntentDirection(intent, context, app);
    console.log(`[BaseFDC3Broker] Intent direction: ${intentDirection}`);
    if (intentDirection === 'external') {
      return this.handleRaiseIntentToExternal(intent, context, app);
    } else {
      return this.handleRaiseIntentToInternal(intent, context, app);
    }
  }

  async handleRaiseIntentForContext(
    context: Context,
    app?: AppIdentifier,
  ): Promise<IntentResolution> {
    const appIntents = await this.findIntentsByContext(context);

    return this.handleRaiseIntent(appIntents.at(0)?.intent.name || '', context, app);
  }

  async findIntentsByContext(context: Context): Promise<Array<AppIntent>> {
    console.log(`[FMPTP FDC3] Client findIntentsByContext with context:`, context);
    const declaredIntents = await this.getAllDeclaredIntents();
    const targetIntents = declaredIntents.filter((intent) => intent.contextType === context.type);

    return targetIntents.map((intent) => ({
      intent: {
        // @Deprecated: displayName is deprecated in FDC3 2.1
        displayName: intent.intent,
        name: intent.intent,
      },
      apps: [
        {
          appId: intent.tileId,
        },
      ],
    }));
  }

  async handleRaiseIntentToInternal(
    intent: string,
    context: Context,
    app?: AppIdentifier,
  ): Promise<IntentResolution> {
    console.log(`[BaseFDC3Broker] handleRaiseIntentToInternal: ${intent}, app: ${app?.appId}`);
    const id = generateId();
    this.tasks.next({
      id,
      intent: {
        intent,
        context,
        app,
      },
      result: null,
    });

    const result = await this.getTaskResult(id);

    if (result.status === 'failed') {
      console.error(`[BaseFDC3Broker] Intent failed: ${result.message}`);
      throw new Error(result.message);
    }

    console.log(`[BaseFDC3Broker] Intent completed: ${intent}, result:`, result.data);
    return {
      source: result.resolvedApp?.app as AppIdentifier,
      intent,
      getResult: () => Promise.resolve(result.data!),
    };
  }

  async handleRaiseIntentToExternal(
    intent: string,
    context: Context,
    app?: AppIdentifier,
  ): Promise<IntentResolution> {
    console.log(`[BaseFDC3Broker] handleRaiseIntentToExternal: ${intent}, app: ${app?.appId}`);
    const externalFDC3 = getExternalFDC3();
    if (!externalFDC3) {
      throw new Error('External FDC3 is not available');
    }
    return externalFDC3.raiseIntent(intent, context, app);
  }

  addIntentListenerHandler(intent: string, handler: IntentHandler): Promise<Listener> {
    console.log(`[BaseFDC3Broker] Adding intent listener for: ${intent}`);
    const id = generateId();
    this.intentListeners.set(intent, [
      ...(this.intentListeners.get(intent) ?? []),
      { id, timestamp: Date.now(), handler },
    ]);
    this.intentListenerEvents.next({ id, intent, event: 'add' });

    return Promise.resolve({
      unsubscribe: () => {
        console.log(`[BaseFDC3Broker] Unsubscribing intent listener for: ${intent}`);
        const handlers = this.intentListeners.get(intent) ?? [];
        this.intentListeners.set(
          intent,
          handlers.filter((i) => i.id !== id),
        );
        this.intentListenerEvents.next({ id, intent, event: 'remove' });
        return Promise.resolve();
      },
    });
  }

  setOpenTile(openTile: typeof this.mfeWorkspaceOpenFile) {
    console.log('[BaseFDC3Broker] setOpenTile called');
    this.mfeWorkspaceOpenFile = openTile;
  }

  async checkIntentDirection(
    intent: string,
    context: Context,
    app?: AppIdentifier,
  ): Promise<'internal' | 'external'> {
    console.log(`[BaseFDC3Broker] checkIntentDirection: ${intent}`);
    if (
      intent.startsWith('scb.fmptp.') ||
      context.type.startsWith('scb.fmptp.') ||
      app?.appId?.startsWith('scb.fmptp.')
    ) {
      return 'internal';
    }

    return 'external';
  }

  async getAllDeclaredIntents() {
    if (!this.declaredIntents) {
      console.log('[BaseFDC3Broker] Fetching all declared intents...');
      const declaredIntents = await getAllDeclaredIntents();
      this.declaredIntents = declaredIntents.intents;
      console.log('[BaseFDC3Broker] Declared intents loaded.');
    }
    return this.declaredIntents;
  }

  private async handleOpenTile(task: Task): Promise<Task> {
    const { opened, workspaceId, newTile, failedReason } = await this.mfeWorkspaceOpenFile(
      task.result?.resolvedApp?.tileFullInfo as Container,
      {
        workspaceId:
          typeof task.intent.app === 'object' && task.intent.app.instanceId
            ? task.intent.app?.instanceId
            : undefined,
      },
    );
    if (opened) {
      console.log(
        `[BaseFDC3Broker] Tile opened workspace id ${workspaceId} with ${
          newTile ? 'new tile' : 'existing tile'
        }`,
      );

      if (task.result) {
        task.result.resolvedApp = {
          app: {
            appId: task.result?.resolvedApp?.app.appId as string,
            instanceId: workspaceId,
          },
          tileFullInfo: task.result?.resolvedApp?.tileFullInfo as TileFullInfo,
        };
      }
      return task;
    } else {
      // TODO: alert to user
      console.error(`[BaseFDC3Broker] Tile failed to open: ${failedReason}`);

      return {
        ...task,
        result: {
          status: 'failed',
          data: undefined,
          resolvedApp: null,
          message: `Tile failed to open: ${failedReason}`,
        },
      };
    }
  }

  private async proxyIntents() {
    this.tasks.subscribe(async (task) => {
      if (!task.result) {
        console.log(
          `[BaseFDC3Broker] proxyIntents: Processing task ${task.id} for intent ${task.intent.intent}`,
        );
        let processedTask = task;
        await this.validateLoginStatus(processedTask.intent.intent);
        processedTask = await this.validateIntent(processedTask);
        processedTask = await this.handleOpenTile(processedTask);
        processedTask = await this.publishIntentTillDone(processedTask);
        if (processedTask.result) {
          console.log(`[BaseFDC3Broker] Task result for ${task.id}:`, processedTask.result);
          this.tasks.next(processedTask);
        }
      }
    });
  }

  private async validateLoginStatus(intent: string): Promise<boolean> {
    console.log(`[BaseFDC3Broker] validateLoginStatus for intent: ${intent}`);
    const hasToken = sessionStorage.getItem('SET_TOKEN');
    if (hasToken) return true;
    else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.validateLoginStatus(intent);
    }
  }

  private async validateIntent(task: Task): Promise<Task> {
    const { intent, context, app } = task.intent;
    console.log(
      `[BaseFDC3Broker] validateIntent: ${intent}, app: ${
        typeof app === 'string' ? app : app?.appId
      }`,
    );

    const result = await authorizeIntent(intent, context, app);

    if (result.error) {
      console.error(`[BaseFDC3Broker] Intent authorization failed: ${result.errorMessage}`);
      return {
        ...task,
        result: {
          status: 'failed',
          data: undefined,
          resolvedApp: null,
          message: `[${result.error}] ${result.errorMessage}`,
        },
      };
    }

    if (result.tiles.length === 0) {
      console.warn(`[BaseFDC3Broker] No authorized apps found for intent: ${intent}`);
      return {
        ...task,
        result: {
          status: 'failed',
          data: undefined,
          resolvedApp: null,
          message: 'No authorized apps found for the intent',
        },
      };
    }

    console.log(`[BaseFDC3Broker] Intent authorized, resolved app: ${result.tiles.at(0)?.tile}`);
    return {
      ...task,
      result: {
        status: 'processing',
        resolvedApp: {
          app: {
            appId: result.tiles.at(0)?.tile ?? '',
          },
          tileFullInfo: result.tiles.at(0)!,
        },
        data: undefined,
        message: '',
      },
    };
  }

  private async publishIntentTillDone(task: Task, ts: number = Date.now()): Promise<Task> {
    if (task.intent.app) {
      const targetListener = (this.intentListeners.get(task.intent.intent) ?? []).find((i) => {
        return (
          i.source?.appId === task.intent.app!.appId &&
          i.source.instanceId === task.intent.app!.instanceId
        );
      });
      if (targetListener) {
        const res = await this.publishIntent(task, targetListener.id);
        return res;
      } else {
        console.error(
          `[BaseFDC3Broker] No target listener found for intent: ${task.intent.intent}`,
        );
        throw new Error('No target listener found for the specified app');
      }
    } else {
      const newAddedListenerId = await new Promise<string>((resolve) => {
        const unsubscribe = this.intentListenerEvents.subscribe((event) => {
          if (event.event === 'add' && event.intent === task.intent.intent) {
            unsubscribe.unsubscribe();
            resolve(event.id);
          }
          // TODO: handle timeout case
        });
      });
      const res = await this.publishIntent(task, newAddedListenerId);
      return res;
    }
  }

  private async publishIntent(task: Task, listenerId: string): Promise<Task> {
    if (task.result?.status === 'processing') {
      console.log(`[BaseFDC3Broker] publishIntent: ${task.intent.intent}`);
      const { handler } = (this.intentListeners.get(task.intent.intent) ?? []).find(
        (i) => i.id === listenerId,
      )!;
      return {
        ...task,
        result: {
          ...task.result,
          status: 'completed',
          data: await handler(task.intent.context),
        },
      };
    }

    return task;
  }

  private getTaskResult(id: string): Promise<TaskResult> {
    console.log(`[BaseFDC3Broker] getTaskResult: Waiting for result of task ${id}`);
    return new Promise<TaskResult>((resolve, reject) => {
      this.tasks.subscribe((task) => {
        if (task.id === id && task.result) {
          if (task.result.status === 'failed') {
            console.error(`[BaseFDC3Broker] getTaskResult: Task ${id} failed`);
            reject(task.result);
          } else if (task.result.status === 'completed') {
            console.log(`[BaseFDC3Broker] getTaskResult: Task ${id} completed`);
            resolve(task.result);
          }
        }
      });
    });
  }
}

export default new BaseFDC3Broker();
