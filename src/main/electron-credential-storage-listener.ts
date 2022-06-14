import { ipcMain } from "electron";
import Store from "electron-store";
import { machineIdSync } from "node-machine-id";

export class ElectronDCCredentialStorageListener {
  store: Store<Record<string, string>>;

  constructor(private serviceName: string) {
    const machineIdKey = machineIdSync();
    this.store = new Store<Record<string, string>>({
      name: "BravuraSafe",
      watch: true,
      encryptionKey: machineIdKey,
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
            const buffer0 = Buffer.from(this.store.get(message.key), "latin1").toString();
            const buffer1 = JSON.parse(buffer0);
            val = buffer1;
          } else if (message.action === "hasPassword") {
            val = await this.store.has(message.key);
          } else if (message.action === "setPassword" && message.value) {
            const buffer0 = Buffer.from(JSON.stringify(message.value));
            const buffer1 = buffer0.toString("latin1");
            await this.store.set(message.key, buffer1);
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
