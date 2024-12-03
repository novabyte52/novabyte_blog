<template>
  <suspense>
    <router-view />
  </suspense>
</template>

<script setup lang="ts">
  import { jwtDecode } from 'jwt-decode';
  import { storeToRefs } from 'pinia';
  import { usePersonStore } from 'src/models/person';
  import { useNovaStore } from 'src/stores/nova.store';
  import { watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { RouteNames } from 'src/router/routes';
  import { useOnce } from './composables/once';
  import { onMounted } from 'vue';
  import { useLogger } from './composables/useLogger';

  const log = useLogger('App.vue');

  const router = useRouter();
  const nova = useNovaStore();
  const { noPersonButToken, isAuthenticated, currentPerson } = storeToRefs(
    useNovaStore()
  );
  const ps = usePersonStore();

  if (process.env.CLIENT) {
    // check for token immediately to set noPersonButToken
    nova.checkForToken();

    // set to immediate to attempt to refresh whenever a person loads the app
    onMounted(() => {
      useOnce(() => watch(
        noPersonButToken,
        async (val) => {
          log.debug('running noPersonButToken watcher. val: ' + val)
          let token = nova.getToken();

          if (!token) {
            token = (await nova.refresh('noPersonButToken watcher')) ?? undefined;
            if (!token) throw Error('attempted refresh but unable to');
            nova.setToken(token);
          }

          const claims = jwtDecode(token);
          if (!claims.sub) throw new Error('Expected jwt subject.');

          let cp = await ps.getPerson(claims.sub);
          currentPerson.value = cp;
          ps.addPerson(cp);
          noPersonButToken.value = false;
        },
        { immediate: true }
      ));
    });

    router.beforeEach(async (to, _from, next) => {
      if (to.meta.requiresAuth && !isAuthenticated.value) {
        router.push({ name: RouteNames.LOGIN });
      } else {
        next();
      }
    });
  }
</script>
