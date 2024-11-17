// pages/list/index.ts

import useInfiniteList from "@/hooks/useInfiniteList";
import { defineComponent, watch } from "@vue-mini/core";

defineComponent({
  setup() {
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
