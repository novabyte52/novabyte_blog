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
import { useOnce } from './composables/once';
import { onMounted } from 'vue';
import { useLogger } from './composables/useLogger';

const log = useLogger('App.vue');

const router = useRouter();
const nova = useNovaStore();
const { ghostToken, isAuthenticated, currentPerson, currentToken } =
  storeToRefs(useNovaStore());
const ps = usePersonStore();

if (process.env.CLIENT) {
  // set to immediate to attempt to refresh whenever a person loads the app
  onMounted(() => {
    useOnce(() =>
      watch(ghostToken, async (val) => {
        log.debug('running ghostToken watcher. val: ' + val);

        if (!val) {
          return;
        }

        if (!currentToken.value) {
          await nova.refresh();
          if (!currentToken.value) throw Error('attempted refresh but failed');
        }

        const claims = jwtDecode(nova.currentToken as string);
        if (!claims.sub) throw new Error('Expected jwt subject.');

        let cp = await ps.getPerson(claims.sub);
        currentPerson.value = cp;
        ps.addPerson(cp);
        ghostToken.value = false;
      })
    );

    log.debug('checking for auth paradox');
    // check for token immediately to set ghostToken
    nova.checkForAuthParadox();
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
