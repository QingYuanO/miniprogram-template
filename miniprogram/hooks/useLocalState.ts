import { Ref, UnwrapRef, onShow, ref } from "rubic";

export default function useLocalState<D = unknown>(key: string): [Ref<UnwrapRef<D>>, (value: UnwrapRef<D>) => void] {
  const data = ref<D>(wx.getStorageSync<D>(key));
  onShow(() => {
    data.value = wx.getStorageSync(key);
  });
  const setValue = (value: UnwrapRef<D>) => {
    data.value = value;
    wx.setStorageSync(key, value);
  };
  return [data, setValue];
}
