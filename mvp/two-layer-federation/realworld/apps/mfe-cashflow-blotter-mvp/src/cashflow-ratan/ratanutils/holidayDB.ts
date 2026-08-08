interface InitIndexedDBProps {
  dbName: string;
  version?: number;
  storeName: string;
  clearOnClose?: boolean;
}
export class InitIndexedDB {
  private db: IDBDatabase | undefined;
  private storeName: string;

  constructor({
    dbName,
    version = 1,
    storeName,
    clearOnClose = false,
  }: InitIndexedDBProps) {
    const req = window.indexedDB.open(dbName, version);
    this.storeName = storeName;

    req.onsuccess = (event: any) => {
      this.db = event.target.result;
    };

    req.onupgradeneeded = (event: any) => {
      this.db = event.target.result;
      this.db?.createObjectStore(storeName, { autoIncrement: true });
    };

    if (clearOnClose) {
      this.unload();
    }
  }

  add(value: any, key: string) {
    return new Promise((resolve, reject) => {
      const obj: any = this.db
        ?.transaction([this.storeName], "readwrite")
        ?.objectStore(this.storeName)
        .add(value, key);
      obj.onsuccess = (event: any) => {
        resolve(event?.target?.result);
      };
      obj.onerror = (error) => {
        reject(error);
      };
    });
  }

  get(key: string) {
    return new Promise((resolve) => {
      const obj: any = this.db
        ?.transaction([this.storeName], "readwrite")
        ?.objectStore(this.storeName)
        .get(key);
      if (obj) {
        obj.onsuccess = (event: any) => {
          resolve(event?.target?.result);
        };
      }
    });
  }

  clear() {
    this.db
      ?.transaction([this.storeName], "readwrite")
      ?.objectStore(this.storeName)
      .clear();
  }

  private unload() {
    window.onunload = () => {
      this.clear();
    };
  }
}

const holidayDB = new InitIndexedDB({
  dbName: "holidays",
  storeName: "holidayStore",
  clearOnClose: true,
});
export default holidayDB;
