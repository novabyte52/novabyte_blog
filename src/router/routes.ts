import { useLogger } from 'src/composables/useLogger';
import { RouteRecordRaw } from 'vue-router';

export enum RouteNames {
  HOME = 'home',
  CREATE_POST = 'create-post',
  READ_POST = 'read-post',
  EDIT_POST = 'edit-post',
  EDIT_DRAFTS = 'edit-drafts',
  EDIT_PUBLISHED = 'edit-published',
  POST_HISTORY = 'post-history',
  PERSONS = 'persons',
  LOGIN = 'login',
  ABOUT = 'about',
}

const logger = useLogger('routes');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => {
      if (import.meta.env.SSR) {
        logger.debug('SSR rendering MainLayout');
      }
      return import('layouts/MainLayout.vue');
    },
    children: [
      {
        name: RouteNames.HOME,
        path: '',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering IndexPage');
          }
          return import('pages/IndexPage.vue');
        },
      },
      {
        path: 'signup',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering SignupPage');
          }
          return import('pages/SignUpPage.vue');
        },
      },
      {
        name: RouteNames.LOGIN,
        path: 'login',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering LogInPage');
          }
          return import('pages/LogInPage.vue');
        },
      },
      {
        name: RouteNames.ABOUT,
        path: 'about',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering AboutPage');
          }
          return import('pages/AboutPage.vue');
        },
      },
      {
        name: RouteNames.CREATE_POST,
        path: 'posts',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering CreatePostPage');
          }
          return import('src/models/post/pages/CreatePostPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.EDIT_DRAFTS,
        path: 'posts/drafts',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering EditDraftsPage');
          }
          return import('src/models/post/pages/EditDraftsPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.EDIT_PUBLISHED,
        path: 'posts/published',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering EditPublishedposts');
          }
          return import('src/models/post/pages/EditPublishedPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.POST_HISTORY,
        path: 'posts/history',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering PostHistoryPage');
          }
          return import('src/models/post/pages/PostHistoryPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.READ_POST,
        path: 'posts/:postId',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering ReadPostPage');
          }
          return import('src/models/post/pages/ReadPostPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        path: 'programming',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering ProgrammingPage');
          }
          return import('pages/ProgrammingPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        path: 'theme',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering ThemePage');
          }
          return import('pages/ThemePage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.PERSONS,
        path: 'persons',
        component: () => {
          if (import.meta.env.SSR) {
            logger.debug('SSR rendering PersonsPage');
          }
          return import('pages/PersonsPage.vue');
        },
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  {
    path: '/:catchAll(.*)*',
    component: () => {
      if (import.meta.env.SSR) {
        logger.debug('SSR rendering ErrorNotFound');
      }
      return import('pages/ErrorNotFound.vue');
    },
  },
];

export default routes;
