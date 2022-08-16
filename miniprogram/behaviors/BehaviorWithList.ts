type ListApiStatus = "ok" | "fail";
interface IListResult {
  listData?: any[];
  total?: number;
  isLast?: boolean;
  // status: ListApiStatus;
}
interface IListOperationResult {
  // status: ListApiStatus;
  data?: any;
}
interface IGetListParams {
  pageSize: number;
  pageNum: number;
  type: GetListType;
  [key: string]: any;
}
/**
 * @description 控制获取列表接口是初始化数据，还是翻页操作。
 */
type GetListType = "initial" | "loadMore";

interface IBehaviorWithList {
  /**
   * @description 注入data的名称
   */
  namespace: string;
  /**
   * @description 默认每页数量
   */
  defaultPageSize?: number;
  /**
   * @description 每项数据的唯一标识，默认【id】
   */
  key?: string;
  /**
   * @description 是否滚动到底部自动下一页,不用手动调用nextPageBehavior
   */
  isAutoNextPage?: boolean;
  /**
   * @description 是否自动在onLoad中初始化第一页数据,不用手动调用getListBehavior
   */
  isAutoLoad?: boolean;
  /**
   * @description 获取列表数据的接口，调用成功时必须返回{isLast:boolean,listData:array,total:number}
   */
  getListApi: (params: Omit<IGetListParams, "type">) => Promise<IListResult>;
  /**
   * @description 新增数据的接口
   */
  addItemApi?: (data: any) => Promise<IListOperationResult>;
  /**
   * @param data:更新的数据
   * @description 参数data必须包含唯一标识取参数key的值，默认为【id】
   */
  updateItemApi?: (data: any) => Promise<IListOperationResult>;
  /**
   * @description 删除数据的接口
   */
  deleteItemApi?: (id: any) => Promise<IListOperationResult>;
}

export interface BehaviorWithListInjectData<L = unknown> {
  pageSize?: number;
  pageNum?: number;
  listData?: L[];
  total?: number;
  isLast?: boolean;
}

export interface BehaviorWithListInjectOption {
  /**
   * @description 下一页操作
   */
  nextPageBehavior?: (extraData?: Record<string, any>) => void;
  onSearchBehavior?: (searchData: Record<string, any>) => void;
  /**
   * @description 获取列表数据的方法
   */
  getListBehavior?: (params?: IGetListParams) => void;
  /**
   * @description 修改列表数据的方法
   */
  updateItemBehavior?: (data: any) => Promise<any>;
  /**
   * @description 添加列表数据的方法
   */
  addItemBehavior?: (data: any) => Promise<any>;
  /**
   * @description 删除列表数据的方法
   */
  deleteItemBehavior?: (id: any) => Promise<any>;
  //获取列表需要的额外的page data
  listExtraData?: string[];
}

/**
 *
 * @description 注入列表的增、删、改、查逻辑的behavior
 */
const BehaviorWithList = (params: IBehaviorWithList) => {
  const {
    key = "id",
    namespace,
    isAutoNextPage,
    isAutoLoad,
    defaultPageSize = 10,
    getListApi,
    deleteItemApi,
    updateItemApi,
    addItemApi,
  } = params;
  return Behavior({
    definitionFilter(defFields: any) {
      const onReachBottom = defFields?.methods?.onReachBottom;
      const onLoad = defFields?.methods?.onLoad;

      const getListExtraData = (pageData: Record<string, any>) => {
        const listExtraData = defFields?.listExtraData as string[];
        if (listExtraData && listExtraData.length > 0) {
          return Object.entries(pageData).reduce(
            (total: Record<string, any>, [key, val]) => {
              if (listExtraData.includes(key)) {
                total[key] = val;
              }
              return total;
            },
            {}
          );
        }
        return {};
      };
      if (isAutoNextPage && defFields.methods) {
        defFields.methods.onReachBottom = function () {
          this.nextPageBehavior({ ...getListExtraData(this.data) });
          onReachBottom && onReachBottom.call(this);
        };
      }
      if (isAutoLoad && defFields.methods) {
        defFields.methods.onLoad = async function () {
          onLoad && (await onLoad.call(this));
          wx.nextTick(() => {
            //onLoad中如果想要注入listExtraData中定义的data，并保持和页面一致，页面中的onLoad必须为async方法，内部保持同步的方式写代码
            this.getListBehavior({
              pageNum: 1,
              pageSize: defaultPageSize,
              type: "initail",
              ...getListExtraData(this.data),
            });
          });
        };
      }
    },
    data: {
      [namespace]: {
        pageSize: defaultPageSize ?? 10,
        pageNum: 1,
        listData: [],
        total: 0,
        isLast: false,
        isFetch: false,
      },
      _searchData: {},
    },
    methods: {
      /**
       * @description 获取下一页数据
       * @param extraData Record<string, any>【将会被注入到获取列表数据的接口参数中】
       */
      nextPageBehavior(extraData?: Record<string, any>) {
        const { pageNum, pageSize, isFetch, isLast } = this.data[namespace];
        if (!isLast && !isFetch) {
          this.getListBehavior({
            ...extraData,
            pageNum: pageNum + 1,
            pageSize,
            type: "loadMore",
          });
        }
      },
      onSearchBehavior(searchData: Record<string, any> = {}) {
        const { pageSize } = this.data[namespace];
        this.getListBehavior({
          pageNum: 1,
          pageSize,
          type: "initial",
          ...searchData,
        });
        this.setData({
          _searchData: searchData,
        });
      },
      /**
       * @description 获取列表数据
       * @param params  pageSize?: number; pageNum: number; type?: 'initial' | 'loadMore', ...otherParams
       */
      async getListBehavior(params?: IGetListParams) {
        const { listData, isFetch } = this.data[namespace];
        const { pageNum, pageSize, type, ...extraData } = params ?? {
          type: "initial",
          pageSize: defaultPageSize,
          pageNum: 1,
        };
        if (!isFetch) {
          this.setData({
            [namespace]: { ...this.data[namespace], isFetch: true },
          });
          try {
            const { ...data } = await getListApi({
              pageNum,
              pageSize,
              ...extraData,
              ...this.data._searchData,
            });

            if (
              typeof data.isLast !== "boolean" ||
              !(data.listData instanceof Array) ||
              typeof data.total !== "number"
            ) {
              throw new Error(
                "请在【getListApi】返回成功的情况下返回{isLast:boolean,listData:array,total:number}数据"
              );
            }
            const updateData = {
              ...this.data[namespace],
              ...(data ?? {}),
              isFetch: false,
              pageNum,
              pageSize,
            };
            if (type === "initial") {
              this.setData({
                [namespace]: updateData,
              });
            } else {
              this.setData({
                [namespace]: {
                  ...updateData,
                  listData: listData.concat(data.listData),
                },
              });
            }
          } catch (error) {
            console.log(error);
            throw new Error(error);
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
          return res?.data;
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      },
      /**
       * @description 新增数据的方法
       * @param data 新增的数据
       */
      async addItemBehavior(data: any) {
        try {
          const res = await addItemApi?.(data);

          this.getListBehavior();
          return res?.data;
        } catch (error) {
          console.log(error);
          throw new Error(error);
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

          const deleteIdx = listData.findIndex((item: any) => item[key] === id);
          if (deleteIdx !== -1) {
            //删除本地数据
            listData.splice(deleteIdx, 1);
            if (!isLast) {
              //如果不是最后一页，将会请求当前页的最后一条数据补齐列表，保证页码准确
              const { total, isLast, listData: newListData } = await getListApi(
                {
                  pageSize: 1,
                  pageNum: pageNum * pageSize,
                }
              );
              if (newListData?.[0]) {
                listData.push(newListData[0]);
                this.setData({
                  [namespace]: {
                    ...this.data[namespace],
                    listData: [...listData],
                    total,
                    isLast,
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
            } else {
              this.setData({
                [namespace]: {
                  ...this.data[namespace],
                  listData: [...listData],
                },
              });
            }
          }
          return res?.data;
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }
      },
    },
  });
};
export default BehaviorWithList;
