import { observable, action } from "mobx-miniprogram";

export interface GlobalData {
  numA: number;
  numB: number;
  readonly sum: number;
}
export interface GlobalOption {
  update(): void;
}

interface GlobalObservable extends GlobalData, GlobalOption {}

export const global = observable<GlobalObservable>({
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
    });
  },
});
