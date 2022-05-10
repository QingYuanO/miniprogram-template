import {
  BehaviorWithAuthInjectOption,
  createNormalAuthBehavior,
} from "../../behaviors/BehaviorWithAuth";
const auth = createNormalAuthBehavior({
  accessPageNeed: ["auth1"],
  isPageNeedLogin: true,
});

interface IPageOption extends BehaviorWithAuthInjectOption {}
interface IPageData {}

Page<IPageData, IPageOption>({
  //@ts-ignore
  behaviors: [auth],
  data: {},

  onLoad() {},

  onAuthLoad() {},

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},
});
