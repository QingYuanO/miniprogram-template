/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo;
  };
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback;
}

interface BehaviorWithComputedInjectOption<V = unknown> {
  watch?: Record<string, (...args: any[]) => void>;
  computed?: Record<string, (data: V) => void>;
}

type AddNamespace<N extends string, O extends Record<string, any>> = {
  [k in keyof O as `${N}${Capitalize<string & k>}`]: O[k];
};

type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
type AnyFn = (...args: any[]) => any;

type WrapFn<T extends AnyFn> = (...args: ArgumentsType<T>) => ReturnType<T>;

type FunctionArgs<Args extends any[] = any[], Return = void> = (...args: Args) => Return;

interface FunctionWrapperOptions<Args extends any[] = any[], This = any> {
  fn: FunctionArgs<Args, This>;
  args: Args;
  thisArg: This;
}
