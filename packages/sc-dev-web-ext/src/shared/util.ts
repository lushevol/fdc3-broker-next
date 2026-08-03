export const debounce = (fn: (...args: any) => any, wait: number) => {
  let timeout: number | null = null;
  return function (...args: any[]) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    // @ts-ignore
    timeout = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, wait);
  };
};

export function throttle<T extends (...args: any) => any>(
  fn: T,
  context: any,
  wait: number
) {
  let inThrottle: boolean, id: number | undefined;
  return Object.assign(function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      id = window.setTimeout(() => inThrottle = false, wait);
    }
  }, {
    clear() {
      inThrottle = false;
      if (id) clearTimeout(id);
      id = undefined;
    },
  });
}


export const formatOpt = (employee:any) => {
  return {
    ...employee,
    phone: employee?.phone?.phone,
    location: employee?.address?.city,
    department: employee?.departmentEntity?.description,
    value: `${employee.id}`,
  };
};


export const uniqueOption = <T extends object>(initOpt: T[], key: string): T[] => {
  const uniqueObj: Record<string, boolean> = {};
  const result: T[] = [];
  for (const obj of initOpt) {
    if (!uniqueObj[(obj as any)[key]]) {
      uniqueObj[(obj as any)[key]] = true;
      result.push(obj);
    }
  }
  return result;
};

export interface EMPLOYEE_CARD_DETAILS {
  mode?: string;
  data?: any;
  hideActions?: boolean;
  noTooltip?: boolean;
  type?: string;
  vertical?: boolean;
  link?: boolean;
  transparent?: boolean;
  disabled?: boolean;
  additionalInfoLink?: boolean;
  readonly?: boolean;
  stopEvent?: boolean;
  suggestedPeople?: boolean;
  suggestedId?: string;
  suggestedPinned?: boolean;
}

export interface LOCATION {
  value: string;
  name: string;
}

export enum CALENDAR_VIEW {
  default = 'default',
  list = 'list',
  'multi-month' = 'multi-month',
  continuous = 'continuous'
}

export interface CALENDAR_EVENT {
  id: string;
  title: string | undefined;
  start: string | undefined;
  end: string | undefined;
  allDay: boolean | undefined;
  extendedProps?: {
    calendarSource?: {
      source?: string;
      name?: string;
      isDefault?: boolean;
    }
    attendees?: string[] | undefined;
    reminder?: string;
    eventType?: string;
    sensitivity?: string;
    details?: string;
    createdDateTime?: string;
    lastModifiedDateTime?: string;
    changeKey?: string;
    categories?: string[];
    transactionId?: string;
    originalStartTimeZone?: string;
    originalEndTimeZone?: string;
    iCalUId?: string;
    reminderMinutesBeforeStart?: number;
    isReminderOn?: boolean;
    hasAttachments?: boolean;
    importance?: string;
    isCancelled?: boolean;
    isOrganizer?: boolean;
    responseRequested?: boolean;
    seriesMasterId?: string | null;
    showAs?: string;
    type?: string;
    webLink?: string;
    onlineMeetingUrl?: string | null;
    isOnlineMeeting?: boolean;
    onlineMeetingProvider?: string;
    allowNewTimeProposals?: boolean;
    isDraft?: boolean;
    hideAttendees?: boolean;
    responseStatus?: {
      response?: string;
      time?: string;
    };
    body?: {
      contentType?: string;
      content?: string;
    };
    location?: {
      displayName?: string;
      locationType?: string;
      uniqueId?: string;
      uniqueIdType?: string;
    };
    locations?: {
      displayName?: string;
      locationType?: string;
      uniqueId?: string;
      uniqueIdType?: string;
    }[];
    organizer?: {
      emailAddress?: {
        name?: string;
        address?: string;
      };
    };
    onlineMeeting?: {
      joinUrl?: string;
    };
    recurrenceDetails?: {
      pattern: {
        type: string; 
        interval: number;
      };
      range: {
        type: string;
        startDate: string;
        endDate: string;
        recurrenceTimeZone: string;
      };
    };
    [key: string]: any;
  };
  rrule?: {
    freq: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval?: number;
    byweekday?: string[];
    bysetpos?: number | number[];
    bymonth?: number | number[];
    dtstart?: string;
    until?: string;
    count?: number;
  };
  duration?: string; 
  backgroundColor?: string; 
  borderColor?: string; 
  textColor?: string;
}

export interface CALENDAR_DAY_HEADER_CONTENT {
  date: Date;
  text: string;
}

const debouncerQueue = new Set<Debouncer>();
export class Debouncer {
  static debounce(debouncer: any, asyncModule: any, callback: () => void) {
    if (debouncer instanceof Debouncer) {
      debouncer._cancelAsync();
    } else {
      // eslint-disable-next-line no-param-reassign
      debouncer = new Debouncer();
    }
    debouncer.setConfig(asyncModule, callback);
    return debouncer;
  }
  private _asyncModule: any;
  private _callback: () => void;
  private _timer: number | null;

  constructor() {
  }

  setConfig(asyncModule: any, callback: () => void) {
    this._asyncModule = asyncModule;
    this._callback = callback;
    this._timer = this._asyncModule.run(() => {
      this._timer = null;
      debouncerQueue.delete(this);
      this._callback();
    });
  }

  cancel() {
    if (this.isActive()) {
      this._cancelAsync();
      debouncerQueue.delete(this);
    }
  }

  _cancelAsync() {
    if (this.isActive()) {
      this._asyncModule.cancel(/** @type {number} */ this._timer);
      this._timer = null;
    }
  }

  flush() {
    if (this.isActive()) {
      this.cancel();
      this._callback();
    }
  }

  isActive() {
    return this._timer !== null;
  }
}

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type ScEventInit<T> = T extends keyof GlobalEventHandlersEventMap
  ? GlobalEventHandlersEventMap[T] extends CustomEvent<
      Record<PropertyKey, unknown>
    >
    ? GlobalEventHandlersEventMap[T] extends CustomEvent<
        Record<PropertyKey, never>
      >
      ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>
      : Partial<
          GlobalEventHandlersEventMap[T]['detail']
        > extends GlobalEventHandlersEventMap[T]['detail']
      ? CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>
      : WithRequired<
          CustomEventInit<GlobalEventHandlersEventMap[T]['detail']>,
          'detail'
        >
    : CustomEventInit
  : CustomEventInit;

export const locales = {
  en: 'English',
  'zh-CN': '中文 (简体)',
};

export enum IMAGE_POSITION {
    left = 'left',
    right = 'right',
    background = 'background',
}
export enum DIRECTION {
  horizontal = 'horizontal',
  vertical = 'vertical',
}
export enum TEXT_SIZE {
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}

export enum SIZE {
  none = 'none',
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl'
}

export enum TEXT_ALIGN {
  left = 'left',
  center = 'center',
  right = 'right',
  justify = 'justify',
}

export enum VERTICAL_ALIGN {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}
export enum TAG_TYPE {
  disabled = 'disabled',
  primary = 'primary',
  success = 'success',
  warning = 'warning', 
  error = 'error',
  transparent = 'transparent',
  blue = 'blue',
  'dark-blue' = 'dark-blue',
  red = 'red',
  amber = 'amber',
  green = 'green',
  grey = 'grey',
  black = 'black',
  white = 'white',
  greydash = 'grey-dash',
}
export interface TAG_ATTRIBUTES {
  type: TAG_TYPE;
  iconName: string;
  content: string;
}

export interface CARD_SUPPLEMENTARY_ATTRIBUTES {
  iconName: string;
  details: string;
}

export enum ICON_SIZE {
  xxs = 'xxs',
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}