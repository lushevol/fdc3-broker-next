export class FDC3Logger {
  static log(message: string, ...optionalParams: any[]) {
    console.log(`[FMPTP FDC3] ${message}`, ...optionalParams);
  }
}
