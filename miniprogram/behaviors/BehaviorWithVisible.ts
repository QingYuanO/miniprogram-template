type CallbackType = () => void;
const BehaviorWithVisible = (prefix: string, initValue: boolean = false) => {
  const visibleStr = `${prefix}Visible`;
  return Behavior({
    data: {
      [visibleStr]: initValue,
    },
    methods: {
      [`${prefix}Toggle`](callback?: CallbackType) {
        const visible = this.data[visibleStr];
        this.setData(
          {
            [visibleStr]: !visible,
          },
          () => {
            if (typeof callback === "function") {
              callback?.();
            }
          }
        );
      },
      [`${prefix}Show`](callback?: CallbackType) {
        this.setData(
          {
            [visibleStr]: true,
          },
          () => {
            if (typeof callback === "function") {
              callback?.();
            }
          }
        );
      },
      [`${prefix}Hide`](callback?: CallbackType) {
        this.setData(
          {
            [visibleStr]: false,
          },
          () => {
            if (typeof callback === "function") {
              callback?.();
            }
          }
        );
      },
    },
  });
};

export default BehaviorWithVisible;
