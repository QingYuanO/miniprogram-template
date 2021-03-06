export enum NavigateType {
  /** 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面。使用 Router.back 可以返回到原页面。小程序中页面栈最多十层。 */
  navigateTo = "navigateTo",
  /** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。 */
  redirectTo = "redirectTo",
  /** 关闭所有页面，打开到应用内的某个页面 */
  reLaunch = "reLaunch",
  /** 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
  switchTab = "switchTab",
}

export interface ToRouterType<P = unknown> {
  params?: P;
  type?: NavigateType;
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: WechatMiniprogram.GeneralCallbackResult) => void;
  /** 页面间通信接口，用于监听被打开页面发送到当前页面的数据。 */
  events?: WechatMiniprogram.IAnyObject;
  /** 接口调用失败的回调函数 */
  fail?: (res: WechatMiniprogram.GeneralCallbackResult) => void;
  /** 接口调用成功的回调函数 */
  success?: (res: WechatMiniprogram.NavigateToSuccessCallbackResult) => void;
}

const generateParams = (params: { [key: string]: any }) => {
  return (
    "?" +
    Object.entries(params).reduce((total, cur, idx) => {
      const val = cur[0] + "=" + cur[1];
      if (idx === Object.entries(params).length - 1) {
        return total + val;
      } else {
        return total + val + "&";
      }
    }, "")
  );
};
const navigate = <P = unknown>(url: string, option?: ToRouterType<P>) => {
  const { type, params, success, fail, complete, events } = option ?? {};
  url = url + generateParams(params ?? {});
  switch (type) {
    case NavigateType.navigateTo:
      wx.navigateTo({ url, success, fail, complete, events });
      break;
    case NavigateType.redirectTo:
      //@ts-ignore
      wx.redirectTo({ url, success, fail, complete });
      break;
    case NavigateType.reLaunch:
      //@ts-ignore
      wx.reLaunch({ url, success, fail, complete });
      break;
    case NavigateType.switchTab:
      //@ts-ignore
      wx.switchTab({ url, success, fail, complete });
      break;
    default:
      wx.navigateTo({ url, success, fail, complete, events });
  }
};

export default navigate

export const toIndexPage = (option?: ToRouterType) => {
  navigate("/pages/index/index", option);
};

export const toLoginPage = (option?: ToRouterType) => {
  navigate("/pages/login/index", option);
};

export const toListPage = (option?: ToRouterType) => {
  navigate("/pages/list/index", option);
};

export const toSomeNeedAuthPage = (option?: ToRouterType) => {
  navigate("/pages/someNeedAuthPage/index", option);
};
export const to403Page = (option?: ToRouterType) => {
  navigate("/pages/403/index", option);
};