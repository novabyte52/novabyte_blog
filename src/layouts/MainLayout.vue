<template>
  <q-layout view="lHh Lpr lFf">
    <n-header />

    <!-- add q-drawer here if needed in the layout -->

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import NHeader from 'src/components/NHeader.vue';
</script>
