import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

/*
Be careful when using SSR for cross-request state pollution
due to creating a Singleton instance here;
If any client changes this (global) instance, it might be a
good idea to move this instance creation inside of the
"export default () => {}" function below (which runs individually
for each client)
*/

export enum ApiPath {
  PERSONS = '/persons',
  POSTS = '/posts',
}

const api_addr = import.meta.env.NB_API_ADDR as string;

axios.defaults.withCredentials = true;
axios.defaults.baseURL = api_addr;

const api = axios.create({
  baseURL: api_addr,
  withCredentials: true,
});

export { axios, api };

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  // app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});
