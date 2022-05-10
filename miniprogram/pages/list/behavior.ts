import { BehaviorWithStore } from "mobx-miniprogram-bindings";
import { global } from "../../models/index";

export const globalStore = BehaviorWithStore({
  storeBindings: [{
    namespace: "global",
    store: global,
    fields: ["numA", "numB", "sum"],
    actions: ["update"],
  }],
});