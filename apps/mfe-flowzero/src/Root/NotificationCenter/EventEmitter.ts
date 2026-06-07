type Handler<T> = (value: T) => void;

export class EventEmitter<T> {
  private _handlersByName: { [event in keyof T]?: Set<Handler<T[event]>> };

  constructor() {
    this._handlersByName = {};
  }

  emit<K extends keyof T>(name: K, value: T[K]): void {
    try {
      const handlers = this._handlersByName[name];
      if (handlers) {
        handlers.forEach((h) => h(value));
      }
    } catch (error) {}
  }

  disposableOn<K extends keyof T>(
    name: K,
    callback: Handler<T[K]>
  ): () => void {
    this.on(name, callback);
    return () => {
      this.off(name, callback);
    };
  }

  on<K extends keyof T>(name: K, callback: Handler<T[K]>): void {
    let handlers = this._handlersByName[name];
    if (!handlers) {
      this.onFirstSubscriptionAdded(name);
      this._handlersByName[name] = handlers = new Set();
    }
    handlers.add(callback);
  }

  off<K extends keyof T>(name: K, callback?: Handler<T[K]>): void {
    const handlers = this._handlersByName[name];
    if (handlers) {
      if (callback) handlers.delete(callback);
      if (handlers.size === 0) {
        delete this._handlersByName[name];
        this.onLastSubscriptionRemoved(name);
      }
    }
  }

  onFirstSubscriptionAdded<K extends keyof T>(name: K): void {}

  onLastSubscriptionRemoved<K extends keyof T>(name: K): void {}
}
