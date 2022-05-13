/**
 * @description  初始如果when为false，不渲染组件；一旦when设置为true，渲染组件。后续的显示隐藏由display控制
 */
Component<
  { isChildrenLoad: boolean },
  {
    when: BooleanConstructor;
  },
  Record<string, any>,
  any
>({
  options: {
    multipleSlots: true,
  },
  properties: {
    when: Boolean,
  },

  data: {
    isChildrenLoad: false,
  },
  observers: {
    when: function (when) {
      if (when && !this.data.isChildrenLoad) {
        this.setData({
          isChildrenLoad: true,
        });
      }
    },
  },
});
