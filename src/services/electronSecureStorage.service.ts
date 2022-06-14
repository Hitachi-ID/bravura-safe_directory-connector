import Store from "electron-store";
import { machineIdSync } from "node-machine-id";

import { StorageService } from "jslib-common/abstractions/storage.service";

export class ElectronSecureStorageService implements StorageService {
  store: Store<Record<string, string>>;

  constructor(private serviceName: string, private storePath: string) {
    const machineIdKey = machineIdSync();
    this.store = new Store<Record<string, string>>({
      name: "BravuraSafe",
      watch: true,
      cwd: storePath,
      encryptionKey: machineIdKey,
    });
  }

  get<T>(key: string): Promise<T> {
    const buffer0 = Buffer.from(this.store.get(key), "latin1").toString();
    const buffer1 = JSON.parse(buffer0) as T;
    return Promise.resolve(buffer1);
  }

  async has(key: string): Promise<boolean> {
    return await this.store.has(key);
  }

  save(key: string, obj: any): Promise<any> {
    const buffer0 = Buffer.from(JSON.stringify(obj));
    const buffer1 = buffer0.toString("latin1");
    this.store.set(key, buffer1);
    return Promise.resolve(true);
  }

  remove(key: string): Promise<any> {
    this.store.delete(key);
    return Promise.resolve(true);
  }
}
