interface NotAuthCallbackFuns {
  /**
   * @description 没有登录的回调
   */
  notLoginCallback?: (toLoginFun: () => void) => void;
  /**
   * @description 没有权限的回调
   */
  notAccessCallback?: (toLoginFun: () => void) => void;
}
interface IBehaviorWithAuth {
  /**
   * @description 是否在进入页面的时候判断用户是否登录
   */
  isPageNeedLogin?: boolean;
  /**
   * @description 页面需要的权限列表，如果传入此参数，并且用户没有权限将自动redict到403页面
   */
  accessPageNeed?: string[];
  /**
   * @description 登录页面路径
   */
  loginPagePath?: string;
  /**
   * @description 403页面路径
   */
  forbidden403PagePath?: string;
  /**
   * @description 跳转登陆页面前提示函数，透传跳转登陆页面方法
   */
  defaultNotLoginCallback?: (toLoginFun?: () => void) => void;
  /**
   * @description 没有权限的提示函数，透传跳转登陆页面方法
   */
  defaultNotAccessCallback?: (toLoginFun?: () => void) => void;
}

type AuthMethods = AuthItem[] | string[];
interface AuthItem extends NotAuthCallbackFuns {
  /**
   * @description 需要权限方法名称
   */
  name: string;
  /**
   * @description 调用方法需要的权限列表
   */
  access?: string | string[];
}

interface IsCertifiedParams extends NotAuthCallbackFuns {
  /**
   * @description 需要的权限列表
   */
  accessNeed?: string[];
}

//以下时暴露给外部的功能的类型
export interface BehaviorWithAuthInjectData {
  token?: any;
  access?: string[];
}
export interface BehaviorWithAuthInjectOption {
  /**
   * @description 判断是否有权限
   */
  isCertified: (params?: IsCertifiedParams) => boolean;
  /**
   * @description 仅当有token的时候调用一次；如果没有token，获取后，重新进入页面后也会调用一次
   */
  onAuthLoad?: () => void;
  /**
   * @description 需要权限的方法列表
   */
  authMethods?: AuthMethods;
}



const BehaviorWithAuth = (params?: IBehaviorWithAuth) => {
  const {
    isPageNeedLogin,
    accessPageNeed,
    loginPagePath,
    forbidden403PagePath,
    defaultNotAccessCallback,
    defaultNotLoginCallback,
  } = params ?? {};

  return Behavior({
    data: {
      _isOnAuthLoadExcute: false,
    },
    pageLifetimes: {
      show() {
        if (isPageNeedLogin && !this.getToken()) {
          defaultNotLoginCallback
            ? defaultNotLoginCallback?.(this._toLoginPage)
            : this._toLoginPage();
        }
        const hasPageAccess = this._hasAccess(accessPageNeed);
        if (
          forbidden403PagePath &&
          this.getToken() &&
          accessPageNeed &&
          accessPageNeed.length > 0 &&
          !hasPageAccess
        ) {
          this._to403Page();
        }
      },
    },
    definitionFilter(defFields: any) {
      const authMethods = defFields.authMethods as AuthMethods;
      const onAuthLoad = defFields?.methods?.onAuthLoad;
      if (authMethods) {
        authMethods.forEach((item: string | AuthItem) => {
          const name = typeof item === "string" ? item : item.name;
          const isCertifiedParams: IsCertifiedParams =
            typeof item === "string"
              ? {}
              : {
                  accessNeed:
                    typeof item.access === "string"
                      ? [item.access]
                      : item.access,
                  notAccessCallback: item.notAccessCallback,
                  notLoginCallback: item.notLoginCallback,
                };
          const f = defFields.methods[name];
          if (f) {
            defFields.methods[name] = function () {
              //此处的this为调用权限behavior的Page或Component的instance
              if (this.isCertified(isCertifiedParams)) {
                f.call(this);
              }
            };
          }
        });
      }

      if (onAuthLoad) {
        const onShow = defFields.methods.onShow;
        defFields.methods.onShow = function () {
          if (this.getToken() && !this.data._isOnAuthLoadExcute) {
            onAuthLoad.call(this);
            this.setData({
              _isOnAuthLoadExcute: true,
            });
          }
          onShow && onShow.call(this);
        };
      }
    },
    methods: {
      isCertified(params?: IsCertifiedParams) {
        const token = this.getToken();
        const { accessNeed, notLoginCallback, notAccessCallback } = params ?? {};
        const hasAccess = this._hasAccess(accessNeed);
        if (!token) {
          notLoginCallback
            ? notLoginCallback?.(this._toLoginPage)
            : defaultNotLoginCallback?.(this._toLoginPage);
          return false;
        }
        if (accessNeed && accessNeed.length > 0 && !hasAccess) {
          notAccessCallback
            ? notAccessCallback?.(this._toLoginPage)
            : defaultNotAccessCallback?.(this._toLoginPage);
          return false;
        }
        return true;
      },
      //token信息（判断是否登录以及获取一些用户信息）
      getToken() {
        return wx.getStorageSync("token");
      },
      //用户的权限列表
      getAccess() {
        return wx.getStorageSync("access");
      },
      _hasAccess(accessNeed?: string[]) {
        const access = this.getAccess();
        return accessNeed?.every((item) => access?.includes(item));
      },
      _toLoginPage() {
        if (loginPagePath) {
          wx.navigateTo({ url: loginPagePath });
        }
      },
      _to403Page() {
        if (forbidden403PagePath) {
          wx.redirectTo({ url: forbidden403PagePath });
        }
      },
    },
  });
};

export function createNormalAuthBehavior(
  params?: Pick<IBehaviorWithAuth, "isPageNeedLogin" | "accessPageNeed">
) {
  const tipAuthBehavior = BehaviorWithAuth({
    isPageNeedLogin: params?.isPageNeedLogin,
    accessPageNeed: params?.accessPageNeed,
    loginPagePath: "/pages/login/index",
    forbidden403PagePath: "/pages/403/index",
    defaultNotLoginCallback(toLoginFun) {
      wx.showModal({
        content: "请登录!",
        showCancel: false,
        success(res) {
          if (res.confirm) {
            toLoginFun?.();
          }
        },
      });
    },
    defaultNotAccessCallback() {
      wx.showModal({
        content: "没有访问权限!",
        showCancel: false,
        confirmText:'关闭',
        confirmColor:'#000'
      });
    },
  });
  return tipAuthBehavior;
}

export default BehaviorWithAuth;
