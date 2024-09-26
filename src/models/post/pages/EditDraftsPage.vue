<template>
  <q-page class="n-page edit-post-page">
    <div class="text-h1 text-center">Edit Drafts</div>
    <q-splitter
      class="q-ma-lg"
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
              :class="{ selected: draftedPost?.draft_id === draft.draft_id }"
              @click="editDraft(draft)"
              ><q-item-section>{{ draft.title }}</q-item-section></q-item
            >
          </q-list>
        </q-card>
      </template>
      <template v-slot:after>
        <div v-if="!draftedPost">No published drafts currently exist</div>
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
              :disable="!isDirty || !draftedPost?.title"
              @click="onDraftPost"
            ></q-btn>
            <q-space />
          </template>
        </edit-post>
      </template>
    </q-splitter>
    <!-- TODO: create a no-data component for when there are no drafts (the edit published and post history page will need something like this too) -->
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { PostVersion, usePostStore } from 'src/models/post';
import { EditPost } from 'src/models/post';
import { Ref, onMounted, ref } from 'vue';
import ConfirmationDialog from 'src/dialogs/ConfirmationDialog.vue';
import { useIsDirty } from 'src/composables';
import { useRoute } from 'vue-router';

const q = useQuasar();
const route = useRoute();
const ratio = ref(250);
const draftedPost: Ref<PostVersion | undefined> = ref();
const drafts: Ref<PostVersion[] | undefined> = ref();

const { draftPost, getDrafts, publishDraft } = usePostStore();

const { changeObj, isDirty } = useIsDirty(draftedPost);

/**
 * load the current draft of all posts
 */
onMounted(async () => {
  drafts.value = await getDrafts();
  if (drafts.value.length > 0) {
    if (route.query.draft_id) {
      draftedPost.value =
        drafts.value[
          drafts.value.findIndex((p) => p.draft_id === route.query.draft_id)
        ];
    } else {
      draftedPost.value = drafts.value[0];
    }
  }
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

    if (!isDirty.value) throw new Error('Draft is unchanged! Aborting.');
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
    } else {
      await publishDraft(draftedPost.value.draft_id);
    }
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

  .selected {
    background-color: $accent;
  }
}
</style>
