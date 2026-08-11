import { LitElement, PropertyValues } from 'lit';
import { localized } from '@lit/localize';
import { createContext, consume } from '@lit/context';
import { property, state } from 'lit/decorators.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { CUSTOM_EVENTS_TYPE, INTERNAL_EVENTS } from './sc-custom-events.js';
import { getGlobalMediaQuery, mediaQuery } from './mediaQuery.js';


const graphQLClientContext = createContext('sc-data-graphql-client-context');

const restClientContext = createContext('service-bench-rest-client-context');

const navigationContext: any = createContext('service-bench-navigation-context');

const userContext: any = createContext('service-bench-user-context');

const shellContext = createContext('service-bench-shell-context');

type TIE = typeof INTERNAL_EVENTS[keyof Omit<typeof INTERNAL_EVENTS, 'reverse'>];

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

// Given an event name string, get the type of the event
// type GetCustomEventType<T> = T extends keyof GlobalEventHandlersEventMap
//   ? GlobalEventHandlersEventMap[T] extends CustomEvent<unknown>
//     ? GlobalEventHandlersEventMap[T]
//     : CustomEvent<unknown>
//   : CustomEvent<unknown>;

// `keyof ValidEventTypeMap` is equivalent to `keyof GlobalEventHandlersEventMap` but gives a nicer error message
// type ValidEventTypeMap = EventTypesWithRequiredDetail | EventTypesWithoutRequiredDetail;


@localized()
// @ts-ignore
export default class ScExtElement extends ScopedElementsMixin(LitElement) {

  // Make localization attributes reactive
  @property() dir: string;
  @property() lang: string;
  @state() isMobile = false;

  @consume({ context: graphQLClientContext })
  @state()
  _graphQLClient: any;

  @consume({ context: restClientContext })
  @state()
  _restClient: any;

  @consume({ context: navigationContext })
  @state()
  _navigation: any;

  @consume({ context: userContext })
  @state()
  _user: any;

  @consume({ context: shellContext })
  @state()
  _shellClient: any;


  @mediaQuery(['desktop', 'mobileLg', 'mobileSm'], { waitAfterUpdate: true, shouldUpdate: true })
  handleMediaQueryChange(isDesktop: boolean, isMobileLg: boolean, isMobileSm: boolean) {
    if (isMobileLg || isMobileSm) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  startFirstMediaQuery(){
    const mq = getGlobalMediaQuery();
    if (mq) {
      this.handleMediaQueryChange(
        mq.desktop.matches,
        mq.mobileLg.matches,
        mq.mobileSm.matches
      );
    }
  }

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
