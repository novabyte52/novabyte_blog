<template>
  <q-card flat class="q-pa-lg n-banner">
    <q-card-section class="col content">
      <q-card-section class="text-h3 text-center">
        {{ title }}
      </q-card-section>

      <q-card-section class="row preamble">
        <slot>{{ preamble }}</slot>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  preamble?: string;
}>();
</script>

<style lang="scss">
.n-banner {
  color: $text-color;
  border-radius: 0;
  background-color: $text-color;
  // background-image: url('https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~large.jpg');
  background-position: center;
  background-size: cover;

  .content {
    max-width: 50%;
    // border-radius: 15px;
    margin: auto;
    background-color: $dark;
  }
}
</style>
