import { indexAuth, testBehavior, testVisible } from "./behavior";
import { behavior as computedBehavior } from "miniprogram-computed";
import { getSingleImg } from "../../service/api/img";
import { BehaviorWithAuthInjectOption } from "../../behaviors/BehaviorWithAuth";
import {
  toListPage,
  toLoginPage,
  toSomeNeedAuthPage,
} from "../../utils/navigate/toRoutePage";
import { GlobalData, GlobalOption } from "../../models/global";
import { UserData, UserOption } from "../../models/user";

Page<IIndexPageData, IIndexPageOption>({
  behaviors: [testBehavior, computedBehavior, testVisible, indexAuth],
  data: {
    isLogin: false,
  },
  // watch: {},
  computed: {
    loginTitle(data) {
      return data.isLogin ? "登出" : "登录";
    },
    userStore(data) {
      const { numA, numB, sum } = data;
      return `${numA}-${numB}-${sum}`;
    },
    globalStore(data) {
      const { numA, numB, sum } = data?.global ?? {};
      return `${numA}-${numB}-${sum}`;
    },
  },
  async onLoad() {
    await getSingleImg();
  },
  onAuthLoad() {
    this.data.sum;
    console.log("onAuthLoad");
  },
  onShow() {
    console.log("onShow");
    this.setData({
      isLogin: !!wx.getStorageSync("token"),
    });
  },
  authMethods: [
    {
      name: "toAuthPage",
      notLoginCallback() {
        console.log(this);
        wx.showModal({
          content: "请登录!",
          success(res) {
            if (res.confirm) {
              toLoginPage();
            }
          },
        });
      },
    },
    "toList",
  ],
  toList() {
    toListPage();
  },
  toAuthPage() {
    toSomeNeedAuthPage();
  },
  logout() {
    if (this.data.isLogin) {
      wx.setStorageSync("token", "");
      this.setData(
        {
          isLogin: false,
        },
        () => {
          wx.showToast({ title: "登出成功" });
        }
      );
    } else {
      toLoginPage({
        success:(res) => {
          res.eventChannel
          console.log(this);
        },
      });
    }
  },
});

interface IIndexPageData extends Partial<UserData> {
  isLogin: boolean;
  loginTitle?: string;
  global?: Partial<GlobalData>;
}

interface IIndexPageOption
  extends BehaviorWithAuthInjectOption,
    BehaviorWithComputedInjectOption<IIndexPageData>,
    Partial<UserOption>,
    Partial<GlobalOption> {
  toList(): void;
  toAuthPage(): void;
  logout(): void;
  behaviors: string[];
}
