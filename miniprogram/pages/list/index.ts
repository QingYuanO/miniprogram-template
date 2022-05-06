// pages/list/index.ts

import BehaviorWithList, { BehaviorWithListReturnData, BehaviorWithListReturnOption } from "../../behavior/BehaviorWithList"

const listBehavior = BehaviorWithList({
    namespace: 'list',
    getListApi: () => {
        return new Promise((resolve) => {
            resolve({ listData: new Array(10).fill(1), total: 8, isLast: false })
        })
    }
})
type IListPageOption = {

} & BehaviorWithListReturnOption
type IListPageData = {
    a: number
} & { list?: BehaviorWithListReturnData }

Page<IListPageData, IListPageOption>({
    //@ts-ignore
    behaviors: [listBehavior],
    /**
     * 页面的初始数据
     */
    data: {
        a: 1
    },

    onLoad() {
        this.getList()
    },


    onReady() {

    },

    onShow() {

    },

    onHide() {

    },

    onUnload() {

    },

    onPullDownRefresh() {

    },

    onReachBottom() {
        this.nextPage()
    },

})