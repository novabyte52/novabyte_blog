import { RouteRecordRaw } from 'vue-router';

export enum RouteNames {
  HOME = 'home',
  CREATE_POST = 'create-post',
  READ_POST = 'read-post',
  EDIT_POST = 'edit-post',
}

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
      },
      {
        name: RouteNames.READ_POST,
        path: 'posts/:postId',
        component: () => import('src/models/post/pages/ReadPostPage.vue'),
      },
      {
        name: RouteNames.EDIT_POST,
        path: 'posts/:postId/edit',
        component: () => import('src/models/post/pages/EditPostPage.vue'),
      },
      {
        path: 'programming',
        component: () => import('pages/ProgrammingPage.vue'),
      },
      {
        path: 'theme',
        component: () => import('pages/ThemePage.vue'),
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
