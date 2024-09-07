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
}

// TODO: give every route a name
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: RouteNames.HOME,
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'signup',
        component: () => import('pages/SignUpPage.vue'),
      },
      {
        path: 'login',
        component: () => import('pages/LogInPage.vue'),
      },
      {
        name: RouteNames.CREATE_POST,
        path: 'posts',
        component: () => import('src/models/post/pages/CreatePostPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.EDIT_DRAFTS,
        path: 'posts/drafts',
        component: () => import('src/models/post/pages/EditDraftsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.EDIT_PUBLISHED,
        path: 'posts/published',
        component: () => import('src/models/post/pages/EditPublishedPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.POST_HISTORY,
        path: 'posts/history',
        component: () => import('src/models/post/pages/PostHistoryPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        name: RouteNames.READ_POST,
        path: 'posts/:postId',
        component: () => import('src/models/post/pages/ReadPostPage.vue'),
      },
      {
        path: 'programming',
        component: () => import('pages/ProgrammingPage.vue'),
      },
      {
        path: 'theme',
        component: () => import('pages/ThemePage.vue'),
      },
      {
        name: RouteNames.PERSONS,
        path: 'persons',
        component: () => import('pages/PersonsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
