import { toLoginPage, toListPage, toSomeNeedAuthPage } from "@/utils/toRoutePage";
import useBoolean from "@/hooks/useBoolean";
import useLocalState from "@/hooks/useLocalState";
import useIsLogin from "@/hooks/useIsLogin";
import { defineComponent, computed } from "@vue-mini/core";
import useAccessFun from "@/hooks/useAccessFun";

defineComponent({
  setup() {
    const [visible, { toggle }] = useBoolean(false);
    const token = useLocalState<string>("token");
    const isLogin = useIsLogin(token);
    const visibleStr = computed(() => visible.value.toString());
    const loginTitle = computed(() => (isLogin.value ? "登出" : "登录"));
    const auth = () => {
      if (isLogin.value) {
        token.value = "";
      } else {
        toLoginPage({});
      }
    };

    return {
      visible,
      visibleStr,
      loginTitle,
      auth,
      toggle,
      toSomeNeedAuthPage: useAccessFun(toSomeNeedAuthPage),
      toListPage,
    };
  },
});
