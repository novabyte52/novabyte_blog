<template>
  <q-page class="n-page">
    <q-card flat class="q-pa-lg n-banner">
      <q-card-section class="col content">
        <q-card-section class="text-h2 text-center q-pt-xl">
          NOVABYTE.BLOG
        </q-card-section>
        <pre>
          {{ foo }}
        </pre>
        <q-card-section class="preamble">
          Welcome, mortal, to my domain. I, the galactic entity Novabyte, will
          chronicle my various endeavors into the depths of various domains. In
          general, you could say you've stumbled onto the void I created for
          myself to yell into. I'd be delighted if you stayed, and unbothered if
          you didn't. Everything here will be by me, for me, and not you.
          Though, if my ramblings just so happen to enrich you then all the
          merrier.
        </q-card-section>
      </q-card-section>
    </q-card>
    <div class="row q-pa-xl q-gutter-lg">
      <q-card class="col n-card">
        <q-card-section class="text-h6"> Post Title </q-card-section>
        <q-card-section>
          <p>Here is a preview of the post. I will just continue to</p>
        </q-card-section>
      </q-card>
      <q-card class="col n-card">
        <q-card-section class="text-h6"> Post Title </q-card-section>
        <q-card-section>
          <p>Here is a preview of the post. I will just continue to</p>
        </q-card-section>
      </q-card>
      <q-card class="col n-card">
        <q-card-section class="text-h6"> Post Title </q-card-section>
        <q-card-section>
          <p>Here is a preview of the post. I will just continue to</p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// minimal amount of code for an api call
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

// an example of using marked to make a markdown editor and renderer
// https://vuejs.org/examples/#markdown

const foo = ref();

onMounted(async () => {
  foo.value = (
    await api.get('/posts/67e55044-10b1-426f-9247-bb680e5fe0c8')
  ).data;
});
</script>

<style scoped lang="scss">
.n-page {
  width: 80%;
  margin: auto;
  background-color: $background;
}

.n-banner {
  color: $text-color;
  border-radius: 0;
  background-color: $dark;
  background-image: url('https://image.pbs.org/video-assets/TlpGxv4-asset-mezzanine-16x9-s7Vs0QD.jpg');
  background-position: center;

  .content {
    max-width: 50%;
    border-radius: 10px;
    margin: auto;
    background-color: rgba($color: $dark, $alpha: 0.95);
    // border: 3px solid $accent;
  }
}

.n-card {
  // color: white;
  background-color: $dark;
  &:hover {
    border: 3px solid $accent;
  }
}
</style>
