import { observable, action, autorun, runInAction } from "mobx-miniprogram";

export type GlobalType = typeof global

export const global = observable({
  numA: 1,
  numB: 2,

  get sum() {
    return this.numA + this.numB;
  },

  update: function () {
    action(() => {
      const sum = this.sum;
      this.numA = this.numB;
      this.numB = sum;
    })
  },
});
autorun(() => {
  console.log(global.numA);
});
