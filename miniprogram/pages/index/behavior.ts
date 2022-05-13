import { BehaviorWithStore } from "mobx-miniprogram-bindings";
import { createNormalAuthBehavior } from "../../behaviors/BehaviorWithAuth";
import BehaviorWithVisible from "../../behaviors/BehaviorWithVisible";
import { global, user } from "../../models/index";

export const testBehavior = BehaviorWithStore({
  storeBindings: [{
    namespace: "global",
    store: global,
    fields: ["numA", "numB", "sum"],
    actions: ["update"],
  }, {
    store: user,
    fields: ["numA", "numB", "sum"],
    actions: ["update_user"],
  },]
});


export const testVisible = BehaviorWithVisible("test");
export const indexAuth = createNormalAuthBehavior();