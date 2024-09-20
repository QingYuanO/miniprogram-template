import { customRef, onShow, Ref } from '@vue-mini/core';

export default function useLocalState<D = unknown>(key: string, defaultValue?: D): Ref<D> {
  const value = customRef<D>((track, trigger) => {
    return {
      get() {
        track();
        return wx.getStorageSync<D>(key) || defaultValue!;
      },
      set(newValue) {
        wx.setStorageSync<D>(key, newValue);
        trigger();
      },
    };
  });

  onShow(() => {
    value.value = wx.getStorageSync<D>(key) || defaultValue!;
  });

  return value;
}
