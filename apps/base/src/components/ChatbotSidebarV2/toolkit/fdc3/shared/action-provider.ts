import {
  getFdc3ChatActionDefinitions,
  type Fdc3ChatActionDefinition,
} from './declarations';

export type Fdc3ChatActionProvider = {
  listActions(): Promise<Fdc3ChatActionDefinition[]>;
  resolveAction(actionId: string): Promise<Fdc3ChatActionDefinition | undefined>;
};

export function createDeclarationBackedFdc3ActionProvider(): Fdc3ChatActionProvider {
  const actions = getFdc3ChatActionDefinitions();

  return {
    async listActions() {
      return actions;
    },
    async resolveAction(actionId: string) {
      return actions.find((action) => action.id === actionId);
    },
  };
}
