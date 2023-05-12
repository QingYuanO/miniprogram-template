import { computed, definePage, ref } from "rubic";


definePage({
  setup(query, ctx) {
    const count = ref(0);
    const doubleCount = computed(() => count.value * 2);
    const increment = () => {
      count.value++;
    };
    return {
      count,
      doubleCount,
      increment,
    };
  },
});
