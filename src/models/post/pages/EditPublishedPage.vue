<template>
  <q-page class="n-page edit-post-page">
    <div class="text-h1 text-center n-h1">Edit Published Drafts</div>

    <q-splitter
      separator-class="static-splitter"
      v-model="ratio"
      :unit="'px'"
      :limits="[ratio, ratio]"
    >
      <template v-slot:before>
        <q-card class="n-card">
          <q-list bordered separator>
            <div class="text-h4 text-center q-pa-sm">Published</div>
            <q-item
              v-for="draft in drafts"
              clickable
              :key="draft.id?.toString()"
              @click="editDraft(draft)"
              ><q-item-section> {{ draft.title }}</q-item-section></q-item
            >
          </q-list>
        </q-card>
      </template>
      <template v-slot:after>
        <edit-post :model-value="draftedPost" @update:model-value="updatePost">
          <template v-slot:actions>
            <q-btn
              label="publish"
              color="positive"
              :disable="!draftedPost?.title || !draftedPost.markdown"
              @click="onPublishPost"
            ></q-btn>
            <q-space />
            <q-btn
              label="un-publish"
              color="negative"
              :disable="!draftedPost?.title || !draftedPost.markdown"
              @click="onUnpublishPost"
            ></q-btn>
          </template>
        </edit-post>
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { PostVersion, usePostStore } from 'src/models/post';
import { EditPost } from 'src/models/post';
import { Ref, onMounted, ref } from 'vue';
import ConfirmationDialog from 'src/dialogs/ConfirmationDialog.vue';

const q = useQuasar();
const { getPublished } = usePostStore();

const ratio = ref(250);
const draftedPost: Ref<PostVersion | undefined> = ref();
const drafts: Ref<PostVersion[] | undefined> = ref();

onMounted(async () => {
  drafts.value = await getPublished();
});

const editDraft = (draft: PostVersion) => {
  draftedPost.value = draft;
};

const updatePost = (newVal: PostVersion) => {
  draftedPost.value = newVal as PostVersion;
};

/**
 * if changes have been made create a new draft and publish it
 */
const onPublishPost = () => {
  console.log('publishing post');
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to publish this new draft?',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create!');
    // await publishPost(draftedPost.value);
  });
};

/**
 * un-publish this draft
 */
const onUnpublishPost = () => {
  console.log('publishing post');
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to un-publish this draft?',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create!');
    // await publishPost(draftedPost.value);
  });
};
</script>

<style lang="scss">
.edit-post-page {
  .static-splitter {
    .q-splitter__separator-area:hover {
      cursor: default !important;
    }
  }

  .foo {
    color: black;
  }
}
</style>
