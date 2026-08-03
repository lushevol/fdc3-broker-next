import { ReactiveController, ReactiveControllerHost } from 'lit';

export class Base implements ReactiveController {
  host: ReactiveControllerHost;
  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }
  hostConnected(): void {}
}
