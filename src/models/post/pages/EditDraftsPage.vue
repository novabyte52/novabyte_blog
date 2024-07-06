<template>
  <q-page class="n-page edit-post-page">
    <div class="text-h1 text-center n-h1">Edit Drafts</div>
    <q-splitter
      separator-class="static-splitter"
      v-model="ratio"
      :unit="'px'"
      :limits="[ratio, ratio]"
    >
      <template v-slot:before>
        <q-card class="n-card">
          <div class="text-h4 text-center q-pa-sm">Drafts</div>
          <q-list bordered separator>
            <q-item
              v-for="draft in drafts"
              clickable
              :key="draft.id?.toString()"
              @click="editDraft(draft)"
              ><q-item-section>{{ draft.title }}</q-item-section></q-item
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
            <q-btn
              label="draft"
              color="warning"
              :disable="!draftedPost?.title"
              @click="onDraftPost"
            ></q-btn>
            <q-space />
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
import { useIsDirty } from 'src/composables';

const q = useQuasar();
const ratio = ref(250);
const draftedPost: Ref<PostVersion | undefined> = ref();
const drafts: Ref<PostVersion[] | undefined> = ref();

const { draftPost, getDrafts } = usePostStore();

const { changeObj, isDirty } = useIsDirty(draftedPost);

/**
 * load the current draft of all posts
 */
onMounted(async () => {
  drafts.value = await getDrafts();
});

/**
 * change which draft is being edited
 * @param draft the post version to load
 */
const editDraft = (draft: PostVersion) => {
  draftedPost.value = draft;
  changeObj(draftedPost);
};

/**
 * update our model with the updated value
 * @param newVal the updated post version
 */
const updatePost = (newVal: PostVersion) => {
  draftedPost.value = newVal as PostVersion;
};

/**
 * saves the current content of `draftedPost` as a new draft
 */
const onDraftPost = async () => {
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Save post as draft?',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create draft for!');
    await draftPost(draftedPost.value);
  });
};

/**
 * publishes the current draft if not changes have been made,
 * otherwise creates a new draft and publishes that.
 */
const onPublishPost = () => {
  q.dialog({
    component: ConfirmationDialog,
    componentProps: {
      message: 'Do you wish to publish this draft?',
    },
  }).onOk(async () => {
    if (!draftedPost.value) throw new Error('No post to create!');
    if (isDirty.value) {
      draftedPost.value.published = true;
      await draftPost(draftedPost.value);
      return;
    }

    // TODO: publish the current draft
    // await publish_draft(draft_id);
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
