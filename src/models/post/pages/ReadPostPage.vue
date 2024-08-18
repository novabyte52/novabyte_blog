<template>
  <q-page class="n-page">
    <div v-if="post?.title" class="text-h2 text-center">
      {{ post.title }}
    </div>
    <render-markdown
      v-if="post"
      class="col output"
      :markdown="(marked(post.markdown) as string)"
    />
  </q-page>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePostStore } from '../post.store';
import { PostVersion, RenderMarkdown } from 'src/models/post';
import { marked } from 'marked';

const r = useRoute();
const { getPublishedDraft } = usePostStore();

const { postId } = r.params;
const post: Ref<PostVersion | undefined> = ref();

onMounted(async () => {
  console.log('ReadPostPage mounted...');
  post.value = await getPublishedDraft(postId as string);
});
</script>

<style scoped lang="scss"></style>
