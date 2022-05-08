// pages/list/index.ts

import BehaviorWithAuth, {
  BehaviorWithAuthInjectOption,
  createNormalAuthBehavior,
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

const auth = createNormalAuthBehavior({
  accessPageNeed: ["list"],
  isPageNeedLogin: true,
});

interface IListPageOption
  extends BehaviorWithListInjectOption,
    BehaviorWithAuthInjectOption {}

type IListPageData = {} & { list?: BehaviorWithListInjectData };

Page<IListPageData, IListPageOption>({
  //@ts-ignore
  behaviors: [ auth,listBehavior],
  data: {},
  onLoad() {},
  onAuthLoad() {
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
