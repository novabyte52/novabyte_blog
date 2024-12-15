<template>
  <q-layout view="lHh lpR lFf" class="n-background">
    <n-header @toggle-admin="toggleLeftDrawer" />

    <q-drawer class="n-drawer" v-model="leftDrawerOpen" side="left" elevated>
      <q-tabs vertical inline-label indicator-color="accent">
        <q-route-tab no-caps :to="{ name: RouteNames.CREATE_POST }" icon="fas fa-pen-nib" :content-class="'admin-tab'"
          @click="handleTabClick('Create Post')">Create Post</q-route-tab>
        <q-route-tab no-caps :to="{ name: RouteNames.EDIT_DRAFTS }" icon="fas fa-book-bookmark"
          :content-class="'admin-tab'" @click="handleTabClick('Drafts')">Drafts</q-route-tab>
        <q-route-tab no-caps :to="{ name: RouteNames.EDIT_PUBLISHED }" icon="fas fa-newspaper"
          :content-class="'admin-tab'" @click="handleTabClick('Published')">Published</q-route-tab>
        <q-route-tab no-caps :to="{ name: RouteNames.POST_HISTORY }" icon="fas fa-scroll" :content-class="'admin-tab'"
          @click="handleTabClick('Post History')">Post History</q-route-tab>
        <q-route-tab no-caps :to="{ name: RouteNames.PERSONS }" icon="fas fa-user-astronaut"
          :content-class="'admin-tab'" @click="handleTabClick('Persons')">Persons</q-route-tab>
      </q-tabs>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <n-footer />
  </q-layout>
</template>

<script setup lang="ts">
  import NHeader from 'src/components/NHeader.vue';
  import NFooter from 'src/components/NFooter.vue';
  import { RouteNames } from 'src/router/routes';
  import { ref } from 'vue';
  import { useLogger } from 'src/composables/useLogger';

  const log = useLogger('MainLayout');

  const leftDrawerOpen = ref(false);
  log.debug('Left drawer state:' + leftDrawerOpen.value);

  const toggleLeftDrawer = () => {
    leftDrawerOpen.value = !leftDrawerOpen.value;
    log.debug(`Left drawer toggled. Now ${leftDrawerOpen.value ? 'open' : 'closed'}.`);
  };

  const handleTabClick = (tabName: string) => {
    leftDrawerOpen.value = false;
    log.info(`Navigating to ${tabName}. Drawer closed.`);
  };
</script>

<style lang="scss">
  .n-background {
    background-color: $dark-page;

    .q-drawer {
      position: fixed;
    }
  }

  .n-drawer {
    background-color: $secondary;

    .admin-tab {
      color: $dark-page;

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
