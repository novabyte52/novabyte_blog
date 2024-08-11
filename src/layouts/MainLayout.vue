<template>
  <q-layout view="lHh lpR lFf" class="n-background">
    <n-header @toggle-admin="toggleLeftDrawer" />

    <q-drawer class="n-drawer" v-model="leftDrawerOpen" side="left" elevated>
      <q-tabs vertical inline-label indicator-color="accent">
        <q-route-tab
          no-caps
          :to="{ name: RouteNames.CREATE_POST }"
          icon="fas fa-pen-nib"
          :content-class="'admin-tab'"
          @click="leftDrawerOpen = false"
          >Create Post</q-route-tab
        >
        <q-route-tab
          no-caps
          :to="{ name: RouteNames.EDIT_DRAFTS }"
          icon="fas fa-book-bookmark"
          :content-class="'admin-tab'"
          @click="leftDrawerOpen = false"
          >Drafts</q-route-tab
        >
        <q-route-tab
          no-caps
          :to="{ name: RouteNames.EDIT_PUBLISHED }"
          icon="fas fa-newspaper"
          :content-class="'admin-tab'"
          @click="leftDrawerOpen = false"
          >Published</q-route-tab
        >
        <q-route-tab
          no-caps
          :to="{ name: RouteNames.POST_HISTORY }"
          icon="fas fa-scroll"
          :content-class="'admin-tab'"
          @click="leftDrawerOpen = false"
          >Post History</q-route-tab
        >
        <q-route-tab
          no-caps
          to="/edit-post"
          icon="fas fa-user-astronaut"
          :content-class="'admin-tab'"
          @click="leftDrawerOpen = false"
          >Persons</q-route-tab
        >
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NHeader from 'src/components/NHeader.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { RouteNames } from 'src/router/routes';
import { useNovaStore } from 'src/stores/nova.store';
import { storeToRefs } from 'pinia';

const router = useRouter();
const { isAuthenticated } = storeToRefs(useNovaStore());

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

router.beforeEach(async (to) => {
  const requires = to.meta.requiresAuth;
  const authed = isAuthenticated.value;
  console.debug(`requires authentication: ${requires}`);
  console.debug(`is authenticated: ${authed}`);
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    router.push({ name: RouteNames.HOME });
  }
});
</script>

<style lang="scss">
.n-background {
  background-color: $dark-page;
}

.n-drawer {
  background-color: $primary;

  .admin-tab {
    color: $secondary;
    .q-icon {
      padding: 0px 8px !important;
    }
    min-height: 50px;
  }
}

.q-layout__section--marginal {
  color: $text-color;
}
</style>
