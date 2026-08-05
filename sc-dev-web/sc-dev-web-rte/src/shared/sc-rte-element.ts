import { LitElement } from 'lit';
import { createContext, consume } from '@lit/context';
import { localized } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { property, state } from 'lit/decorators.js';
import { CUSTOM_EVENTS_TYPE, INTERNAL_EVENTS } from './sc-custom-events.js';
type TIE = typeof INTERNAL_EVENTS[keyof Omit<typeof INTERNAL_EVENTS, 'reverse'>];

const graphQLClientContext = createContext('sc-data-graphql-client-context');
const storageClientContext = createContext('service-bench-storage-client-context');
const restClientContext = createContext('service-bench-rest-client-context');
/* eslint-disable */

// Match event type name strings that are registered on GlobalEventHandlersEventMap...
type EventTypeRequiresDetail<T> = T extends keyof GlobalEventHandlersEventMap
  ? // ...where the event detail is an object...
    GlobalEventHandlersEventMap[T] extends CustomEvent<
      Record<PropertyKey, unknown>
    >
    ? // ...that is non-empty...
      GlobalEventHandlersEventMap[T] extends CustomEvent<
        Record<PropertyKey, never>
      >
      ? never
      : // ...and has at least one non-optional property
      Partial<
          GlobalEventHandlersEventMap[T]["detail"]
        > extends GlobalEventHandlersEventMap[T]["detail"]
      ? never
      : T
    : never
  : never;

// // The inverse of the above (match any type that doesn't match EventTypeRequiresDetail)
type EventTypeDoesNotRequireDetail<T> =
  T extends keyof GlobalEventHandlersEventMap
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<
        Record<PropertyKey, unknown>
      >
      ? GlobalEventHandlersEventMap[T] extends CustomEvent<
          Record<PropertyKey, never>
        >
        ? T
        : Partial<
            GlobalEventHandlersEventMap[T]["detail"]
          > extends GlobalEventHandlersEventMap[T]["detail"]
        ? T
        : never
      : T
    : T;

// `keyof EventTypesWithRequiredDetail` lists all registered event types that require detail
type EventTypesWithRequiredDetail = {
  [EventType in keyof GlobalEventHandlersEventMap as EventTypeRequiresDetail<EventType>]: true;
};

// `keyof EventTypesWithoutRequiredDetail` lists all registered event types that do NOT require detail
type EventTypesWithoutRequiredDetail = {
  [EventType in keyof GlobalEventHandlersEventMap as EventTypeDoesNotRequireDetail<EventType>]: true;
};

// Helper to make a specific property of an object non-optional
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Given an event name string, get a valid type for the options to initialize the event that is more restrictive than
// just CustomEventInit when appropriate (validate the type of the event detail, and require it to be provided if the
// event requires it)
export type ScEventInit<T> = T extends keyof GlobalEventHandlersEventMap
  ? GlobalEventHandlersEventMap[T] extends CustomEvent<
      Record<PropertyKey, unknown>
    >
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<
        Record<PropertyKey, never>
      >
      ? CustomEventInit<GlobalEventHandlersEventMap[T]["detail"]>
      : Partial<
          GlobalEventHandlersEventMap[T]["detail"]
        > extends GlobalEventHandlersEventMap[T]["detail"]
      ? CustomEventInit<GlobalEventHandlersEventMap[T]["detail"]>
      : WithRequired<
          CustomEventInit<GlobalEventHandlersEventMap[T]["detail"]>,
          "detail"
        >
    : CustomEventInit
  : CustomEventInit;

@localized()
export default class ScRteElement extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
  }

  // Make localization attributes reactive
  @property() dir: string;
  @property() lang: string;

  @consume({ context: graphQLClientContext })
  @state()
  _graphQLClient: any;

  @consume({ context: storageClientContext })
  @state()
  _storageClient: any;

  @consume({ context: restClientContext })
  @state()
  _restClient: any;

  emit<T extends string & keyof CUSTOM_EVENTS_TYPE>(name: T, options?: ScEventInit<T> | undefined): void {
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: false,
      composed: false,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);
    return event as any;
  }
  
  internalEmit<T extends TIE>(name: T, options?: ScEventInit<T>) {
    const event = new CustomEvent(name, {
      bubbles: false,
      cancelable: false,
      composed: false,
      detail: {},
      ...options,
    });

    this.dispatchEvent(event);
  }

  stopDefaultEvent(event: Event) {
    event.stopPropagation();
  }
}
