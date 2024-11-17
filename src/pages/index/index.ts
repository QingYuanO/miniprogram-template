import { computed, defineComponent } from '@vue-mini/core';

import useAccessFun from '@/hooks/useAccessFun';
import useBoolean from '@/hooks/useBoolean';
import useIsLogin from '@/hooks/useIsLogin';
import useLocalState from '@/hooks/useLocalState';
import { toListPage, toLoginPage, toSomeNeedAuthPage } from '@/utils/toRoutePage';

defineComponent({
  setup() {
    const [visible, { toggle }] = useBoolean(false);
    const token = useLocalState<string>('token');
    const isLogin = useIsLogin(token);
    const visibleStr = computed(() => visible.value.toString());
    const loginTitle = computed(() => (isLogin.value ? '登出' : '登录'));
    const auth = () => {
      if (isLogin.value) {
        token.value = '';
      } else {
        toLoginPage();
      }
    };

    const toSomeNeedAuthPageWithAuth = useAccessFun(toSomeNeedAuthPage);

    return {
      visible,
      visibleStr,
      loginTitle,
      auth,
      toggle,
      toSomeNeedAuthPage: toSomeNeedAuthPageWithAuth,
      toListPage,
    };
  },
});
