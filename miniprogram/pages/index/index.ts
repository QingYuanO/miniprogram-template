// index.ts
import { testBehavior } from "./storeBehavior";
import { behavior as computedBehavior } from "miniprogram-computed";
import { getSingleImg } from "../../service/api/img";
import BehaviorWithVisible from "../../behaviors/BehaviorWithVisible";
import BehaviorWithAuth, {
  BehaviorWithAuthInjectOption,
  BehaviorWithAuthInjectData,
} from "../../behaviors/BehaviorWithAuth";

const test = BehaviorWithVisible("test");

type IIndexPageData = {} & BehaviorWithAuthInjectData & Record<string, any>;

type IIndexPageOption = {} & BehaviorWithAuthInjectOption;
Page<IIndexPageData, IIndexPageOption>({
  //@ts-ignore
  behaviors: [testBehavior, computedBehavior, test],
  data: {},
  watch: {},
  computed: {
    sum(data: any) {
      return data.numA + data.numB;
    },
  },
  async onLoad() {
    const a = await getSingleImg();
    console.log(this.data.token);
  },
  toList() {
    wx.navigateTo({ url: "/pages/list/index" });
  },
  logout() {
    wx.setStorageSync("token", "");
  },
});
