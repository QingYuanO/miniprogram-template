
interface IBehaviorWithAuth {
  /**
   * @description 页面中方法的认证逻辑
   */
  operateCertifiedFun: (params?: IsCertifiedParams) => boolean;
  /**
   * @description 获取token的方法
   */
  getTokenFun: () => any;
  /**
   * @description 进入页面后的认证逻辑
   */
  pageCertifiedFun?: () => void;
}

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

const BehaviorWithAuth = (params: IBehaviorWithAuth) => {
  const { operateCertifiedFun, pageCertifiedFun, getTokenFun } = params;

  return Behavior({
    data: {
      _isOnAuthLoadExcute: false,
    },
    pageLifetimes: {
      show() {
        pageCertifiedFun?.();
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
          if (getTokenFun() && !this.data._isOnAuthLoadExcute) {
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
        return operateCertifiedFun(params);
      },
    },
  });
};

const createNormalAuthBehavior = (params?: {
  isPageNeedLogin: boolean;
  accessPageNeed: string[];
}) => {
  const { isPageNeedLogin, accessPageNeed } = params ?? {};

  const defaultNotLoginCallback = () => {
    wx.showModal({
      content: "请登录!",
      showCancel: false,
      success(res) {
        if (res.confirm) {
          toLoginPage();
        }
      },
    });
  };
  const tipAuthBehavior = BehaviorWithAuth({
    pageCertifiedFun() {
      const hasPageAccess = hasAccess(accessPageNeed);
      if (isPageNeedLogin && !getToken()) {
        defaultNotLoginCallback();
      }
      if (
        getToken() &&
        accessPageNeed &&
        accessPageNeed.length > 0 &&
        !hasPageAccess
      ) {
        to403Page();
      }
    },
    operateCertifiedFun(params?: IsCertifiedParams) {
      const token = getToken();
      const { accessNeed, notLoginCallback, notAccessCallback } = params ?? {};
      const isHasAccess = hasAccess(accessNeed);
      if (!token) {
        notLoginCallback
          ? notLoginCallback?.(toLoginPage)
          : defaultNotLoginCallback();
        return false;
      }
      if (accessNeed && accessNeed.length > 0 && !isHasAccess) {
        notAccessCallback
          ? notAccessCallback?.(toLoginPage)
          : wx.showModal({
              content: "没有访问权限!",
              showCancel: false,
              confirmText: "关闭",
              confirmColor: "#000",
            });
        return false;
      }
      return true;
    },
    getTokenFun: getToken,
  });
  return tipAuthBehavior;
};

const getToken = () => {
  return wx.getStorageSync("token");
};
//用户的权限列表
const getAccess = () => {
  return wx.getStorageSync("access");
};
const toLoginPage = () => {
  wx.navigateTo({ url: "/pages/login/index" });
};
const to403Page = () => {
  wx.redirectTo({ url: "/pages/403/index" });
};
const hasAccess = (accessNeed?: string[]) => {
  const access = getAccess();
  return accessNeed?.every((item) => access?.includes(item));
};
export { createNormalAuthBehavior, getAccess, getToken, hasAccess };

export default BehaviorWithAuth;
