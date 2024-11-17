import { onLoad, onReachBottom, ref, shallowRef } from '@vue-mini/core';

type SearchType = Record<string, any>;

type ListParams = {
  page: number;
  pageSize: number;
  search?: SearchType;
};

type ListData<D> = {
  list: D[];
  hasNextPage: boolean;
  total: number;
};

type UseInfiniteListParams<D> = {
  fetchListApi: (data: ListParams) => Promise<ListData<D>>;
  id?: string;
  defaultPageSize?: number;
  isAutoInitLoad?: boolean;
  isAutoFetchNext?: boolean;
};

function useInfiniteList<D = unknown>(option: UseInfiniteListParams<D>) {
  const { fetchListApi, defaultPageSize = 10, isAutoInitLoad, isAutoFetchNext } = option;
  const listParams = ref<ListParams>({
    page: 1,
    pageSize: defaultPageSize,
  });
  const listData = shallowRef<ListData<D>>({
    list: [],
    total: 0,
    hasNextPage: true,
  });
  const isInitLoading = ref<boolean>(false);
  const isFetchNext = ref<boolean>(false);

  onLoad(() => {
    if (isAutoInitLoad) {
      initLoadList();
    }
  });

  onReachBottom(() => {
    if (isAutoFetchNext) {
      fetchNextPage();
    }
  });

  const initLoadList = async (externalSearch: SearchType = {}) => {
    if (isInitLoading.value) return;
    try {
      isFetchNext.value = true;
      const { search } = listParams.value;
      const realSearch = { ...(search ?? {}), ...externalSearch };

      const data = await fetchListApi({
        page: 1,
        pageSize: defaultPageSize,
        ...realSearch,
      });

      listData.value = data;
      listParams.value = {
        page: 2,
        pageSize: listParams.value.pageSize,
        search: realSearch,
      };
    } catch (error) {
      isInitLoading.value = false;
      console.log(error);
    } finally {
      isInitLoading.value = false;
      isFetchNext.value = false;
    }
  };
  const fetchNextPage = async (externalSearch: SearchType = {}) => {
    if (!listData.value.hasNextPage || isFetchNext.value) return;
    try {
      isFetchNext.value = true;
      const { page, pageSize, search } = listParams.value;
      const realSearch = { ...(search ?? {}), ...externalSearch };
      const data = await fetchListApi({
        page,
        pageSize,
        ...realSearch,
      });
      isFetchNext.value = false;
      listData.value = {
        ...data,
        list: listData.value.list.concat(data.list),
      };
      listParams.value = {
        page: page + 1,
        pageSize,
        search: realSearch,
      };
    } catch (error) {
      isFetchNext.value = false;
      console.log(error);
    }
  };

  return {
    listData,
    isFetchNext,
    isInitLoading,
    fetchNextPage,
    initLoadList,
  };
}

export default useInfiniteList;
