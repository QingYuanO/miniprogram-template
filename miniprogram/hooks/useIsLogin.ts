import { Ref, computed } from "@vue-mini/core";
import useLocalState from "./useLocalState";

export default function useIsLogin(ref?: Ref<String>) {
  const token = ref ?? useLocalState<string>("token");
  const isLogin = computed(() => !!token.value);
  return isLogin;
}
