// index.ts
import { testBehavior } from "./storeBehavior";
import { behavior as computedBehavior } from "miniprogram-computed";
import { getSingleImg } from "../../service/api/img";
import BehaviorWithVisible from "../../behaviors/BehaviorWithVisible";

const test = BehaviorWithVisible('test')
type IIndexPageOption = {

} & Record<string, any>
Page<any, IIndexPageOption>({
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
    console.log(a.data);
  },
  toList() {
    wx.navigateTo({ url: "/pages/list/index" });
  },
});
