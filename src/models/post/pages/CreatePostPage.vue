<template>
  <q-page class="n-page">
    <div class="text-h1 text-center n-h1">Create Posts</div>
    <edit-post :model-value="newPost" @update:model-value="updatePost">
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
          :disable="!newPost?.title"
          @click="
            onDiscardPost('Would you liek to discard this draft?', discardOk)
          "
        ></q-btn>
      </template>
    </edit-post>
  </q-page>
</template>

<script setup lang="ts">
import { EditPost, PostVersion, usePostStore } from 'src/models/post';
import { Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { RecordId } from 'src/models/meta';
import { usePersonStore } from 'src/models/person';
import { usePosts } from 'src/models/post/';

const { currentPerson } = storeToRefs(usePersonStore());
const { draftPost } = usePostStore();
const { onDraftPost, onPublishPost, onDiscardPost } = usePosts();

const newPost: Ref<PostVersion> = ref({
  author: currentPerson.value?.id as RecordId,
  published: false,
} as PostVersion);

const updatePost = (newVal: PostVersion) => {
  newPost.value = newVal as PostVersion;
};

const draftOk = async () => {
  if (!newPost.value) throw new Error('No post to create draft for!');
  await draftPost(newPost.value);
};

const publishOk = async () => {
  if (!newPost.value) throw new Error('No post to create!');
  newPost.value.published = true;
  await draftPost(newPost.value);
};

const discardOk = () => {
  if (!newPost.value) throw new Error('No post to create!');
  newPost.value.title = '';
  newPost.value.markdown = '';
};
</script>

<style scoped lang="scss"></style>
