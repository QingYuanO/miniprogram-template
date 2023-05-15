import { useCounterStore } from "@/stores/counter";
import { computed, definePage, onLoad, ref, storeToRefs } from "rubic";

definePage({
  setup(query, ctx) {
    const store = useCounterStore();
    const { count, doubleCount } = storeToRefs(store);
    onLoad(() => {});
    return {
      increment: store.increment,
      count,
      doubleCount,
    };
  },
});
