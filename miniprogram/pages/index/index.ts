// index.ts
import { testBehavior } from "./storeBehavior";
import { behavior as computedBehavior } from "miniprogram-computed";
import { getSingleImg } from "../../service/api/img";
import BehaviorWithVisible from "../../behaviors/BehaviorWithVisible";
import BehaviorWithAuth from "../../behaviors/BehaviorWithAuth";

const test = BehaviorWithVisible('test')
const auth = BehaviorWithAuth({ isPageAuth: true, certifiedPagePath: '/pages/login/index' })
type IIndexPageOption = {
	authMethods?: string[],
} & Record<string, any>
Page<any, IIndexPageOption>({
	behaviors: [testBehavior, computedBehavior, test, auth],
	data: {},
	watch: {},
	computed: {
		sum(data: any) {
			return data.numA + data.numB;
		},
	},
	authMethods: ['toList'],
	async onLoad() {
		const a = await getSingleImg();
		console.log(a.data);
	},
	toList() {
		wx.navigateTo({ url: "/pages/list/index" });
	},
});
