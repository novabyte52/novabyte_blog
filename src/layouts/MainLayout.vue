<template>
  <q-layout view="lHh Lpr lFf" class="n-background">
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

<style scoped lang="scss">
.n-background {
  background-color: $dark;
}

.q-layout__section--marginal {
  color: $text-color;
}
</style>
