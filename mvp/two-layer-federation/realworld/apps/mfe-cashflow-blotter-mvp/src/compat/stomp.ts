import * as browserStompModule from 'stompjs-browser';

type StompBrowserModule = {
  readonly Stomp: {
    readonly over: (socket: unknown) => Client;
  };
};

const Stomp = (browserStompModule as unknown as StompBrowserModule).Stomp;

export default Stomp;
export type Frame = Record<string, unknown>;

export interface Message extends Frame {
  readonly body: string;
  ack(): void;
}

export interface Subscription {
  unsubscribe(): void;
}

export interface Client {
  readonly heartbeat: {
    incoming: number;
    outgoing: number;
  };
  connect(
    headers: Record<string, string>,
    onConnected: (frame: Frame | undefined) => void,
    onError: (frame: Frame | string) => void,
  ): void;
  disconnect(callback: () => void): void;
  subscribe(
    destination: string,
    callback: (message: Message) => void,
  ): Subscription;
}
