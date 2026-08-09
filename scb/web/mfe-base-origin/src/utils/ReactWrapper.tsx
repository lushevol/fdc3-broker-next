import { createElement, forwardRef, createRef, useEffect } from "react";
export const setAttribute = (ref, attr, value) => {
  if (ref?.current) {
    if (value === false) {
      ref.current.removeAttribute(attr);
      return;
    }
    ref.current.setAttribute(attr, value.toString());
  }
};
export const setEvent = (ref, eventHandlers, event, value) => {
  eventHandlers.push([event, value]);
  if (ref?.current) {
    ref.current.addEventListener(event, value);
  }
};
export const clearEventHandlers = (ref, eventHandlers) => {
  eventHandlers.forEach(([event, handler]) => {
    if (ref?.current) {
      ref.current.removeEventListener(event, handler);
    }
  });
  eventHandlers = [];
  return eventHandlers;
};
const WrapperComp = (props, ref) => {
  let eventHandlers: any[] = [];
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
        return (ref.current.className = val);
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
          const str = prop.replace(reg, function (a, b) {
            return `-${b.toLowerCase()}`;
          });
          return setEvent(ref, eventHandlers, str.substring(3), val);
        }
        if (prop.match(/^on-[a-z]/)) {
          return setEvent(ref, eventHandlers, prop.substring(3), val);
        }
      }
    });
  };
  return createElement(props.WC, { ref, style: props.style }, props.children);
};
export const Wrapper = (props) => {
  const ref = props.innerRef ?? createRef();
  if (typeof ref === "function" || ref === null) return null;
  return WrapperComp(props, ref);
};
const ReactWrapper = (WC) => {
  return forwardRef((props: any, ref) =>
    createElement(Wrapper, { WC, innerRef: ref, ...props }, props.children)
  );
};

export default ReactWrapper;
