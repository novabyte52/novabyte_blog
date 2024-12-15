import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { useLogger } from 'src/composables/useLogger';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const logger = useLogger('router');

export default route(function (/* { store, ssrContext } */) {
  const isSSR = !!process.env.SERVER;
  logger.debug(`Application running in ${isSSR ? 'SSR' : 'Client-side'} mode`);

  try {
    const basePath = process.env.VUE_ROUTER_BASE;

    if (!basePath) {
      logger.warn('VUE_ROUTER_BASE is undefined. Falling back to default "/"');
    } else if (!basePath.startsWith('/')) {
      logger.warn(
        `Unexpected VUE_ROUTER_BASE: ${basePath}. Ensure it starts with "/"`
      );
    }

    const createHistory = isSSR
      ? createMemoryHistory
      : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

    logger.debug(
      `Router history mode: ${
        isSSR
          ? 'Memory'
          : process.env.VUE_ROUTER_MODE === 'history'
          ? 'WebHistory'
          : 'WebHash'
      }`
    );

    const Router = createRouter({
      scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
          logger.debug(
            `Restoring scroll position to: ${JSON.stringify(savedPosition)}`
          );
          return savedPosition;
        } else {
          logger.debug('Default scroll reset: { left: 0, top: 0 }');
          return { left: 0, top: 0 };
        }
      },
      routes,

      // Leave this as is and make changes in quasar.conf.js instead!
      // quasar.conf.js -> build -> vueRouterMode
      // quasar.conf.js -> build -> publicPath
      history: createHistory(process.env.VUE_ROUTER_BASE),
    });

    // just added
    Router.beforeEach((to, from, next) => {
      logger.debug(
        `Navigating from ${String(from.name || 'unknown')} to ${String(
          to.name
        )}`
      );
      next();
    });

    Router.afterEach((to) => {
      logger.debug(`Successfully navigated to ${String(to.name)}`);
    });

    Router.onError((error) => {
      logger.err(`Router navigation error: ${error.message} | ` + error);
    });

    logger.debug('Router instance created successfully.');

    Router.push('/');

    return Router;
  } catch (error) {
    logger.err('Failed to create router instance: ' + error);
    throw error;
  }
});
