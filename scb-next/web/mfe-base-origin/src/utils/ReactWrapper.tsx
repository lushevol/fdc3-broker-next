import {
  createElement,
  forwardRef,
  createRef,
  useEffect,
  CSSProperties,
  ElementType,
  ReactNode,
  Ref,
  RefObject,
} from "react";

type ElementRef = RefObject<HTMLElement>;
type EventHandlerEntry = [event: string, handler: EventListener];

type WebComponentType = string | ElementType;

interface WrappedProps {
  children?: ReactNode;
  style?: CSSProperties;
  [key: string]: unknown;
}

interface WrapperProps extends WrappedProps {
  WC: WebComponentType;
  innerRef?: Ref<HTMLElement>;
}

export const setAttribute = (
  ref: ElementRef | undefined,
  attr: string,
  value: string | number | boolean
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
  ref: ElementRef | undefined,
  eventHandlers: EventHandlerEntry[],
  event: string,
  value: EventListener
) => {
  eventHandlers.push([event, value]);
  if (ref?.current) {
    ref.current.addEventListener(event, value);
  }
};
export const clearEventHandlers = (
  ref: ElementRef | undefined,
  eventHandlers: EventHandlerEntry[]
) => {
  eventHandlers.forEach(([event, handler]) => {
    if (ref?.current) {
      ref.current.removeEventListener(event, handler);
    }
  });
  eventHandlers = [];
  return eventHandlers;
};
const WrapperComp = (props: WrapperProps, ref: ElementRef) => {
  let eventHandlers: EventHandlerEntry[] = [];
  useEffect(() => {
    update();
    return () => {
      clearEventHandlers(ref, eventHandlers);
    };
  }, []);
  const update = () => {
    clearEventHandlers(ref, eventHandlers);
    Object.entries(props).forEach(([prop, val]) => {
      if (prop === "style") return;
      if (prop === "children") {
        return undefined;
      }
      if (prop.toLowerCase() === "classname" && ref?.current) {
        return (ref.current.className = String(val));
      }
      if (
        typeof val === "string" ||
        typeof val === "number" ||
        typeof val === "boolean"
      ) {
        setAttribute(ref, prop, val);
        return;
      }
      if (typeof val === "function") {
        const reg = /([A-Z])/g;
        if (prop.match(/^on[A-Z]/)) {
          const str = prop.replace(
            reg,
            function (_match: string, letter: string) {
              return `-${letter.toLowerCase()}`;
            }
          );
          return setEvent(
            ref,
            eventHandlers,
            str.substring(3),
            val as EventListener
          );
        }
        if (prop.match(/^on-[a-z]/)) {
          return setEvent(
            ref,
            eventHandlers,
            prop.substring(3),
            val as EventListener
          );
        }
      }
    });
  };
  return createElement(props.WC, { ref, style: props.style }, props.children);
};
export const Wrapper = (props: WrapperProps) => {
  const ref = props.innerRef ?? createRef<HTMLElement>();
  if (typeof ref === "function" || ref === null) return null;
  return WrapperComp(props, ref);
};
const ReactWrapper = (WC: WebComponentType) => {
  return forwardRef<HTMLElement, WrappedProps>((props, ref) =>
    createElement(
      Wrapper,
      { WC, innerRef: ref, ...props },
      props.children as ReactNode
    )
  );
};

export default ReactWrapper;
