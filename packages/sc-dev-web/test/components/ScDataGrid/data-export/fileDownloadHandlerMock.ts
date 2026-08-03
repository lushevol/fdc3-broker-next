import { TextDecoder, TextEncoder } from 'util';
import { Blob } from 'node:buffer';

export const fileDownloadHandlerMock = () => {
  // @ts-ignore
  global.Blob = Blob;

  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
  }
  if (typeof global.TextDecoder === 'undefined') {
    // @ts-ignore
    global.TextDecoder = TextDecoder;
  }

  class DataTransferMock {
    files: File[] = [];

    items = {
      add: (file: File) => {
        this.files.push(file);
      },
    };
  }

  // @ts-ignore
  global.DataTransfer = DataTransferMock as unknown as typeof DataTransfer;

  if (!('createObjectURL' in URL)) {
    // @ts-ignore
    URL.createObjectURL = () => '';
  }
  if (!('revokeObjectURL' in URL)) {
    // @ts-ignore
    URL.revokeObjectURL = () => {};
  }
  if (typeof (global as any).ReadableStream === 'undefined') {
    (global as any).ReadableStream = class {
      _body: any;

      constructor(body: any) {
        this._body = body;
      }
    };
  }
  if (typeof (global as any).Response === 'undefined') {
    (global as any).Response = class {
      _body: any;

      _headers: any;

      constructor(body: any, init?: { headers?: any }) {
        this._body = body;
        this._headers = init?.headers || {};
      }

      async blob(): Promise<Blob> {
        const data: any[] = [];

        await new Promise<void>(resolve => {
          this._body._body.start({
            enqueue: (chunk: any) => {
              data.push(chunk);
            },
            close: () => {
              resolve();
            },
          });
        });

        const blob = new Blob(data);
        return Promise.resolve(blob);
      }
    };
  }
};
