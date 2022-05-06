// pages/list/index.ts

import BehaviorWithList, { BehaviorWithListReturnData, BehaviorWithListReturnOption } from "../../behavior/BehaviorWithList"

const listBehavior = BehaviorWithList({
    namespace: 'list',
    getListApi: (data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ listData: new Array(10).fill(1), total: 8, isLast: false })
            }, 1000)
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