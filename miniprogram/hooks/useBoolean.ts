import { Ref, ref } from "rubic";

export default function useBoolean(initialValue?: boolean): [
  Ref<boolean>,
  {
    setFalse: () => void;
    setTrue: () => void;
    toggle: () => void;
  }
] {
  const value = ref(initialValue ?? false);
  const setFalse = () => {
    value.value = false;
  };
  const setTrue = () => {
    value.value = true;
  };
  const toggle = () => {
    value.value = !value.value;
  };
  return [
    value,
    {
      setFalse,
      setTrue,
      toggle,
    },
  ];
}
