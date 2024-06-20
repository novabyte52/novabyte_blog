<template>
  <q-page class="n-page">
    <edit-post :model-value="newPost" @update:model-value="updatePost">
      <template v-slot:actions>
        <q-btn
          label="draft"
          color="positive"
          :disable="!newPost?.title"
          @click="onDraftPost"
        ></q-btn>
        <q-space />
        <q-btn
          label="publish"
          color="warning"
          :disable="!newPost?.title || !newPost.markdown"
          @click="onPublishPost"
        ></q-btn>
        <q-btn
          label="discard"
          color="negative"
          :disable="!newPost?.title"
          @click="onDiscardPost"
        ></q-btn>
      </template>
    </edit-post>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { EditPost, HydratedPost, Post, usePostStore } from 'src/models/post';
import { Ref, ref } from 'vue';
import ConfirmationDialog from 'src/dialogs/ConfirmationDialog.vue';

const q = useQuasar();
const { publishPost, draftPost } = usePostStore();

const newPost: Ref<Post | undefined> = ref();

const updatePost = (newVal: Post | HydratedPost) => {
  newPost.value = newVal as Post;
};

const onDraftPost = () => {
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Save post as draft?',
    },
  }).onOk(async () => {
    if (!newPost.value) throw new Error('No post to create draft for!');
    await draftPost(newPost.value);
  });
};

const onPublishPost = () => {
  console.log('publishing post');
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to publish the post? You just started it.',
    },
  }).onOk(async () => {
    if (!newPost.value) throw new Error('No post to create!');
    await publishPost(newPost.value);
  });
};

const onDiscardPost = () => {
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to discard what youve written?',
    },
  }).onOk(async () => {
    if (!newPost.value) throw new Error('No post to create!');
    newPost.value.title = '';
    newPost.value.markdown = '';
  });
};
</script>

<style scoped lang="scss"></style>
