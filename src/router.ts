import { createRouter, createWebHashHistory } from 'vue-router';

import { KEY_TOKEN, LINK } from './utils';

NProgress.configure({
  easing: 'ease', // Animation method
  speed: 500, // Incremental progress bar speed
  showSpinner: true, // Whether to display loading ico
  trickleSpeed: 200, // Auto increment interval
  minimum: 0.3, // Minimum percentage at initialization
});

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: `${!localStorage.getItem(KEY_TOKEN) ? LINK.Login : LINK.Dashboard}`,
    },
    {
      path: LINK.Auth,
      component: () => import('@/layouts/auth/index.vue'),
      redirect: LINK.Login,
      children: [
        {
          path: LINK.Login,
          component: () => import('@/pages/base/login/index.vue'),
        },
      ],
    },
  ],
  // When refreshing, the scroll bar position is restored
  scrollBehavior: () => ({ left: 0, top: 0 }),
});
//导航守卫
router.beforeEach(async (_, __, next) => {
  // NProgess开始
  NProgress.start();

  // 动态设置标题
  // document.title = to.meta.title ? `${to.meta.title} - ${GLOB_APP_TITLE}` : GLOB_APP_TITLE;

  // // 获取token
  // const token = localCache.getCache(USER_TOKEN);

  // // 已登录状态进入登录页面跳转主页
  // if (token && to.path === GLOB_APP_LOGIN) {
  //   return next({ path: GLOB_APP_HOME });
  // }

  // // 判断是否在白名单
  // if (RROUTER_WHITLE.indexOf(to.path) > -1) {
  //   return next();
  // }

  // // 判断是否有 Token，没有重定向到 login
  // if (!token) return next({ path: GLOB_APP_LOGIN, replace: true });

  // // 如果没有菜单列表，就重新请求菜单列表并添加动态路由
  // const userStore = UserStore();
  // if (!userStore.userMenuList.length) {
  //   await initdynamicRouter();
  //   return next({ ...to, replace: true });
  // }

  next();
});

router.afterEach(() => {
  NProgress.done();
});

router.onError(error => {
  NProgress.done();
  console.warn('Routing Error', error.message);
});
export default router;
