<template>
  <q-layout view="lHh lpR lFf" class="n-background">
    <n-header @toggle-admin="toggleLeftDrawer" />

    <q-drawer v-model="leftDrawerOpen" side="left" elevated>
      <q-tabs vertical inline-label>
        <q-route-tab
          no-caps
          to="/edit-post"
          icon="fas fa-newspaper"
          :content-class="'tab'"
          >Create Post</q-route-tab
        >
        <q-route-tab
          no-caps
          to="/edit-post"
          icon="fas fa-post"
          :content-class="'tab'"
          >Create Post</q-route-tab
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

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<style scoped lang="scss">
.n-background {
  background-color: $dark-page;
}

.q-layout__section--marginal {
  color: $text-color;
}
</style>
