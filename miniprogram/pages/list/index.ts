// pages/list/index.ts

import BehaviorWithAuth, {
  BehaviorWithAuthInjectData,
  BehaviorWithAuthInjectOption,
} from "../../behaviors/BehaviorWithAuth";
import BehaviorWithList, {
  BehaviorWithListInjectData,
  BehaviorWithListInjectOption,
} from "../../behaviors/BehaviorWithList";

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

const auth = BehaviorWithAuth({
  isPageAuth: true,
  certifiedPagePath: "/pages/login/index",
  tipFun(toFun) {
    wx.showModal({
      content: "没有权限，请登录",
      cancelText: "返回",
      success(res) {
        if (res.confirm) {
          toFun();
        }
        if (res.cancel) {
          wx.navigateBack();
        }
      },
    });
  },
});

type IListPageOption = {} & BehaviorWithListInjectOption &
  BehaviorWithAuthInjectOption;

type IListPageData = {
  a: number;
} & { list?: BehaviorWithListInjectData } & BehaviorWithAuthInjectData;

Page<IListPageData, IListPageOption>({
  //@ts-ignore
  behaviors: [listBehavior, auth],
  data: {
    a: 1,
  },

  onLoad() {
    this.getListBehavior();
  },

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {
    this.nextPageBehavior();
  },
});
