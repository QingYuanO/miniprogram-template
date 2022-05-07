// pages/list/index.ts

import BehaviorWithList, { BehaviorWithListInjectData, BehaviorWithListInjectOption } from "../../behaviors/BehaviorWithList"

const listBehavior = BehaviorWithList({
  namespace: 'list',
  getListApi: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ listData: new Array(10).fill(1), total: 8, isLast: false })
      }, 1000)
    })
  }
})

type IListPageOption = {

} & BehaviorWithListInjectOption

type IListPageData = {
  a: number
} & { list?: BehaviorWithListInjectData }

Page<IListPageData, IListPageOption>({
  //@ts-ignore
  behaviors: [listBehavior],
  data: {
    a: 1
  },

  onLoad() {
    this.getListBehavior()
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
    this.nextPageBehavior()
  },

})