import { observable, action } from "mobx-miniprogram";

export interface UserData {
  numA: number;
  numB: number;
  readonly sum: number;
}
export interface UserOption {
  update_user(): void;
}

interface UserObservable extends UserData, UserOption {}

export const user = observable<UserObservable>({
  numA: 1000,
  numB: 1000,

  get sum() {
    return this.numA + this.numB;
  },

  update_user: function () {
    action(() => {
      const sum = this.sum;
      this.numA = this.numB;
      this.numB = sum;
    });
  },
});
