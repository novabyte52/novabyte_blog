<template>
  <q-page class="n-page index-page">
    <div class="text-h1 text-center">Popular Mission Log</div>
    <div class="row q-pa-xl pop-logs">
      <q-space />
      <q-card
        v-if="randomDraft"
        class="popular-log q-pa-lg n-card n-card--important"
      >
        <router-link
          :to="{
            name: RouteNames.READ_POST,
            params: { postId: randomDraft.draft_id },
          }"
          class="card-link"
        >
          <div class="text-h3">{{ randomDraft?.title || '' }}</div>
          <render-markdown
            class="markdown-preview"
            :markdown="truncate(randomDraft?.markdown || '', { length: 500 })"
            flat
          />
        </router-link>
      </q-card>
      <q-space />
      <img
        src="../assets/astro-helmet.svg"
        class="helmet-img q-pa-sm"
        :style="{
          backgroundImage: randomDraft?.image
            ? `url('${randomDraft.image}')`
            : `url('../assets/code_02.png')`,
        }"
      />
      <q-space />
    </div>
    <div class="text-h2 recent-logs">Recent Mission Logs</div>
    <div class="cards q-pa-sm">
      <router-link
        v-for="post in publishedDrafts"
        class="card-link"
        :key="post.id"
        :to="{
          name: RouteNames.READ_POST,
          params: {
            postId: post.draft_id,
          },
        }"
      >
        <q-card class="n-card post-card" style="overflow-y: auto">
          <q-card-section class="text-h4">
            {{ post.title }}
          </q-card-section>
          <q-card-section>
            <render-markdown
              class="markdown-preview"
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
import { useLogger } from 'src/composables/useLogger';
import { PostVersion, RenderMarkdown, usePostStore } from 'src/models/post';
import { RouteNames } from 'src/router/routes';
import { Ref, ref } from 'vue';

defineOptions({
  preFetch: async ({ store }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const plog = useLogger('P IndexPage.vue');
    const ps = usePostStore(store);

    await ps.getPublished();

    return { randomDraft: ps.getRandomDraft() };
  },
});

useLogger('IndexPage.vue');

const { getRandomDraft } = usePostStore();
const { publishedDrafts } = storeToRefs(usePostStore());
const randomDraft: Ref<PostVersion | undefined> = ref();
randomDraft.value = getRandomDraft();
</script>

<style lang="scss">
.index-page {
  padding-bottom: 0 !important;

  .helmet-img {
    background-clip: content-box;
    background-position: center;
    background-size: cover;
  }

  .pop-logs {
    align-items: center;
  }

  .popular-log {
    width: 50%;

    transition: 0.3s;

    &:hover {
      border-color: $secondary;
      transition: 0.3s;
    }

    &:active {
      .text-h3 {
        transition: 0.1s;
        color: $secondary;
      }
    }

    .markdown-preview {
      border-bottom: 4px inset $primary-light;
    }
  }

  .recent-logs {
    margin-bottom: 0;
  }

  .post-card {
    // max-height: 350px;
    overflow: hidden;
  }

  .markdown-preview {
    color: $text-color;
    border: 4px inset $primary-light;
    padding: 16px;

    p {
      margin: 0;
    }
  }

  .cards {
    display: grid;
    grid-template-columns: 32% 32% 32%;
    grid-template-rows: auto;
    gap: 2%;

    padding: 3rem;

    background: rgb(29, 49, 60);
    background-image: linear-gradient(
      to right bottom,
      #f6723a,
      #d34d72,
      #874c87,
      #39456e,
      #1d313c
    );
  }

  .card-link {
    text-decoration: none;
  }

  .post-card {
    // height: 100%;
    transition: 0.3s;

    &:hover {
      border-color: $secondary;
      transition: 0.3s;
    }

    &:active {
      border-style: inset;
    }
  }
}
</style>
