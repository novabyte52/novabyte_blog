<template>
  <q-page class="n-page">
    <div class="text-h1 text-center">Create Posts</div>
    <edit-post class="q-ma-lg" v-model="newPost">
      <template v-slot:actions>
        <q-btn
          label="draft"
          color="positive"
          :disable="!newPost?.title"
          @click="onDraftPost('Would you like to make this a draft?', draftOk)"
        ></q-btn>
        <q-btn
          label="publish"
          color="warning"
          :disable="!newPost?.title || !newPost.markdown"
          @click="
            onPublishPost(
              'Would you like to publish this draft? You just began it.',
              publishOk
            )
          "
        ></q-btn>
        <q-space />
        <q-btn
          label="discard"
          color="negative"
          @click="
            onDiscardPost('Would you liek to discard this draft?', discardOk)
          "
        ></q-btn>
      </template>
    </edit-post>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useIsDirty } from 'src/composables';
import { EditPost, PostVersion, usePostStore } from 'src/models/post';
import { usePosts } from 'src/models/post/';
import { RouteNames } from 'src/router/routes';
import { useNovaStore } from 'src/stores/nova.store';
import { Ref, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const { currentPerson } = storeToRefs(useNovaStore());
const { draftPost } = usePostStore();
const { onDraftPost, onPublishPost, onDiscardPost } = usePosts();

const newPost: Ref<PostVersion> = ref({
  author: '',
  published: false,
} as PostVersion);

// MARK: on page refresh author is undefined so i wait for it below...
watch(currentPerson, () => {
  if (!currentPerson.value) return;
  newPost.value.author = currentPerson.value.id;
});

const { isDirty } = useIsDirty(newPost);

const draftOk = async () => {
  if (!isDirty.value) throw new Error('Draft is empty! Aborting.');
  if (!newPost.value) throw new Error('Draft is empty! Aborting.');

  const draft = await draftPost(newPost.value);

  router.push({
    name: RouteNames.EDIT_DRAFTS,
    query: { draft_id: draft.draft_id },
  });
};

const publishOk = async () => {
  if (!isDirty.value) throw new Error('Draft is empty! Aborting.');
  if (!newPost.value) throw new Error('Draft is empty! Aborting.');

  newPost.value.published = true;
  const draft = await draftPost(newPost.value);

  router.push({
    name: RouteNames.EDIT_PUBLISHED,
    query: { draft_id: draft.draft_id },
  });
};

const discardOk = () => {
  if (!newPost.value) throw new Error('Draft is empty! Aborting.');
  newPost.value.title = '';
  newPost.value.markdown = '';
};
</script>
