// pages/list/index.ts
import BehaviorWithList, {
  BehaviorWithListInjectData,
  BehaviorWithListInjectOption,
} from "../../behaviors/BehaviorWithList";
import { GlobalData } from "../../models/global";
import { globalStore } from "./behavior";

const listBehavior = BehaviorWithList({
  namespace: "list",
  isAutoNextPage: true,
  isAutoLoad: true,
  getListApi: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: "ok",
          listData: new Array(10).fill(1),
          total: 8,
          isLast: false,
        });
      }, 1000);
    });
  },
});

Page<IListPageData, IListPageOption>({
  behaviors: [globalStore, listBehavior],
  data: {},
  onLoad() {
    const { numA, numB, sum } = this.data?.global ?? {};
    wx.setNavigationBarTitle({ title: `${numA}-${numB}-${sum}` });

    // this.getListBehavior?.();
  },

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},
});

interface IListPageOption extends BehaviorWithListInjectOption {
  behaviors?: string[];
}

interface IListPageData {
  list?: BehaviorWithListInjectData;
  global?: Partial<GlobalData>;
}
