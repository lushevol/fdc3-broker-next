import { LitElement } from 'lit';
import { localized } from '@lit/localize';
import { createContext, consume } from '@lit/context';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { property, state } from 'lit/decorators.js';
import { CUSTOM_EVENTS_TYPE, INTERNAL_EVENTS } from './sc-custom-events.js';
import { createMediaQuery, getGlobalMediaQuery } from './mediaQuery.js';

const analyticsContext = createContext('service-bench-analytics-context');

type TIE = typeof INTERNAL_EVENTS[keyof Omit<typeof INTERNAL_EVENTS, 'reverse'>];

type PublishEvent = (eventName: string, parameters: object) => void;

type ANALYTICS_CONTEXT = {
  publishEvent: PublishEvent;
}

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
export default class ScElement extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();

    // window.addEventListener(LOCALE_STATUS_EVENT, ({detail}) => {
    //   this.emit('sc-locale-status', {
    //     detail: {
    //       ...detail,
    //     },
    //   });
    // });
  }

  // @ts-ignore
  @consume({ context: analyticsContext, subscribe: true })
  @state()
  _analytics: ANALYTICS_CONTEXT;

  get mediaQuery() {
    // fallback to create localized mediaQuery when used outside of DOM (ie testing)
    return getGlobalMediaQuery() ?? createMediaQuery(this);
  }
  get isSmallMobile() {
    return this.mediaQuery.mobileSm.matches;
  }
  get isLargeMobile() {
    return this.mediaQuery.mobileLg.matches;
  }
  get isMobile() {
    return this.isSmallMobile || this.isLargeMobile;
  }
  get isTablet() {
    return this.mediaQuery.tablet.matches;
  }
  get isDesktop() {
    return this.mediaQuery.desktop.matches;
  }
  get isPortrait() {
    return this.mediaQuery.portrait.matches;
  }

  // Make localization attributes reactive
  @property() dir: string;
  @property() lang: string;

  /** Emits a custom event with more convenient defaults. */
  // emit<T extends string & keyof EventTypesWithoutRequiredDetail>(
  //   name: EventTypeDoesNotRequireDetail<T>,
  //   options?: ScEventInit<T> | undefined
  // ): GetCustomEventType<T>;
  // emit<T extends string & keyof EventTypesWithRequiredDetail>(
  //   name: EventTypeRequiresDetail<T>,
  //   options: ScEventInit<T>
  // ): GetCustomEventType<T>;
  // emit<T extends string & keyof ValidEventTypeMap>(
  //   name: T,
  //   options?: ScEventInit<T> | undefined
  // ): GetCustomEventType<T> {
  //   const event = new CustomEvent(name, {
  //     bubbles: true,
  //     cancelable: false,
  //     composed: true,
  //     detail: {},
  //     ...options,
  //   });

  //   this.dispatchEvent(event);

  //   return event as GetCustomEventType<T>;
  // }

  emit<T extends string & keyof CUSTOM_EVENTS_TYPE>(
    name: T,
    options?: ScEventInit<T> | undefined
  ): void {
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
    // event.preventDefault();
    event.stopPropagation();
  }
}


