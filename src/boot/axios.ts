import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
axios.defaults.baseURL = 'http://127.0.0.1:52001';
export const api = axios.create();

api.interceptors.request.use((config) => {
  console.log('config:', config);
  const token = localStorage.getItem('nbToken');
  if (token) config.headers['Authorization'] = `${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err;

    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await api.post('/persons/refresh', {
            refresh: refreshToken,
          });

          const token = res.data.nbToken;
          if (token) {
            localStorage.setItem('nbToken', token);
            config.headers['Authorization'] = `${token}`;
            return api(config);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

    // logout();
    return err;
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export type ApiPath = '/persons' | '/posts';
