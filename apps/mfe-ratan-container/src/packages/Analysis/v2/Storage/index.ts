import { unzip, zip } from "./utils";

export class BasicStorage {
  static BASIC_KEY = "RATAN_ONE";
  static get(key: string) {
    return unzip(localStorage.getItem(this.BASIC_KEY + "/" + key));
  }
  static set(key: string, value: any) {
    return localStorage.setItem(this.BASIC_KEY + "/" + key, zip(value));
  }
}

export class StationStorage extends BasicStorage {
  static KEY = "STATION";
  static getMonitorData() {
    try {
      return this.get(this.KEY) ?? [];
    } catch (error) {
      return [];
    }
  }
  static setMonitorData(v) {
    return this.set(this.KEY, v);
  }
}
