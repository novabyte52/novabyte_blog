// import { useLogger } from 'src/composables/useLogger';
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

// const logger = useLogger('routes');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => {
      return import('layouts/MainLayout.vue');
    },
    children: [
      {
        name: RouteNames.HOME,
        path: '//',
        component: () => {
          return import('pages/IndexPage.vue');
        },
      },
      {
        path: '/signup',
        component: () => {
          return import('pages/SignUpPage.vue');
        },
      },
      {
        name: RouteNames.LOGIN,
        path: '/login',
        component: () => {
          return import('pages/LogInPage.vue');
        },
      },
      {
        name: RouteNames.ABOUT,
        path: '/about',
        component: () => {
          return import('pages/AboutPage.vue');
        },
      },
      {
        name: RouteNames.CREATE_POST,
        path: '/posts',
        component: () => {
          return import('src/models/post/pages/CreatePostPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.EDIT_DRAFTS,
        path: '/posts/drafts',
        component: () => {
          return import('src/models/post/pages/EditDraftsPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.EDIT_PUBLISHED,
        path: '/posts/published',
        component: () => {
          return import('src/models/post/pages/EditPublishedPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.POST_HISTORY,
        path: '/posts/history',
        component: () => {
          return import('src/models/post/pages/PostHistoryPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.READ_POST,
        path: '/posts/:postId',
        component: () => {
          return import('src/models/post/pages/ReadPostPage.vue');
        },
      },
      {
        path: '/programming',
        component: () => {
          return import('pages/ProgrammingPage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        path: '/theme',
        component: () => {
          return import('pages/ThemePage.vue');
        },
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.PERSONS,
        path: '/persons',
        component: () => {
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
      return import('pages/ErrorNotFound.vue');
    },
  },
];

export default routes;
