import { computed, definePage, onLoad, ref } from "@vue-mini/core";

definePage({
  setup(query, ctx) {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    const increment = () => {
      count.value++;
    };
    onLoad(() => {});
    return {
      increment,
      count,
      doubleCount,
    };
  },
});
