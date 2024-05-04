import { defineComponent, ref, watch } from "@vue-mini/core";

/**
 * @description  初始如果when为false，不渲染组件；一旦when设置为true，渲染组件。后续的显示隐藏由display控制
 */
defineComponent({
  properties: {
    when: Boolean,
  },
  setup(props) {
    const isChildrenLoad = ref(false);

    watch(
      () => props.when,
      when => {
        if (when && !isChildrenLoad.value) {
          isChildrenLoad.value = true;
        }
      }
    );
    return {
      isChildrenLoad,
      when: props.when,
    };
  },
});
