import { makeAutoObservable, reaction } from "mobx";

class NavigationStore {
  refreshTick = 0;
  refreshWorkflowName: string | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  triggerRefresh(workflowName?: string) {
    this.refreshWorkflowName = workflowName;
    this.refreshTick += 1;
  }

  onRefresh(callback: (workflowName: string | undefined) => void): () => void {
    return reaction(
      () => this.refreshTick,
      () => callback(this.refreshWorkflowName)
    );
  }
}

export const navigationStore = new NavigationStore();
