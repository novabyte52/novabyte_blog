<template>
  <q-header class="header">
    <q-toolbar class="toolbar">
      <q-tabs inline-label indicator-color="transparent">
        <q-route-tab to="/" class="title">
          <q-toolbar-title class="text-h5"> novabyte.blog </q-toolbar-title>
        </q-route-tab>
      </q-tabs>

      <n-marquee :margin="500" />

      <q-tabs inline-label class="nav">
        <q-route-tab :to="{ name: RouteNames.ABOUT }" :content-class="'tab'">
          <rocket class="q-ma-sm" :size="24" /> About
        </q-route-tab>


        <q-route-tab
          v-if="currentPerson?.is_admin"
          to="/programming"
          :content-class="'tab'"
          @click="log.debug('Navigated to Programming tab')">
          <bot class="q-ma-sm" :size="24" /> Programming
        </q-route-tab>

        <q-route-tab
          v-if="currentPerson?.is_admin"
          to="/theme"
          :content-class="'tab'"
          @click="log.debug('Navigated to Making tab')">
          <pencil-ruler class="q-ma-sm" :size="24" stroke-width="1.75" />
          Making
        </q-route-tab>

        <q-route-tab
          v-if="currentPerson?.is_admin"
          to="/theme"
          :content-class="'tab'"
          @click="log.debug('Navigated to Theming tab')">
          <palette class="q-ma-sm" :size="24" /> Theming
        </q-route-tab>

        <q-route-tab class="user-tab" :content-class="'tab'">
          <icon name="astro" :iconNode="astronautHelmet" :size="32" />
          <n-person-menu />
        </q-route-tab>
      </q-tabs>
    </q-toolbar>

    <q-btn v-if="currentPerson?.is_admin" round class="admin-btn" @click="handleToggleAdmin">
      <cog :size="32" />
    </q-btn>
  </q-header>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import NMarquee from './NMarquee.vue';
  import NPersonMenu from './NPersonMenu.vue';
  import { useNovaStore } from 'src/stores/nova.store';
  import { RouteNames } from 'src/router/routes';
  import { astronautHelmet } from '@lucide/lab';
  import { Icon, Cog, Palette, PencilRuler, Bot, Rocket } from 'lucide-vue-next';
  import { useLogger } from 'src/composables/useLogger';

  const log = useLogger('NHeader');

  const emit = defineEmits<{
    (event: 'toggleAdmin'): void;
  }>();

  const { currentPerson } = storeToRefs(useNovaStore());
  log.debug(`currentPerson value: ${JSON.stringify(currentPerson.value)}`);

  const handleToggleAdmin = () => {
    log.debug('Admin button clicked.');
    emit('toggleAdmin');
  };
</script>

<style lang="scss">
  .header {
    border-bottom: 4px outset $primary;

    .toolbar {
      padding: 0;
    }

    .title {
      font-family: nova-font;
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
      margin-top: 12px;
    }
  }
</style>
