<template>
  <q-page class="n-page">
    <div v-if="post?.title" class="text-h1 text-center">
      {{ post.title }}
    </div>
    <q-card class="post-container q-mx-xl q-mt-xl n-card n-card--important">
      <render-markdown
        v-if="post"
        class="output q-pa-lg"
        :markdown="(marked(post.markdown) as string)"
      />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { usePostStore } from '../post.store';
import { PostVersion, RenderMarkdown } from 'src/models/post';
import { marked } from 'marked';

defineOptions({
  preFetch: ({ store, ssrContext }) => {
    const param = ssrContext?.req.params[0].split('/');
    const ps = usePostStore(store);
    return ps.getPublishedDraft(param?.[2] as string);
  },
});

const r = useRoute();
const { getPublishedDraft } = usePostStore();

const { postId } = r.params;
const post: Ref<PostVersion | undefined> = ref();

onMounted(async () => {
  post.value = await getPublishedDraft(postId as string);
});
</script>

<style scoped lang="scss">
.post-container {
  padding: 16px;
}
.output {
  border: 4px inset $primary-light !important;
}
</style>
