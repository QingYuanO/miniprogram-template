// pages/list/index.ts

import BehaviorWithList, { BehaviorWithListReturnData, BehaviorWithListReturnOption } from "../../behavior/BehaviorWithList"

const listBehavior = BehaviorWithList({
    namespace: 'list',
    getListApi: () => {
        return new Promise((resolve) => {
            resolve({ listData: new Array(8).map((_, idx) => ({ id: idx })), total: 8, isLast: true })
        })
    }
})
type IListPageOption = {

} & BehaviorWithListReturnOption
type IListPageData = {
    a: number
} & BehaviorWithListReturnData

Page<IListPageData, IListPageOption>({
    //@ts-ignore
    behaviors: [listBehavior],
    /**
     * 页面的初始数据
     */
    data: {
        a: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.getList()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})