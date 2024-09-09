<template>
  <q-header class="header">
    <q-toolbar class="toolbar">
      <q-tabs inline-label indicator-color="transparent">
        <q-route-tab to="/" class="title">
          <q-toolbar-title> novabyte.blog </q-toolbar-title>
        </q-route-tab>
      </q-tabs>
      <n-marquee :margin="500" />
      <!-- :items="[
          { id: '1', text: 'Article 01' },
          { id: '2', text: 'Article 02' },
          { id: '3', text: 'Article 03' },
        ]" -->
      <q-tabs inline-label class="nav">
        <q-route-tab to="/programming" icon="fas fa-code" :content-class="'tab'"
          >Programming</q-route-tab
        >
        <q-route-tab
          to="/theme"
          icon="fas fa-screwdriver-wrench"
          :content-class="'tab'"
          >Making</q-route-tab
        >
        <q-route-tab to="/theme" icon="fas fa-palette" :content-class="'tab'"
          >Theming</q-route-tab
        >
        <q-route-tab
          icon="fas fa-user-astronaut"
          class="user-tab"
          :content-class="'tab'"
        >
          <n-person-menu />
        </q-route-tab>
      </q-tabs>
    </q-toolbar>
    <q-btn
      v-if="currentPerson?.is_admin"
      round
      class="admin-btn"
      icon="fas fa-gear"
      @click="emit('toggleAdmin')"
    />
  </q-header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import NMarquee from './NMarquee.vue';
import NPersonMenu from './NPersonMenu.vue';
import { useNovaStore } from 'src/stores/nova.store';

const emit = defineEmits<{
  (event: 'toggleAdmin'): void;
}>();

const { currentPerson } = storeToRefs(useNovaStore());
</script>

<style lang="scss">
.header {
  .toolbar {
    padding: 0;
  }

  .title {
    text-decoration: none;
    color: $secondary !important;
  }

  .user-tab {
    .tab {
      .q-icon {
        padding: 8px 0px !important;
      }
    }
  }

  .admin-btn {
    background-color: $secondary;
    position: absolute;
    margin-left: 8px;
    margin-top: 8px;
  }
}
</style>
