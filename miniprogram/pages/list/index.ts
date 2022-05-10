// pages/list/index.ts

import { BehaviorWithStore } from "mobx-miniprogram-bindings";
import BehaviorWithList, {
  BehaviorWithListInjectData,
  BehaviorWithListInjectOption,
} from "../../behaviors/BehaviorWithList";
import { global } from "../../models";
import { GlobalData } from "../../models/global";

const globalBehavior = BehaviorWithStore({
  storeBindings: [{
    namespace: "global",
    store: global,
    fields: ["numA", "numB", "sum"],
    actions: ["update"],
  }],
});

const listBehavior = BehaviorWithList({
  namespace: "list",
  getListApi: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ listData: new Array(10).fill(1), total: 8, isLast: false });
      }, 1000);
    });
  },
});

Page<IListPageData, IListPageOption>({
  behaviors: [globalBehavior,listBehavior],
  data: {},
  onLoad() {
		const { numA, numB, sum } = this.data?.global ?? {};
      
		this.getListBehavior?.();
		wx.setNavigationBarTitle({title:`${numA}-${numB}-${sum}`})
  },

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {
    this.nextPageBehavior?.();
  },
});

interface IListPageOption extends BehaviorWithListInjectOption {
  behaviors?: string[];
}

interface IListPageData    {
	list?: BehaviorWithListInjectData;
	global?:Partial<GlobalData>
}
