/**
 * @description  初始如果when为false，不渲染组件；一旦when设置为true，渲染组件。后续的显示隐藏由display控制
 */
Component<
  { isShowChildrenLoad: boolean,isHideChildrenLoad: boolean },
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
    isShowChildrenLoad: false,
    isHideChildrenLoad:false
  },
  observers: {
    when: function (when) {
      if (when && !this.data.isShowChildrenLoad) {
        this.setData({
          isShowChildrenLoad: true,
        });
      }
      if(!when && !this.data.isHideChildrenLoad){
        this.setData({
          isHideChildrenLoad: true,
        });
      }
    },
  },
});
