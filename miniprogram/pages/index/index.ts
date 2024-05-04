import { toLoginPage, toListPage, toSomeNeedAuthPage } from "@/utils/toRoutePage";
import { computed, definePage } from "rubic";
import useBoolean from "@/hooks/useBoolean";
import useLocalState from "@/hooks/useLocalState";
import useIsLogin from "@/hooks/useIsLogin";
import { createNormalAuthBehavior } from "@/behaviors/BehaviorWithAuth";

const auth = createNormalAuthBehavior({ isPageNeedLogin: true, accessPageNeed: [] });

definePage({
  setup(props, ctx) {
    console.log(ctx);

    const [visible, { toggle }] = useBoolean();
    const [, setToken] = useLocalState<string>("token");
    const isLogin = useIsLogin();
    const visibleStr = computed(() => visible.value.toString());
    const loginTitle = computed(() => (isLogin.value ? "登出" : "登录"));
    const auth = () => {
      if (isLogin.value) {
        setToken("");
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
      toSomeNeedAuthPage,
      toListPage,
    };
  },
  behaviors: [auth],
});
