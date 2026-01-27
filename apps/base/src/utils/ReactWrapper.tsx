import {
  type ComponentType,
  createElement,
  createRef,
  forwardRef,
  type MutableRefObject,
  type RefObject,
  useEffect,
} from 'react';

export interface WrapperProps {
  WC: ComponentType<any> | string;
  innerRef?: RefObject<HTMLElement> | MutableRefObject<HTMLElement | null>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}

type EventHandler = [string, EventListenerOrEventListenerObject];

export const setAttribute = (
  ref: RefObject<HTMLElement> | undefined,
  attr: string,
  value: string | number | boolean,
) => {
  if (ref?.current) {
    if (value === false) {
      ref.current.removeAttribute(attr);
      return;
    }
    ref.current.setAttribute(attr, value.toString());
  }
};

export const setEvent = (
  ref: RefObject<HTMLElement> | undefined,
  eventHandlers: EventHandler[],
  event: string,
  value: EventListenerOrEventListenerObject,
) => {
  eventHandlers.push([event, value]);
  if (ref?.current) {
    ref.current.addEventListener(event, value);
  }
};

export const clearEventHandlers = (
  ref: RefObject<HTMLElement> | undefined,
  eventHandlers: EventHandler[],
) => {
  eventHandlers.forEach(([event, handler]) => {
    if (ref?.current) {
      ref.current.removeEventListener(event, handler);
    }
  });
  // eslint-disable-next-line no-param-reassign
  eventHandlers = [];
  return eventHandlers;
};

const WrapperComp = (props: WrapperProps, ref: any) => {
  const eventHandlers: EventHandler[] = [];

  useEffect(() => {
    update();
    return () => {
      clearEventHandlers(ref, eventHandlers);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = () => {
    clearEventHandlers(ref, eventHandlers);
    Object.entries(props).forEach(([prop, val]) => {
      if (prop === 'style') return;
      if (prop === 'children') {
        return undefined;
      }
      if (prop.toLowerCase() === 'classname' && ref?.current) {
        return (ref.current.className = val as string);
      }

      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        setAttribute(ref, prop, val);
        return;
      }
      if (typeof val === 'function') {
        const reg = /([A-Z])/g;
        if (prop.match(/^on[A-Z]/)) {
          const str = prop.replace(reg, (a, b) => `-${b.toLowerCase()}`);
          return setEvent(
            ref,
            eventHandlers,
            str.substring(3),
            val as EventListenerOrEventListenerObject,
          );
        }
        if (prop.match(/^on-[a-z]/)) {
          return setEvent(
            ref,
            eventHandlers,
            prop.substring(3),
            val as EventListenerOrEventListenerObject,
          );
        }
      }
    });
  };

  return createElement(props.WC, { ref, style: props.style }, props.children);
};

export const Wrapper = (props: WrapperProps) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = props.innerRef ?? createRef<HTMLElement>();
  if (typeof ref === 'function' || ref === null) return null;
  return WrapperComp(props, ref);
};

const ReactWrapper = (WC: ComponentType<any> | string) => {
  return forwardRef((props: any, ref: React.Ref<HTMLElement>) =>
    createElement(Wrapper, { WC, innerRef: ref, ...props }, props.children),
  );
};

export default ReactWrapper;
