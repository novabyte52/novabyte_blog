<template>
  <router-view />
</template>

<script setup lang="ts">
import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { storeToRefs } from 'pinia';
import { usePersonStore } from 'src/models/person';
import { useNovaStore } from 'src/stores/nova.store';
import { watch } from 'vue';
import { api } from './boot/axios';
import { useRouter } from 'vue-router';
import { RouteNames } from './router/routes';

const router = useRouter();

// export type ApiPath = '/persons' | '/posts';

api.defaults.baseURL = 'http://127.0.0.1:52001';
api.defaults.withCredentials = true;

const ps = usePersonStore();
const nova = useNovaStore();
const { noPersonButToken, currentPerson, isAuthenticated } = storeToRefs(
  useNovaStore()
);

watch(
  noPersonButToken,
  async () => {
    const token = nova.getToken();
    if (!token) throw new Error('Expected token.');

    const claims = jwtDecode(token);
    if (!claims.sub) throw new Error('Expected jwt subject.');

    currentPerson.value = await ps.getPerson(claims.sub);
    ps.addPerson(currentPerson.value);
    noPersonButToken.value = false;
  },
  { immediate: true }
);

nova.checkForToken();

api.interceptors.request.use((config) => {
  const token = nova.getToken();
  if (!token) {
    console.log('no token but a request was made!');
    nova.logOut();
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
      if (response.data === 'You are not authorized to access this endpoint.') {
        throw Error('You are not authorized to access this endpoint.');
      }

      if (
        response.data === 'Missing refresh token.' ||
        response.data === 'Cannot verify token.'
      ) {
        router.push({ name: RouteNames.HOME });
        nova.logOut();
        return;
      }

      if (response && config) {
        try {
          const token = await nova.refresh();

          if (token) {
            nova.setToken(token);
            currentPerson.value;
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

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    router.push({ name: RouteNames.HOME });
  }
});
</script>
