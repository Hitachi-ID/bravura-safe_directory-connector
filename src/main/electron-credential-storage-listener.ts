import { ipcMain } from "electron";
import Store from "electron-store";
import { machineIdSync } from "node-machine-id";

import { SEND_KDF_ITERATIONS } from "jslib-common/enums/kdfType";
import { Utils } from "jslib-common/misc/utils";
import { NodeCryptoFunctionService } from "jslib-node/services/nodeCryptoFunction.service";

export class ElectronDCCredentialStorageListener {
  nodeCryptoFunctionService: NodeCryptoFunctionService;
  store: Store<Record<string, string>>;

  constructor(private serviceName: string, nodeCryptoFunctionService: NodeCryptoFunctionService) {
    this.serviceName = serviceName;
    this.nodeCryptoFunctionService = nodeCryptoFunctionService;
  }

  async initialize() {
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
      encryptionKey: Utils.fromBufferToB64(passwordHash),
    });
  }

  init() {
    ipcMain.on("keytar", async (event: any, message: any) => {
      try {
        let serviceName = this.serviceName;
        message.keySuffix = "_" + (message.keySuffix ?? "");
        if (message.keySuffix !== "_") {
          serviceName += message.keySuffix;
        }

        let val: string | boolean = null;
        if (message.action && message.key) {
          if (message.action === "getPassword") {
            val = JSON.parse(this.store.get(message.key));
          } else if (message.action === "hasPassword") {
            val = await this.store.has(message.key);
          } else if (message.action === "setPassword" && message.value) {
            await this.store.set(message.key, JSON.stringify(message.value));
          } else if (message.action === "deletePassword") {
            await this.store.delete(message.key);
          }
        }
        event.returnValue = val;
      } catch {
        event.returnValue = null;
      }
    });
  }
}
