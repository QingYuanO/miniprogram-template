// index.ts
// 获取应用实例
const app = getApp<IAppOption>();
import { testBehavior } from "./storeBehavior";
import { behavior as computedBehavior } from "miniprogram-computed";
import { getSingleImg } from "../../service/api/img";

Page({
    behaviors: [testBehavior, computedBehavior],
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
