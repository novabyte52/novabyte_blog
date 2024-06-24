<template>
  <q-layout view="lHh lpR lFf" class="n-background">
    <n-header @toggle-admin="toggleLeftDrawer" />

    <q-drawer class="n-drawer" v-model="leftDrawerOpen" side="left" elevated>
      <q-tabs vertical inline-label>
        <q-route-tab
          no-caps
          :to="{ name: RouteNames.CREATE_POST }"
          icon="fas fa-pen-nib"
          :content-class="'tab'"
          @click="leftDrawerOpen = false"
          >Create Post</q-route-tab
        >
        <q-route-tab
          no-caps
          :to="{ name: RouteNames.EDIT_DRAFTS }"
          icon="fas fa-book-bookmark"
          :content-class="'tab'"
          @click="leftDrawerOpen = false"
          >Drafts</q-route-tab
        >
        <q-route-tab
          no-caps
          :to="{ name: RouteNames.EDIT_PUBLISHED }"
          icon="fas fa-newspaper"
          :content-class="'tab'"
          @click="leftDrawerOpen = false"
          >Published</q-route-tab
        >
        <q-route-tab
          no-caps
          to="/edit-post"
          icon="fas fa-scroll"
          :content-class="'tab'"
          @click="leftDrawerOpen = false"
          >Post History</q-route-tab
        >
        <q-route-tab
          no-caps
          to="/edit-post"
          icon="fas fa-user-astronaut"
          :content-class="'tab'"
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
import { usePersonStore } from 'src/models/person';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { RouteNames } from 'src/router/routes';

const router = useRouter();
const { isAuthenticated } = usePersonStore();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// TODO: need to investigate/rework this route guard to account for
// routes that don't need to be authenticated, like most (if not all)
// of my articles. i may eventually work to paid articles and will need
// to deal with that here, too.
router.beforeEach(async (to, from) => {
  if (!isAuthenticated) {
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
}

.q-layout__section--marginal {
  color: $text-color;
}
</style>
