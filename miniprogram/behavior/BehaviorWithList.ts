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
    [key: string]: any;
}

interface IBehaviorWithList<D> {
    namespace: string;
    /**
     * 每项数据的唯一标识，默认【id】
     */
    key?: string;
    pageSize?: number;
    getListApi: (params: IGetListParams) => Promise<IListResult>;
    addItemApi?: (data: D) => Promise<RequestPrimoseResult>;
    /**
     * @param data:更新的数据
     * @description 参数data必须包含唯一标识取参数key的值，默认为【id】
     */
    updateItemApi?: (data: D) => Promise<RequestPrimoseResult>;
    deleteItemApi?: (id: any) => Promise<RequestPrimoseResult>;
}

export interface BehaviorWithListReturnData {
    pageSize?: number
    pageNum?: number;
    listData?: any[];
    total?: number;
    isLast?: boolean;
}
export interface BehaviorWithListReturnOption {
    nextPage: () => void;
    getList: () => Promise<any>;
    updateItem: (data: any) => Promise<any>;
    addItem: (data: any) => Promise<any>;
    deleteItem: (id: any) => Promise<any>;
}

const BehaviorWithList = <D>(params: IBehaviorWithList<D>) => {
    const pageSize = params.pageSize ?? 10;
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
                pageSize: pageSize,
                pageNum: 1,
                listData: [],
                total: 0,
                isLast: false,
            },
        },

        watch: {
            [`${namespace}.pageNum`]: function (data) {
                console.log(data);
                if (data === 1) {
                    this.getList('init')
                } else {
                    this.getList('push')
                }
            },
        },
        methods: {
            nextPage() {
                const { pageNum } = this.data[namespace];
                if (!this.data[namespace].isLast) {
                    this.setData({
                        [namespace]: { ...this.data[namespace], pageNum: pageNum + 1 },
                    });
                }
            },
            async getList(type: 'init' | 'push' = 'init') {
                const { pageNum, pageSize, listData } = this.data[namespace];
                const res = await getListApi({
                    pageNum,
                    pageSize,
                });
                if (type === 'init') {
                    this.setData({
                        [namespace]: { ...this.data[namespace], ...res },
                    });
                } else {
                    this.setData({
                        [namespace]: { ...this.data[namespace], ...res, listData: listData.concat(res.listData) },
                    });
                }

            },
            async updateItem(data: any) {
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
            async addItem(data: any) {
                try {
                    const res = await addItemApi?.(data);
                    if (res?.data) {
                        this.setData({
                            [namespace]: {
                                ...this.data[namespace],
                                pageNum: 1,
                            },
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            async deleteItem(id: any) {
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
                                listData.push(pushDataRes.listData[1]);
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
