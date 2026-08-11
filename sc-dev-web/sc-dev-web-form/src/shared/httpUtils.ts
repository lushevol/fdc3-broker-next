export class HttpErr {
  err = null;

  constructor(err: any) {
    this.err = err;
  }
}

export const errorHandler = (defaultValue: any) => () => defaultValue;

export const catchError = (e: any) => new HttpErr(e);

export const isErr = (e: any) => e instanceof HttpErr;
