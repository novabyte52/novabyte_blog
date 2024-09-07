<template>
  <router-view />
</template>

<script setup lang="ts">
import { jwtDecode } from 'jwt-decode';
import { storeToRefs } from 'pinia';
import { usePersonStore } from 'src/models/person';
import { useNovaStore } from 'src/stores/nova.store';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { RouteNames } from 'src/router/routes';

const router = useRouter();
const ps = usePersonStore();
const nova = useNovaStore();
const { noPersonButToken, currentPerson, isAuthenticated } = storeToRefs(
  useNovaStore()
);

// check for token immediately to set noPersonButToken
nova.checkForToken();

// set to immediate to attempt to refresh whenever a person loads the app
watch(
  noPersonButToken,
  async (val) => {
    if (!val) {
      console.log('noPersonButToken changed but is false:', val);
      return;
    }
    let token = nova.getToken();

    if (!token) {
      token = (await nova.refresh()) ?? null;
      if (!token) throw Error('attempted refresh but unable to');
      nova.setToken(token);
    }

    const claims = jwtDecode(token);
    if (!claims.sub) throw new Error('Expected jwt subject.');

    currentPerson.value = await ps.getPerson(claims.sub);
    ps.addPerson(currentPerson.value);
    noPersonButToken.value = false;
  },
  { immediate: true }
);

router.beforeEach(async (to) => {
  console.log('beforeEach route:', isAuthenticated.value, to);
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    router.push({ name: RouteNames.HOME });
  }
});
</script>
