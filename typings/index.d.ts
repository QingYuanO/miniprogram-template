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

type AddNamespace<N extends string,O extends Record<string,any>> = {
  [k in keyof O as `${N}${Capitalize<string & k>}`]:O[k]
} 