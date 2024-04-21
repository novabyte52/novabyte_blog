<template>
  <q-card flat class="q-pa-lg n-banner">
    <q-card-section class="col content">
      <q-card-section class="text-h2 text-center q-pt-xl">
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

<style scoped lang="scss">
.n-banner {
  color: $text-color;
  border-radius: 0;
  background-color: $dark;
  background-image: url('https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~large.jpg');
  background-position: center;
  background-size: cover;

  .content {
    max-width: 50%;
    border-radius: 15px;
    margin: auto;
    background-color: rgba($color: $dark, $alpha: 0.95);
  }
}
</style>
