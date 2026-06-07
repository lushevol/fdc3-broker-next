/// <reference types="react" />
export declare const setAttribute: (ref: any, attr: any, value: any) => void;
export declare const setEvent: (
  ref: any,
  eventHandlers: any,
  event: any,
  value: any
) => void;
export declare const clearEventHandlers: (ref: any, eventHandlers: any) => any;
export declare const Wrapper: (
  props: any
) =>
  | import("react").DetailedReactHTMLElement<
      import("react").InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
  | null;
declare const ReactWrapper: (
  WC: any
) => import("react").ForwardRefExoticComponent<
  Omit<any, "ref"> & import("react").RefAttributes<unknown>
>;
export default ReactWrapper;
