const BASE_URL = "";

export interface ExtraData {
  showLoad?: boolean;
  hasToken?: boolean;
  showErrorToast?: boolean;
}

type OmitMethodCustomOption = Omit<
  WechatMiniprogram.RequestOption<CustomResult>,
  "method"
> & {
  baseUrl?: string;
  extraData?: ExtraData;
  /**
   * 传入此参数，请求方法内部会往上挂载接口暂停方法
   */
  signal?: any;
};

type CustomOption = Omit<OmitMethodCustomOption, "url">;

type Method = WechatMiniprogram.RequestOption["method"];

export interface CustomResult {
  //   result: any;
  [key: string]: any;
}

export type RequestPromiseResult = WechatMiniprogram.RequestSuccessCallbackResult<CustomResult>;

export enum HTTP_STATUS {
  SUCCESS = 200,
  CREATED = 201,
  ACCEPTED = 202,
  CLIENT_ERROR = 400,
  AUTHENTICATE = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

const ApiService = {
  baseOptions(
    {
      url,
      data,
      header,
      baseUrl,
      signal,
      extraData = {
        showLoad: true,
        hasToken: true,
        showErrorToast: false,
      },
      ...otherConfig
    }: OmitMethodCustomOption,
    method: Method
  ) {
    const {
      showLoad = true,
      hasToken = true,
      showErrorToast = false,
    } = extraData;
    const token = wx.getStorageSync("token");
    const contentType = ["POST", "PUT"].includes(method ?? "")
      ? "application/json"
      : "application/x-www-form-urlencoded";

    if (showLoad) {
      wx.showLoading({
        title: "请稍候...",
        mask: true,
      });
    }
    return new Promise<RequestPromiseResult>(function (resolve, reject) {
      const task = wx.request<CustomResult>({
        url: (baseUrl ?? BASE_URL) + url,
        data,
        method,
        header: {
          "content-type": contentType,
          //TODO添加自己的token
          Authorization: hasToken ? token : "",
          ...header,
        },
        ...otherConfig,
        success(result) {
          const codeStatus = [result.statusCode];
          const msg = result.data.message;
          if (codeStatus.includes(HTTP_STATUS.NOT_FOUND)) {
            return showError(msg || "请求资源不存在", showErrorToast, result);
          } else if (codeStatus.includes(HTTP_STATUS.BAD_GATEWAY)) {
            return showError(msg || "服务端出现了问题", showErrorToast, result);
          } else if (codeStatus.includes(HTTP_STATUS.SERVER_ERROR)) {
            return showError(msg || "后端出现了问题", showErrorToast, result);
          } else if (codeStatus.includes(HTTP_STATUS.FORBIDDEN)) {
            return showError(msg || "没有权限访问", showErrorToast, result);
          } else if (codeStatus.includes(HTTP_STATUS.AUTHENTICATE)) {
            wx.setStorageSync("token", "");
            return showError(msg || "需要鉴权", showErrorToast, result);
          } else if (result.statusCode >= 400) {
            return showError(msg, showErrorToast, result);
          } else {
            /**
               * result原始数据格式
                ---------
                开发者服务器返回的数据
                data: T
                开发者服务器返回的 HTTP Response Header
                header: TaroGeneral.IAnyObject
                开发者服务器返回的 HTTP 状态码
                statusCode: number
                调用结果
                errMsg: string
                cookies
                cookies?: string[]
               */
            return resolve({
              ...result,
              //根据自己的后台确定返回数据格式，
              data: result?.data?.data ?? result.data,
            });
          }
        },
        fail(error) {
          reject(error);
        },
        complete() {
          if (showLoad) {
            wx.hideLoading();
          }
        },
      });
      signal && (signal.onabort = () => task.abort());
    });
  },

  get(url: string, option?: CustomOption) {
    return this.baseOptions({ url, ...option }, "GET");
  },
  post(url: string, option?: CustomOption) {
    return this.baseOptions({ url, ...option }, "POST");
  },
  put(url: string, option?: CustomOption) {
    return this.baseOptions({ url, ...option }, "PUT");
  },
  delete(url: string, option?: CustomOption) {
    return this.baseOptions({ url, ...option }, "DELETE");
  },
};

function showError(message: string, show: boolean, res?: any) {
  show &&
    wx.showToast({
      title: message || "请求异常",
      icon: "none",
    });
  return Promise.reject(res);
}

export default ApiService;
