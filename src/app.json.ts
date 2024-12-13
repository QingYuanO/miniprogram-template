import { defineAppJson } from 'weapp-vite/json';

export default defineAppJson({
  pages: ['pages/index/index', 'pages/list/index', 'pages/login/index', 'pages/403/index', 'pages/someNeedAuthPage/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Weixin',
    navigationBarTextStyle: 'black',
  },
  sitemapLocation: 'sitemap.json',
  usingComponents: {
    show: '@/components/show/index',
    iconfont: '@/components/iconfont/iconfont',
  },
  lazyCodeLoading: 'requiredComponents',
});
