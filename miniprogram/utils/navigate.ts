// 忽略此文件的 TypeScript 错误
// @ts-nocheck

import { createNavigate, NavigateOptions } from 'weapp-navigate';

type CustomNavigateUrl =
  | '/pages/index/index'
  | '/pages/login/index'
  | '/pages/list/index'
  | '/pages/someNeedAuthPage/index'
  | '/pages/403/index';

type CustomNavigateOptions = {
  type?: NavigateOptions['type'];
  params?: Record<string, any>;
  auth?: {
    needLogin?: boolean;
    access?: string[];
  };
};

const navigate = (url: CustomNavigateUrl, options?: CustomNavigateOptions) => {
  const { type, params, auth } = options ?? {};

  const fun = createNavigate({
    onBeforeExecute: async options => {
      console.log(options);

      const { needLogin, access, ...otherParams } = options.params ?? {};
      options.params = otherParams ?? {};

      const token = wx.getStorageSync('token');
      const userAccess = wx.getStorageSync('access');

      if (needLogin && !token) {
        throw new Error('no permission');
      }

      if (access && !access?.some(item => userAccess?.includes(item))) {
        throw new Error('no permission');
      }
    },
    onAfterExecute(result) {
      // onAfterExecute 可以对 result 返回值进行修改
    },
    onError(error) {
      console.error(error);
    },
  });

  return fun({
    url,
    type,
    params: {
      ...(params ?? {}),
      ...(auth ?? {}),
    },
  });
};

export default navigate;
