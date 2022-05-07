interface IBehaviorWithAuth {
  isPageAuth?: boolean;
  certifiedPagePath?: string;
  tipFun?: (toFun: () => void) => void;
}

export interface BehaviorWithAuthInjectData {
  token?: any;
}

export interface BehaviorWithAuthInjectOption {
  isCertified: (isToCertifiedPage?: boolean) => boolean;
}

const BehaviorWithAuth = (params?: IBehaviorWithAuth) => {
  const { isPageAuth, certifiedPagePath, tipFun } = params ?? {};

  return Behavior({
    data: {
      token: wx.getStorageSync("token"),
    },
    lifetimes: {
      attached() {
        // if (isPageAuth && certifiedPagePath && !this.data.token) {
        //   tipFun?.(this._toCertifiedPage) &&
        //     wx.navigateTo({ url: certifiedPagePath });
        // }
      },
    },
    pageLifetimes: {
      show() {
        this.setData(
          {
            token: wx.getStorageSync("token"),
          },
          () => {
            if (isPageAuth && certifiedPagePath && !this.data.token) {
              tipFun?.(this._toCertifiedPage) &&
                wx.navigateTo({ url: certifiedPagePath });
            }
          }
        );
      },
    },
    methods: {
      isCertified(isToCertifiedPage?: boolean) {
        if (isToCertifiedPage && certifiedPagePath && !this.data.token) {
          tipFun?.(this._toCertifiedPage) &&
            wx.navigateTo({ url: certifiedPagePath });
        }
        return !!this.data.token;
      },
      _toCertifiedPage() {
        if (certifiedPagePath) {
          wx.navigateTo({ url: certifiedPagePath });
        }
      },
    },
  });
};

export default BehaviorWithAuth;
