import { ReactiveControllerHost } from 'lit';
import { Base } from './base.js';

const root =
  'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #029CFD; font-weight: bold;';
const namespace =
  'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #606060; font-weight: bold;';
const error = 'padding: 2px 1px;color:#D50000;font-weight: bold;';
const warn = 'padding: 2px 1px;color:#BA861E;font-weight: bold;';

export class Log extends Base {
  private rootName = '@scdevkit/webkit';
  private namespace: string;
  constructor(host: ReactiveControllerHost, namespace: string) {
    super(host);
    this.namespace = namespace;
  }
  error(msg: string) {
    console.log(`%c ${this.rootName} %c ${this.namespace} %c  ${msg}`, root, namespace, error);
  }
  warn(msg: string) {
    console.log(`%c ${this.rootName} %c ${this.namespace} %c  ${msg}`, root, namespace, warn);
  }
}
