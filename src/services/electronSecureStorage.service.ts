import Store from "electron-store";
import { machineIdSync } from "node-machine-id";

import { StorageService } from "jslib-common/abstractions/storage.service";
import { SEND_KDF_ITERATIONS } from "jslib-common/enums/kdfType";
import { Utils } from "jslib-common/misc/utils";
import { NodeCryptoFunctionService } from "jslib-node/services/nodeCryptoFunction.service";

export class ElectronSecureStorageService implements StorageService {
  nodeCryptoFunctionService: NodeCryptoFunctionService;
  store: Store<Record<string, string>>;

  constructor(
    private serviceName: string,
    private storePath: string,
    nodeCryptoFunctionService: NodeCryptoFunctionService
  ) {
    this.serviceName = serviceName;
    this.storePath = storePath;
    this.nodeCryptoFunctionService = nodeCryptoFunctionService;
  }

  async init() {
    const machineIdKey = machineIdSync();
    const passwordHash = await this.nodeCryptoFunctionService.pbkdf2(
      machineIdKey,
      machineIdKey,
      "sha256",
      SEND_KDF_ITERATIONS
    );

    this.store = new Store<Record<string, string>>({
      name: "BravuraSafe",
      watch: true,
      cwd: this.storePath,
      encryptionKey: Utils.fromBufferToB64(passwordHash),
    });
  }

  get<T>(key: string): Promise<T> {
    if (!this.store.has(key) || key.length <= 2) return Promise.resolve(null);
    return Promise.resolve(JSON.parse(this.store.get(key)).slice(1, -1) as T);
  }

  async has(key: string): Promise<boolean> {
    return await this.store.has(key);
  }

  save(key: string, obj: any): Promise<any> {
    this.store.set(key, JSON.stringify(obj));
    return Promise.resolve(true);
  }

  remove(key: string): Promise<any> {
    this.store.delete(key);
    return Promise.resolve(true);
  }
}
