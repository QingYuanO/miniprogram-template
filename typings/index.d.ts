/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}


interface BehaviorWithComputedInjectOption<V = unknown>{
  watch?: Record<string, (...args: any[]) => void>;
  computed?: Record<string, (data: V) => void>;
}