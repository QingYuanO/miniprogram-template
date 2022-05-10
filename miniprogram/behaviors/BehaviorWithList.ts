import { BehaviorWithComputed } from "miniprogram-computed";
import { RequestPrimoseResult } from "../service";

interface IListResult {
  listData: any[];
  total: number;
  isLast: boolean;
}
interface IGetListParams {
  pageSize?: number;
  pageNum: number;
  type?: GetListType
  [key: string]: any;
}
type GetListType = 'initial' | 'loadMore'

interface IBehaviorWithList {
  /**
   * @description 注入data的名称
   */
  namespace: string;
  /**
   * @description 每项数据的唯一标识，默认【id】
   */
  key?: string;
  /**
   * @description 获取列表数据的接口
   */
  getListApi: (params: IGetListParams) => Promise<IListResult>;
  /**
   * @description 新增数据的接口
   */
  addItemApi?: (data: any) => Promise<RequestPrimoseResult>;
  /**
   * @param data:更新的数据
   * @description 参数data必须包含唯一标识取参数key的值，默认为【id】
   */
  updateItemApi?: (data: any) => Promise<RequestPrimoseResult>;
  /**
  * @description 删除数据的接口
  */
  deleteItemApi?: (id: any) => Promise<RequestPrimoseResult>;
}

export interface BehaviorWithListInjectData {
  pageSize?: number
  pageNum?: number;
  listData?: any[];
  total?: number;
  isLast?: boolean;
}

export interface BehaviorWithListInjectOption {
  nextPageBehavior?: (extraData?: Record<string, any>) => void;
  getListBehavior?: (params?: IGetListParams) => Promise<any>;
  updateItemBehavior?: (data: any) => Promise<any>;
  addItemBehavior?: (data: any) => Promise<any>;
  deleteItemBehavior?: (id: any) => Promise<any>;
}

/**
 * 
 * @description 注入列表的增、删、改、查逻辑的behavior
 */
const BehaviorWithList = (params: IBehaviorWithList) => {
  const key = params.key ?? "id";
  const {
    namespace,
    getListApi,
    deleteItemApi,
    updateItemApi,
    addItemApi,
  } = params;
  return BehaviorWithComputed({
    data: {
      [namespace]: {
        pageSize: 10,
        pageNum: 1,
        listData: [],
        total: 0,
        isLast: false,
        isFetch: false
      },
    },
    methods: {
      /**
       * @description 获取下一页数据
       * @param extraData Record<string, any>【将会被注入到获取列表数据的接口参数中】
       */
      nextPageBehavior(extraData?: Record<string, any>) {
        const { pageNum, pageSize, isFetch, isLast } = this.data[namespace];
        if (!isLast && !isFetch) {
          this.getListBehavior({ pageNum: pageNum + 1, pageSize, type: 'loadMore', ...extraData })
        }
      },
      /**
       * @description 获取列表数据
       * @param params  pageSize?: number; pageNum: number; type?: 'initial' | 'loadMore', ...otherParams
       */
      async getListBehavior(params?: IGetListParams) {
        const { listData, isFetch } = this.data[namespace];
        const { pageNum, pageSize, type, ...extraData } = params ?? { type: 'initial', pageSize: 10, pageNum: 1 }
        if (!isFetch) {
          this.setData({
            [namespace]: { ...this.data[namespace], isFetch: true }
          })
          try {
            const res = await getListApi({
              pageNum,
              pageSize,
              ...extraData
            });
            const updateData = { ...this.data[namespace], ...res, isFetch: false, pageNum, pageSize }
            if (type === 'initial') {
              this.setData({
                [namespace]: updateData
              });
            } else {
              this.setData({
                [namespace]: { ...updateData, listData: listData.concat(res.listData) },
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      },
      /**
      * @description 更新数据的方法
      * @param data 更新的数据
      */
      async updateItemBehavior(data: any) {
        const { listData } = this.data[namespace];
        try {
          const res = await updateItemApi?.(data);
          if (res?.data) {
            const updateIdx = listData.findIndex(
              (item: any) => item[key] === data[key]
            );
            if (updateIdx !== -1) {
              listData[updateIdx] = { ...listData[updateIdx], data };
              this.setData({
                [namespace]: {
                  ...this.data[namespace],
                  listData: [...listData],
                },
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      /**
      * @description 新增数据的方法
      * @param data 新增的数据
     */
      async addItemBehavior(data: any) {
        try {
          const res = await addItemApi?.(data);
          if (res?.data) {
            this.getListBehavior()
          }
        } catch (error) {
          console.log(error);
        }
      },
      /**
      * @description 删除数据的方法
      * @param id 删除数据的id
     */
      async deleteItemBehavior(id: any) {
        const { listData, pageSize, pageNum, isLast } = this.data[namespace];
        try {
          const res = await deleteItemApi?.(id);
          if (res?.data) {
            const deleteIdx = listData.findIndex(
              (item: any) => item[key] === id
            );
            if (deleteIdx !== -1) {
              listData.splice(deleteIdx, 1);
              if (!isLast) {
                const pushDataRes = await getListApi({
                  pageSize: 1,
                  pageNum: pageNum * pageSize,
                });
                listData.push(pushDataRes.listData[0]);
                this.setData({
                  [namespace]: {
                    ...this.data[namespace],
                    listData: [...listData],
                    total: pushDataRes.total,
                    isLast: pushDataRes.isLast,
                  },
                });
              } else {
                this.setData({
                  [namespace]: {
                    ...this.data[namespace],
                    listData: [...listData],
                  },
                });
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
    },
  });
};
export default BehaviorWithList;
