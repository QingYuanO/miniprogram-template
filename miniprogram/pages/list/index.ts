// pages/list/index.ts
import BehaviorWithList, {
  BehaviorWithListInjectData,
  BehaviorWithListInjectOption,
} from "@behaviors/BehaviorWithList";
import { GlobalData } from "@models/global";
import { getSingleImg } from "@service/api/img";
import { globalStore } from "./behavior";

const listBehavior = BehaviorWithList({
  namespace: "list",
  isAutoNextPage: true,
  isAutoLoad: true,
  getListApi: (data) => {
    console.log(data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
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
  data: {
    testListExtraData:{a:1}
  },
  async onLoad() {
    const { numA, numB, sum } = this.data?.global ?? {};
    wx.setNavigationBarTitle({ title: `${numA}-${numB}-${sum}` });
    const res= await getSingleImg();
    this.setData({test:res?.data})
  },
  listExtraData:['testListExtraData','test'],
  onReady() {},

  onShow() {
    
  },

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},
  changeTestListExtraData(){
    this.setData({
      testListExtraData:{b:2}
    })
  },
});

interface IListPageOption extends BehaviorWithListInjectOption {
  behaviors?: string[];
  changeTestListExtraData:() => void
}

interface IListPageData {
  list?: BehaviorWithListInjectData;
  global?: Partial<GlobalData>;
  testListExtraData?:Record<string,any>
}
