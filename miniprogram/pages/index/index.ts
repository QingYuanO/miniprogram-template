// index.ts
import { testBehavior } from "./storeBehavior";
import { behavior as computedBehavior } from "miniprogram-computed";
import { getSingleImg } from "../../service/api/img";
import BehaviorWithVisible from "../../behaviors/BehaviorWithVisible";
import BehaviorWithAuth, {
  BehaviorWithAuthInjectOption,
  createNormalAuthBehavior,
} from "../../behaviors/BehaviorWithAuth";

const test = BehaviorWithVisible("test");
const auth = createNormalAuthBehavior();

type IIndexPageData = {};

type IIndexPageOption = {} & BehaviorWithAuthInjectOption;
Page<IIndexPageData, IIndexPageOption>({
  //@ts-ignore
  behaviors: [testBehavior, computedBehavior, test, auth],
  data: {},
  watch: {},
  computed: {
    sum(data: any) {
      return data.numA + data.numB;
    },
  },
  async onLoad() {
    const a = await getSingleImg();
  },
  onAuthLoad(){
    console.log('onAuthLoad');
  },
  authMethods: [
    {
      name: "toList",
      notLoginWrapFun(toLoginFun) {
        wx.showModal({
          content: "请登录!",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              toLoginFun();
            }
          },
        });
      },
    },
  ],
  toList() {
    wx.navigateTo({ url: "/pages/list/index" });
  },
  logout() {
    wx.setStorageSync("token", "");
  },
});
