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
  background-image: url('https://image.pbs.org/video-assets/TlpGxv4-asset-mezzanine-16x9-s7Vs0QD.jpg');
  background-position: center;

  .content {
    max-width: 50%;
    border-radius: 50px;
    // border-radius: 100%;
    margin: auto;
    background-color: rgba($color: $dark, $alpha: 0.95);
    border: 3px solid $secondary;
  }

  .preamble {
  }
}
</style>
