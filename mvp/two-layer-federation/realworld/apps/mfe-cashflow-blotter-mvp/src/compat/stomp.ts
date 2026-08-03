import * as browserStompModule from 'stompjs-browser';

type StompBrowserModule = {
  readonly Stomp: {
    readonly over: (socket: unknown) => unknown;
  };
};

const Stomp = (browserStompModule as unknown as StompBrowserModule).Stomp;

export default Stomp;
export type Client = unknown;
export type Frame = unknown;
export type Message = unknown;
export type Subscription = unknown;
