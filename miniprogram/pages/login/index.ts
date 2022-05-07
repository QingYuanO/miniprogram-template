// pages/login/index.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  onLoad() {},

  onReady() {},

  onShow() {},

  setToken() {
    wx.setStorageSync("token", "1");
    wx.navigateBack();
  },
});
