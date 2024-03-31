<template>
  <q-header class="header">
    <q-toolbar class="toolbar">
      <q-tabs inline-label indicator-color="transparent">
        <q-route-tab to="/" class="title">
          <q-toolbar-title> novabyte.blog </q-toolbar-title>
        </q-route-tab>
      </q-tabs>
      <n-marquee
        :items="[
          { id: '1', text: 'Article 01' },
          { id: '2', text: 'Article 02' },
          { id: '3', text: 'Article 03' },
        ]"
      />
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
  </q-header>
</template>

<script setup lang="ts">
import NMarquee from './NMarquee.vue';
import NPersonMenu from './NPersonMenu.vue';
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

  .tab {
    color: $secondary !important;
    .q-icon {
      padding: 8px 8px 8px 0px;
    }
  }
}
</style>
