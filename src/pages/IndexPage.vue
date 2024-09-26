<template>
  <q-page class="n-page index-page">
    <div class="text-h1 text-center">Popular Mission Logs</div>
    <div class="row q-pa-xl pop-logs">
      <q-space />
      <q-card class="popular-log q-pa-md n-card n-card--important">
        <div class="text-h3">A Love Letter to Rust</div>
        <div class="text">
          placeholder text that would be a preview of the post here.
        </div>
      </q-card>
      <q-space />
      <img src="../assets/astro-helmet.svg" class="helmet-img q-pa-sm" />
      <q-space />
    </div>
    <div class="text-h2">Recent Mission Logs</div>
    <div class="cards q-pa-sm">
      <router-link
        v-for="post in publishedDrafts"
        class="card"
        :key="post.id"
        :to="{
          name: RouteNames.READ_POST,
          params: {
            postId: post.draft_id,
          },
        }"
      >
        <q-card class="n-card post-card" style="overflow-y: auto">
          <q-card-section class="text-h4"> {{ post.title }} </q-card-section>
          <q-card-section>
            <render-markdown
              class="bg-color-dark"
              :markdown="truncate(post.markdown, { length: 200 })"
              flat
            />
          </q-card-section>
        </q-card>
      </router-link>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { truncate } from 'lodash-es';
import { storeToRefs } from 'pinia';
import { RenderMarkdown, usePostStore } from 'src/models/post';
import { RouteNames } from 'src/router/routes';
import { onMounted } from 'vue';

const { getPublished } = usePostStore();
const { publishedDrafts } = storeToRefs(usePostStore());

onMounted(async () => {
  if (publishedDrafts.value.length === 0) {
    await getPublished();
  }
});
</script>

<style lang="scss">
// MARK: leaving un-scoped for now since i'm doing a lot of testing here
.n-separator {
  height: 5px;
  background-color: $accent;
}

.n-random {
  cursor: pointer;
  border-radius: 100%;
  transition: 0.5s;
  border: 3px solid $dark;
  &:hover {
    transition: 0.5s;
    border: 3px solid $accent;
  }
}

.index-page {
  .helmet-img {
    max-width: 50%;
    height: auto;
    background-clip: content-box;
    background-image: url('https://nextcloud.techrekt.com/s/CBmCyCEWyDLdr6P/preview');
    background-position: center;
    background-size: cover;
  }

  .post-card {
    // height: 250px;
    overflow: hidden;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-auto-rows: auto;
    grid-gap: 16px;
    background: rgb(29, 49, 60);
    background-image: linear-gradient(
      to right top,
      #1d313c,
      #39456e,
      #874c87,
      #d34d72,
      #f6723a
    );
    // background: linear-gradient(
    //   45deg,
    //   rgba(29, 49, 60, 1) 0%,
    //   rgba(80, 163, 171, 1) 25%,
    //   rgba(193, 250, 237, 1) 45%,
    //   rgba(224, 194, 241, 1) 50%,
    //   rgba(250, 218, 193, 1) 55%,
    //   rgba(196, 59, 57, 1) 75%,
    //   rgba(246, 114, 58, 1) 100%
    // );
  }
}
</style>
