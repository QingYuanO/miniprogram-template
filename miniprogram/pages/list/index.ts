// pages/list/index.ts

import useInfiniteList from "@/hooks/useInfiniteList";
import { computed, definePage, watch } from "rubic";

definePage({
  setup(props, ctx) {
    const { listData } = useInfiniteList<number>({
      isAutoInitLoad: true,
      isAutoFetchNext: true,
      fetchListApi: data => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              list: new Array(10).fill(1),
              total: 8,
              hasNextPage: false,
            });
          }, 1000);
        });
      },
    });
    console.log(listData.value);
    watch(listData, () => {
      console.log(listData.value);
    });
    return {
      listData,
    };
  },
});
