import { boot } from 'quasar/wrappers';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { usePersonStore } from 'src/models/person';
// import cookie from 'cookie';

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
axios.defaults.withCredentials = true;
export const api = axios.create();

const personStore = usePersonStore();

api.interceptors.request.use((config) => {
  const token = personStore.getToken();
  if (!token) {
    console.log('no token but a request was made!');
    personStore.logOut();
    return config;
  }

  config.headers['Authorization'] = token;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const { response, config } = err;

    if (response?.status === 401) {
      if (response.data === 'Missing refresh token.') {
        personStore.logOut();
        return;
      }

      if (response && config) {
        try {
          const token = await personStore.refresh();

          if (token) {
            personStore.setToken(token);
            config.headers['Authorization'] = `${token}`;
            return api(config);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }

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
