import { computed } from "rubic";
import useLocalState from "./useLocalState";

export default function useIsLogin() {
  const [token] = useLocalState<string>("token");
  const isLogin = computed(() => !!token.value);
  return isLogin;
}
